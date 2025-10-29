'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('LastLieferplanungenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'open/lastlieferplanungen');
  });
