// Copyright 2002-2013, University of Colorado Boulder

/**
 * The large horizontal panel at the bottom of the screen for selecting different representations.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var InOutRadioButton = require( 'SUN/InOutRadioButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function RepresentationPanel( representationProperty, options ) {
    options = _.extend( {fill: '#efe8e1'}, options );

    var iconScale = 0.75;
    var representations = ['horizontal-bar', 'vertical-bar', 'circle', 'chocolate', 'different-sized-circles'];
    var icons = {};

    //Have to use mixed [] and dot notation to satisfy jshint
    icons['horizontal-bar'] = new Rectangle( 0, 0, 50 * iconScale, 30 * iconScale, {fill: '#208644', lineWidth: 1, stroke: 'black'} );
    icons['vertical-bar'] = new Rectangle( 0, 0, 14 * iconScale, 50 * iconScale, {fill: 'red', lineWidth: 1, stroke: 'black'} );
    icons.circle = new Circle( 22 * iconScale, {fill: '#145991', lineWidth: 1, stroke: 'black'} );
    icons.chocolate = new Rectangle( 0, 0, 50 * iconScale, 40 * iconScale, {fill: '#563329', lineWidth: 1, stroke: 'black'} );
    icons['different-sized-circles'] = new Node( {children: [
      new Circle( 20 * iconScale, {fill: '#f0d041', lineWidth: 1, stroke: 'black', x: 26, y: -26} ),
      new Circle( 12 * iconScale, {fill: '#f0d041', lineWidth: 1, stroke: 'black'} )]} );

    var maxWidth = -1;
    var maxHeight = -1;
    representations.forEach( function( representation ) {
      maxWidth = Math.max( maxWidth, icons[representation].width );
      maxHeight = Math.max( maxHeight, icons[representation].height );
    } );
    console.log( maxWidth, maxHeight );

    function paddedNode( content, width, height ) {
      content.centerX = width / 2;
      content.centerY = height / 2;
      return new Node( {children: [
        new Rectangle( 0, 0, width, height ),
        content
      ]} );
    }

    var widthWithPadding = maxWidth + 2;
    var heightWithPadding = maxHeight + 2;

    var children = representations.map( function( representation ) {
      return new InOutRadioButton( representationProperty, representation, paddedNode( icons[representation], widthWithPadding, heightWithPadding ) );
    } );

    var content = new HBox( {
      spacing: 20,
      children: children
    } );
    Panel.call( this, content, options );
  }

  return inherit( Panel, RepresentationPanel );
} );