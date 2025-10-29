'use strict';

angular.module('openolitor-kundenportal').directive('ooOverviewfilterGeschaeftsjahre', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selectedFunct: '&',
        select: '=?',
        disabled: '=',
        selectCurrent: '=?'
      },
      transclude: true,
      templateUrl: 'scripts/util/overviewfiltergeschaeftsjahre/overviewfiltergeschaeftsjahre.controller.html',
      controller: 'OverviewfilterGeschaeftsjahreController'
    };
  }
]);
