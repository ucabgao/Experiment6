// Copyright 2002-2013, University of Colorado Boulder

/**
 * The horizontal number line that shows the values
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function NumberLineNode( leftFractionProperty, rightFractionProperty, visibleProperty, options ) {
    Node.call( this );

    var width = 300;
    var line = new Line( 0, 0, width, 0, {lineWidth: 2, stroke: 'black'} );

    this.addChild( line );

    var leftRectangle = new Rectangle( 0, -20, width, 20, {fill: 'blue', lineWidth: 1, stroke: 'black'} );
    this.addChild( leftRectangle );
    var rightRectangle = new Rectangle( 0, -40, width, 20, {fill: 'green', lineWidth: 1, stroke: 'black'} );
    this.addChild( rightRectangle );

    visibleProperty.linkAttribute( leftRectangle, 'visible' );
    visibleProperty.linkAttribute( rightRectangle, 'visible' );

    leftFractionProperty.link( function( leftFraction ) { leftRectangle.setRectWidth( leftFraction * width ); } );
    rightFractionProperty.link( function( rightFraction ) { rightRectangle.setRectWidth( rightFraction * width ); } );

    var lines = [];
    for ( var i = 0; i <= 12; i++ ) {
      var distance = i / 12 * width;
      var lineHeight = i === 0 ? 16 :
                       i === 12 ? 16 :
                       8;
      var segment = new Line( distance, -lineHeight / 2, distance, lineHeight / 2, {lineWidth: (i === 0 || i === 12) ? 1.5 : 1, stroke: 'black'} );
      this.addChild( segment );
      lines.push( segment );
    }

    this.addChild( new Text( '0', {centerX: lines[0].centerX, top: lines[0].bounds.maxY, font: new PhetFont( { size: 18} )} ) );
    this.addChild( new Text( '1', {centerX: lines[lines.length - 1].centerX, top: lines[lines.length - 1].bounds.maxY, font: new PhetFont( { size: 18} )} ) );

    this.mutate( options );
  }

  return inherit( Node, NumberLineNode );
} );