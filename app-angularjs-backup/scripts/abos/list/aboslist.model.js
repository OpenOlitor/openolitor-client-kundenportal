'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('AbosListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/abos/:id', {
      id: '@id'
    });
  });
