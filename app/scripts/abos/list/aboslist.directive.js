'use strict';

angular.module('openolitor-kundenportal').directive('ooAbosList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      template: require('./aboslist.html'),
      controller: 'AbosListController'
    };
  }
]);
