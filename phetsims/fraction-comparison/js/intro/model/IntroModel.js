// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Intro' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FractionModel = require( 'FRACTION_COMPARISON/intro/model/FractionModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  function IntroModel() {
    this.leftFractionModel = new FractionModel();
    this.rightFractionModel = new FractionModel();
    PropertySet.call( this, {
      numberLineVisible: false,
      representation: 'horizontal-bar'
    } );

    this.bothCompareProperty = new DerivedProperty( [this.leftFractionModel.stateProperty, this.rightFractionModel.stateProperty], function( leftState, rightState ) {
      return leftState === 'compare' && rightState === 'compare';
    } );
  }

  inherit( PropertySet, IntroModel, {
    step: function() {
      //TODO: use dt
    },
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.leftFractionModel.reset();
      this.rightFractionModel.reset();
    }
  } );

  return IntroModel;
} );