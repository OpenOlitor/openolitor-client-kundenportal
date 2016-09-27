'use strict';

angular.module('openolitor-kundenportal').directive('ooRechnungenList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      templateUrl: 'scripts/rechnungen/list/rechnungenlist.html',
      controller: 'RechnungenListController'
    };
  }
]);
