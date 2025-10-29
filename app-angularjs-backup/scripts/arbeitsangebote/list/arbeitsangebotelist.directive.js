'use strict';

angular.module('openolitor-kundenportal').directive('ooArbeitsangeboteList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      templateUrl: 'scripts/arbeitsangebote/list/arbeitsangebotelist.html',
      controller: 'ArbeitsangeboteListController'
    };
  }
]);
