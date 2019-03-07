'use strict';

angular.module('openolitor-kundenportal').directive('ooArbeitseinsaetzeList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      templateUrl: 'scripts/arbeitseinsaetze/list/arbeitseinsaetzelist.html',
      controller: 'ArbeitseinsaetzeListController'
    };
  }
]);
