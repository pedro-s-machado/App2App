var exec = require('cordova/exec'),
  channel = require('cordova/channel'),

  // Reference name for the plugin
  PLUGIN_NAME = 'UniversalLinks',

  // Default event name that is used by the plugin
  DEFAULT_EVENT_NAME = 'didLaunchAppFromLink';

// Plugin methods on the native side that can be called from JavaScript
pluginNativeMethod = {
  SUBSCRIBE: 'jsSubscribeForEvent',
  UNSUBSCRIBE: 'jsUnsubscribeFromEvent'
};

var universalLinks = {

  obtainurl: function() {
    uri = this.getIntent().getData();
    url1 = new URL(uri.getScheme(), uri.getHost(), uri.getPath());
    return uri1;
  },
  /**
   * Subscribe to event.
   * If plugin already captured that event - callback will be called immidietly.
   *
   * @param {String} eventName - name of the event you are subscribing on; if null - default plugin event is used
   * @param {Function} callback - callback that is called when event is captured
   */
  subscribe: function(eventName, callback) {
    if (!callback) {
      console.warn('Universal Links: can\'t subscribe to event without a callback');
      return;
    }

    if (!eventName) {
      eventName = DEFAULT_EVENT_NAME;
    }

    var innerCallback = function(msg) {
      console.log('Callback chamada iniciada')
      callback(msg.data);
      console.log('Callback chamada finalizada')
    };

    exec(innerCallback, null, PLUGIN_NAME, pluginNativeMethod.SUBSCRIBE, [eventName]);
  },

  /**
   * Unsubscribe from the event.
   *
   * @param {String} eventName - from what event we are unsubscribing
   */
  unsubscribe: function(eventName) {
    if (!eventName) {
      eventName = DEFAULT_EVENT_NAME;
    }

    exec(null, null, PLUGIN_NAME, pluginNativeMethod.UNSUBSCRIBE, [eventName]);
  }
};

module.exports = universalLinks;


if (!cordova.plugins) {
    cordova.plugins = {};
};

if (!cordova.plugins.UniversalLinks) {
    cordova.plugins.UniversalLinks = universalLinks;
};
