'use strict';

angular.module('openolitor-kundenportal').directive('ooAbosList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      templateUrl: 'scripts/abos/list/aboslist.html',
      controller: 'AbosListController'
    };
  }
]);
