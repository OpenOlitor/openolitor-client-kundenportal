'use strict';

angular.module('openolitor-kundenportal').directive('ooAboKorbinhalt', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/list/lieferungen/lieferungen.html',
      controller: 'LieferungenListController'
    };
  }
]);
