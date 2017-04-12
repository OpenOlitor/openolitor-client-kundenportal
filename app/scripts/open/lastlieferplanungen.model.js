'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('LastLieferplanungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'open/lastlieferplanungen');
  });
