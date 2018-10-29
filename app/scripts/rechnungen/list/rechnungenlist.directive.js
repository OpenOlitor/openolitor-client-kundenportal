'use strict';

angular.module('openolitor-kundenportal').directive('ooRechnungenList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      template: require('./rechnungenlist.html'),
      controller: 'RechnungenListController'
    };
  }
]);
