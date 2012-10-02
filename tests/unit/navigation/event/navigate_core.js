(function( $) {
	module( "navigate", {
		setup: function() {
			location.hash = "";
		}
	});

	asyncTest( "changes to the url trigger a navigate", function() {
		$( window ).one( "navigate", function( event, data ) {
			ok( true, "navigate called" );
			start();
		});

		location.hash = "foo";
	});

	asyncTest( "traversing history back fires a navigate", function() {
		expect( 2 );

		$( window ).one( "navigate", function( event, data ) {
			ok( true, "navigate called on hash change" );

			$( window ).one( "navigate", function( event, data ) {
				ok( true, "navigate called on back button" );

				start();
			});

			window.history.back();
		});

		location.hash = "foo";
	});

	if( $.support.pushState ) {
		asyncTest( "popstate navigation events are marked", function() {
			$( window ).one( "navigate", function( event, data ) {
				equal( data.from, "popstate", "tagged as popstate" );
				start();
			});

			location.hash = "foo";
		});

		asyncTest( "popstate navigation events contain pushed state", function() {
			$( window ).one( "navigate", function( event, data ) {
				$( window ).one( "navigate", function( event, data ) {
					equal( data.state.foo, "bar", "tagged as popstate" );
					start();
				});

				window.history.back();
			});

			window.history.replaceState({ foo: "bar" }, document.title, location.href.replace(/#.*/, "" ) + "#foo");
			location.hash = "#foo2";
		});
	}
})( jQuery );