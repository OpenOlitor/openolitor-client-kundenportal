'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('AbosListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/abos/:id', {
      id: '@id'
    }, {
      zusatzabos: {
        url: API_URL + 'kundenportal/abos/:aboId/zusatzabos/:id',
        method: 'GET',
        isArray: true
    }});
  });
