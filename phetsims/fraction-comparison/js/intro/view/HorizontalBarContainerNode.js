// Copyright 2002-2013, University of Colorado Boulder

/**
 * The draggable container node for horizontal bars
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var NodeDragHandler = require( 'FRACTION_COMPARISON/intro/view/NodeDragHandler' );
  var Events = require( 'AXON/Events' );
  var Property = require( 'AXON/Property' );

  /**
   *
   * @param {Property<number>} fractionProperty The value of the fraction
   * @param {string} color
   * @param {function} startPositionFunction a function taking args (width,height) to compute the start center of the node
   * @param {function} comparePositionFunction a function taking args (width,height) to compute the center position of the node when compared
   * @param options
   * @constructor
   */
  function HorizontalBarContainerNode( fractionProperty, color, stateProperty, startPositionFunction, comparePositionFunction, options ) {
    var horizontalBarContainerNode = this;

    this.stateProperty = stateProperty;

    options = _.extend( {cursor: 'pointer'}, options );
    Node.call( this );
    this.events = new Events();

    var border = new Rectangle( 0, 0, 180, 100, {stroke: 'black', lineWidth: 1} );
    this.addChild( border );

    this.contents = new Rectangle( 0, 0, fractionProperty.get() * 180, 100, {fill: color, stroke: 'black', lineWidth: 1} );
    fractionProperty.link( function( value ) {
      horizontalBarContainerNode.contents.setRectWidth( value * 180 );
      horizontalBarContainerNode.events.trigger( 'changed' );
    } );
    this.addChild( this.contents );

    this.mutate( options );
    this.startPosition = startPositionFunction( this.width, this.height );
    this.comparePosition = comparePositionFunction( this.width, this.height );

    this.center = this.startPosition;
    this.addInputListener( new NodeDragHandler( this, {
      startDrag: function() {
        horizontalBarContainerNode.stateProperty.set( 'dragging' );
      },
      drag: function() {
        //TODO: is 'changed' still used now that overlay is gone?
        horizontalBarContainerNode.events.trigger( 'changed' );
      },
      endDrag: function() {
        //Move to the start position or compare position, whichever is closer.
        var center = horizontalBarContainerNode.center;
        var distToStart = horizontalBarContainerNode.startPosition.distance( center );
        var distToCompare = horizontalBarContainerNode.comparePosition.distance( center );

        //TODO: animate continuously instead of jumping
        horizontalBarContainerNode.center = distToStart < distToCompare ? horizontalBarContainerNode.startPosition : horizontalBarContainerNode.comparePosition;
        horizontalBarContainerNode.stateProperty.set( distToStart < distToCompare ? 'start' : 'compare' );
      }
    } ) );
  }

  return inherit( Node, HorizontalBarContainerNode, {
    animateToComparison: function() {
      this.center = this.comparePosition;
      this.stateProperty.set( 'compare' );
    },
    animateToStart: function() {
      this.center = this.startPosition;
      this.stateProperty.set( 'start' );
    }
  } );
} );