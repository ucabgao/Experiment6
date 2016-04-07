// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Intro' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var FractionNode = require( 'FRACTION_COMPARISON/intro/view/FractionNode' );
  var ComparisonRegion = require( 'FRACTION_COMPARISON/intro/view/ComparisonRegion' );
  var HorizontalBarContainerNode = require( 'FRACTION_COMPARISON/intro/view/HorizontalBarContainerNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Vector2 = require( 'DOT/Vector2' );

  var RepresentationPanel = require( 'FRACTION_COMPARISON/intro/view/RepresentationPanel' );
  var NumberLineNode = require( 'FRACTION_COMPARISON/intro/view/NumberLineNode' );

  function IntroView( model ) {

    var introView = this;
    ScreenView.call( introView, { renderer: 'svg' } );

    //Representation panel at the bottom center
    var representationPanel = new RepresentationPanel( model.property( 'representation' ), {bottom: this.layoutBounds.maxY - 5, centerX: this.layoutBounds.centerX} );
    this.addChild( representationPanel );

    var numberLineNode = new NumberLineNode( model.leftFractionModel.property( 'fraction' ), model.rightFractionModel.property( 'fraction' ), model.property( 'numberLineVisible' ),
      {centerX: this.layoutBounds.centerX, bottom: representationPanel.top - 70} );
    this.addChild( numberLineNode );

    //TODO: Manually tuned to be centered on the number line part.  Could be affected based on the font, would be superior to lay out based on global bounds of number line
    this.addChild( new CheckBox( new Node(), model.property( 'numberLineVisible' ), {top: numberLineNode.bounds.maxY + 20, centerX: numberLineNode.centerX, scale: 1.15} ) );

    this.addChild( new ResetAllButton( model.reset.bind( model ), {
      radius: 24,
      touchAreaRadius: 24 * 1.3,
      right: this.layoutBounds.maxX - 2,
      bottom: this.layoutBounds.maxY - 2
    } ) );

    //To make it possible to drag pieces from the left over pieces in the right, we cannot just make subtrees for the left and right views
    //So model the pieces individually

    var distanceFromSideToFraction = 50;
    var leftFractionNode = new FractionNode( model.leftFractionModel.property( 'numerator' ), model.leftFractionModel.property( 'denominator' ), {
      left: distanceFromSideToFraction,
      bottom: representationPanel.bounds.minY
    } );
    this.addChild( leftFractionNode );

    var rightFractionNode = new FractionNode( model.rightFractionModel.property( 'numerator' ), model.rightFractionModel.property( 'denominator' ), {
      right: this.layoutBounds.maxX - distanceFromSideToFraction,
      bottom: representationPanel.bounds.minY
    } );
    this.addChild( rightFractionNode );

    var compareButtonPressed = function() {
      leftHorizontalBarContainerNode.animateToComparison();
      rightHorizontalBarContainerNode.animateToComparison();
    };

    var separateButtonPressed = function() {
      leftHorizontalBarContainerNode.animateToStart();
      rightHorizontalBarContainerNode.animateToStart();
    };

    var comparisonRegion = new ComparisonRegion( compareButtonPressed, separateButtonPressed, model.bothCompareProperty, {top: 10, centerX: this.layoutBounds.centerX} );
    this.addChild( comparisonRegion );

    //Containers
    var leftHorizontalBarContainerNode = new HorizontalBarContainerNode( model.leftFractionModel.property( 'fraction' ), 'green', model.leftFractionModel.stateProperty, function( width, height ) {
      return new Vector2( width / 2 + 10, comparisonRegion.bounds.centerY );
    }, function( width, height ) {
      return new Vector2( introView.layoutBounds.centerX, comparisonRegion.bounds.centerY );
    }, {} );

    var rightHorizontalBarContainerNode = new HorizontalBarContainerNode( model.rightFractionModel.property( 'fraction' ), 'blue', model.rightFractionModel.stateProperty, function( width, height ) {
      return new Vector2( introView.layoutBounds.maxX - width / 2 - 10, comparisonRegion.bounds.centerY );
    }, function( width, height ) {
      return new Vector2( introView.layoutBounds.centerX, comparisonRegion.bounds.centerY );
    }, {} );

    this.addChild( leftHorizontalBarContainerNode );
    this.addChild( rightHorizontalBarContainerNode );

    var leftDottedLineContainerNode = new Rectangle( 0, 0, 180, 100, {stroke: 'green', lineWidth: 10, lineDash: [20, 20]} );
    model.leftFractionModel.property( 'fraction' ).link( function( value ) {
      leftDottedLineContainerNode.setRectWidth( value * 180 );
    } );

    leftDottedLineContainerNode.left = leftHorizontalBarContainerNode.comparePosition.x - leftHorizontalBarContainerNode.width / 2 - 5;
    leftDottedLineContainerNode.centerY = leftHorizontalBarContainerNode.comparePosition.y;

    var leftValueSmallerProperty = new DerivedProperty( [model.leftFractionModel.property( 'fraction' ), model.rightFractionModel.property( 'fraction' )], function( leftFraction, rightFraction ) {
      return leftFraction <= rightFraction;
    } );

    model.bothCompareProperty.and( leftValueSmallerProperty ).linkAttribute( leftDottedLineContainerNode, 'visible' );
    this.addChild( leftDottedLineContainerNode );
  }

  //TODO: redo layout so things float to the sides (and bottom)
  return inherit( ScreenView, IntroView );
} );