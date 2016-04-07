// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Intro' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Screen = require( 'JOIST/Screen' );
  var IntroModel = require( 'FRACTION_COMPARISON/intro/model/IntroModel' );
  var IntroView = require( 'FRACTION_COMPARISON/intro/view/IntroView' );
  var Text = require( 'SCENERY/nodes/Text' );

  var screenTitle = 'Intro';

  function IntroScreen() {
    Screen.call( this,
      screenTitle,
      new Text( 'hello' ),
      function() { return new IntroModel(); },
      function( model ) { return new IntroView( model, ModelViewTransform2.createIdentity() ); },
      {backgroundColor: '#e1f1f1'}
    );
  }

  return inherit( Screen, IntroScreen );
} );