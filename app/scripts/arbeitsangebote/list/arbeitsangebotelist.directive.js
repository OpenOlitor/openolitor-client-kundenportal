'use strict';

angular.module('openolitor-kundenportal').directive('ooArbeitsangeboteList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      template: require('./arbeitsangebotelist.html'),
      controller: 'ArbeitsangeboteListController'
    };
  }
]);
