'use strict';

angular.module('openolitor-kundenportal').directive('ooArbeitseinsaetzeList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      template: require('./arbeitseinsaetzelist.html'),
      controller: 'ArbeitseinsaetzeListController'
    };
  }
]);
