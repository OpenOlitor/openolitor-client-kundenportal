'use strict';

/**
 */
angular.module('openolitor-kundenportal').factory('ServerService', [
  '$rootScope',
  'ServerModel',
  function($rootScope, ServerModel) {
    var staticServerInfo;

    var load = function() {
      ServerModel.query({}, function(result) {
        staticServerInfo = result;
      });
    };
    load();

    return {
      getStaticServerInfo: function() {
        return staticServerInfo;
      }
    };
  }
]);
