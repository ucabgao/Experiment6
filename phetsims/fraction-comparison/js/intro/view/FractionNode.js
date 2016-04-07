// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node for the left/right fraction with up/down spinners for denominator/numerator
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Line = require( 'SCENERY/nodes/Line' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var UpDownSpinner = require( 'FRACTION_COMPARISON/intro/view/UpDownSpinner' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function FractionNode( numeratorProperty, denominatorProperty, options ) {
    Node.call( this );
    var font = new PhetFont( { size: 84} );
    var numeratorNode = new Text( numeratorProperty.get(), { font: font } );

    numeratorProperty.link( function( value ) { numeratorNode.text = value + ''; } );

    var denominatorNode = new Text( denominatorProperty.get(), { font: font } );
    denominatorProperty.link( function( value ) {denominatorNode.text = value + '';} );

    //TODO: use bounding box of max bounds to ensure always to the right?
//    var numbers = _.range( 1, 10, 1 );
//    var numberNodes = numbers.map( function( number ) {
//      return new Text( number + '', {font: font} )
//    } );
//    var maxWidth = -1;
//    var maxHeight = -1;
//    numberNodes.forEach( function( node ) {
//      maxWidth = Math.max( maxWidth, node.width );
//      maxHeight = Math.max( maxHeight, node.height );
//    } );
//    this.children = numberNodes;

    var line = new Line( 0, 0, 80, 0, {lineWidth: 4, stroke: 'black'} );
    this.addChild( line );

    numeratorNode.mutate( {centerX: line.centerX, bottom: line.bounds.minY - 2} );
    denominatorNode.mutate( {centerX: line.centerX, top: line.bounds.maxY - 2} );

    this.addChild( numeratorNode );
    this.addChild( denominatorNode );

    var numeratorUpEnabledProperty = new DerivedProperty( [numeratorProperty, denominatorProperty], function( numerator, denominator ) { return numerator < denominator; } );
    var numeratorDownEnabledProperty = new DerivedProperty( [numeratorProperty], function( numerator ) { return numerator > 0; } );
    var denominatorUpEnabledProperty = new DerivedProperty( [denominatorProperty], function( denominator ) { return denominator < 10;} );
    var denominatorDownEnabledProperty = new DerivedProperty( [ numeratorProperty, denominatorProperty], function( numerator, denominator ) { return denominator > 1 && numerator < denominator;} );

    var numeratorSpinner = new UpDownSpinner( numeratorProperty, numeratorUpEnabledProperty, numeratorDownEnabledProperty );
    var denominatorSpinner = new UpDownSpinner( denominatorProperty, denominatorUpEnabledProperty, denominatorDownEnabledProperty );

    var spinners = new VBox( {spacing: 20, children: [numeratorSpinner, denominatorSpinner], left: line.bounds.maxX, centerY: line.bounds.centerY} );
    this.addChild( spinners );

    this.mutate( options );
  }

  return inherit( Node, FractionNode );
} );