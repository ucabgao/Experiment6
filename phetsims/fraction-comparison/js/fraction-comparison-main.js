// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Fraction Comparison' sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var IntroScreen = require( 'FRACTION_COMPARISON/intro/IntroScreen' );

  // strings
  var simTitle = require( 'string!FRACTION_COMPARISON/fraction-comparison.name' );

//  var screens = [ new IntroScreen(), new GameScreen( {practice: false} ), new GameScreen( {practice: true} )];
  var screens = [ new IntroScreen()];

  var simOptions = {
    credits: {
      leadDesign: 'Karina Hensberry',
      softwareDevelopment: 'Sam Reid',
      designTeam: 'Karina Hensberry, Bryce Gruneich, Ariel Paul, Trish Loeblein, Kathy Perkins',
      graphicArts: 'Sharon Siman-Tov'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, screens, simOptions );
    sim.start();
  } );
} );