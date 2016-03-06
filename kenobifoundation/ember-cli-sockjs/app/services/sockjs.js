import Ember from 'ember';
import SockJsProxy from 'ember-cli-sockjs/helpers/sockjs-proxy';
import SockJSClient from 'sockjs';

var forEach = Ember.EnumerableUtils.forEach;
var filter = Ember.EnumerableUtils.filter;

export default Ember.Service.extend({

  /*
  * Each element in the array is of form:
  *
  * {
  *    url: 'string'
  *    socket: WebSocket Proxy object
  * }
  */
  sockets: null,

  init() {
    this._super(...arguments);
    this.sockets = Ember.A();
  },

  /*
  * socketFor returns a websocket proxy object. On this object there is a property `socket`
  * which contains the actual websocket object. This websocket object is cached based off of the url meaning
  * multiple requests for the same socket will return the same object.
  */
  socketFor(url) {
    var sockets;
    var proxy = this.findSocketInCache(this.get('sockets'), url);

    if (proxy && this.websocketIsNotClosed(proxy.socket)) { return proxy.socket; }

    proxy = SockJsProxy.create({
      content: this,
      socket: new SockJSClient(this.normalizeURL(url))
    });

    this.get('sockets').pushObject({
      url: proxy.socket.url,
      socket: proxy
    });

    return proxy;
  },

  /*
  * closeSocketFor closes the socket for a given url.
  */
  closeSocketFor(url) {
    var filteredSockets = [];

    forEach(this.get('sockets'), item => {
      if(item.url === this.normalizeURL(url)) {
        item.socket.close();
      }
      else {
        filteredSockets.push(item);
      }
    });

    this.set('sockets', filteredSockets);
  },

  /*
  * The native websocket object will transform urls without a pathname to have just a /.
  * As an example: ws://localhost:8080 would actually be ws://localhost:8080/ but ws://example.com/foo would not
  * change. This function does this transformation to stay inline with the native websocket implementation.
  *
  */
  normalizeURL(url) {
    //var parsedUrl = new URI(url);

    //if(parsedUrl.path() === '/' && url.slice(-1) !== '/') {
   //   return url + '/';
  //  }

    return url;
  },

  websocketIsNotClosed(websocket) {
    return websocket.socket.readyState !== window.WebSocket.CLOSED;
  },

  /*
  * Returns the socket object from the cache if one matches the url else undefined
  */
  findSocketInCache(socketsCache, url) {
    var cachedResults = filter(socketsCache, websocket => {
      return websocket['url'] === this.normalizeURL(url);
    });

    if(cachedResults.length > 0) {
      return cachedResults[0];
    }
  }
});
