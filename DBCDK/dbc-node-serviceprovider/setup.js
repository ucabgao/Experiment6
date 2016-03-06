'use strict';

/**
 *@file
 * This is an example file for setting up the serviceprovider
 */

import Provider from './src/Provider.js';

const provider = new Provider({/* config.js*/});


provider.bootstrap();

provider.registerClient({/* client */});
provider.registerTransform({
  request() {
    let requests = [];
    requests.push = this.callService('getResult', {});
    requests.push = this.callTransform('getCoverImage', {});
  }
});

const event = provider.trigger('some event');

event.then((event, value) => {
  // do something with the event
});


onConnection(() => {
  const provider = new Provider();
  provider.trigger();
  provider.then()
});

const ReqisterClient = {
  register() {

  }
}

const ClientCache =  {
  wrap(methods) {

  }
}