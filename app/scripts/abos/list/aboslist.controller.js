'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('AbosListController', ['$scope', 'AbosListModel',
    function($scope, AbosListModel) {

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      AbosListModel.query(function(data) {
        $scope.entries = data;
        angular.forEach($scope.entries, function(abo) {
          abo.zusatzabos = [];
          AbosListModel.zusatzabos({aboId: abo.id}, function(data) {
            abo.zusatzabos = data;
          });
        });
      });
    }
  ]);
