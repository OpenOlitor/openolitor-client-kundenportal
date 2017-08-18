'use strict';

/**
 */
angular.module('openolitor-kundenportal')

  .factory('OpenProjektModel', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(API_URL + 'open/projekt', {
    }, {'query': {method:'GET', isArray: false},
    'fetchStyle': {
        url: API_URL + 'ressource/style/:style/download',
        method: 'GET',
        responseType: 'arraybuffer',
        transformResponse: function (data) {
            var file;
            if (data) {
                file = new Blob([data], {
                    type: 'text/css'
                });
            }
            return {
                response: file
            };
        }
    }});
  }])
  .factory('ProjektModel', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(API_URL + 'projekt/:id', {
    id: '@id'
    }, {'query': {method:'GET', isArray: false}
  });
  }]);
