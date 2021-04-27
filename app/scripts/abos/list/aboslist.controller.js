'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('AbosListController', ['$scope', 'AbosListModel', 'moment',
    function($scope, AbosListModel, moment) {

      $scope.entries = [];
      $scope.entriesFiltered = [];
      $scope.hasAbgelaufen = false;
      $scope.showAbgelaufen = false;
      $scope.loading = false;
      $scope.model = {};

      $scope.filterEntries = function() {
        if($scope.showAbgelaufen) {
          $scope.entriesFiltered = $scope.entries;
        } else {
          $scope.entriesFiltered = [];
          angular.forEach($scope.entries, function(abo) {
            if(!abo.ende || !moment(abo.ende).isBefore(new Date())) {
              $scope.entriesFiltered.push(abo);
            } else {
              $scope.hasAbgelaufen = true;
            }
          });
        }
      }

      AbosListModel.query(function(data) {
        $scope.entries = data;
        $scope.filterEntries();
      });

      $scope.showAll = function() {
        $scope.showAbgelaufen = true;
        $scope.filterEntries();
      };
    }
  ]);
