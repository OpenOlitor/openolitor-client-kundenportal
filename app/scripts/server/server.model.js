'use strict';

/**
 */
angular
  .module('openolitor-kundenportal')
  .factory('ServerModel', function($resource, appConfig) {
    return $resource(
      appConfig.get().API_URL + 'status/staticInfo/',
      {},
      { query: { method: 'GET', isArray: false } }
    );
  });
