'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('ArbeitseinsaetzeListController', ['$scope', 'NgTableParams', 'ArbeitseinsaetzeListModel',
    'FileUtil', '$location', '$anchorScroll',
    function($scope, NgTableParams, ArbeitseinsaetzeListModel, FileUtil, $location, $anchorScroll) {
      $scope.arbeitseinsatzTableParams = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      ArbeitseinsaetzeListModel.query(function(data) {
        $scope.entries = data;
        if($scope.arbeitseinsatzTableParams) {
          $scope.arbeitseinsatzTableParams.reload();
        }
      });

      if (!$scope.arbeitseinsatzTableParams) {
        $scope.arbeitseinsatzTableParams = new NgTableParams({ // jshint ignore:line
          counts: [],
          sorting: {
            datum: 'asc'
          }
        }, {
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            params.total($scope.entries.length);
            return $scope.entries;
          }

        });
      }

      $scope.statusClass = function(arbeitseinsatz) {
        if(angular.isDefined(arbeitseinsatz)) {
          switch(arbeitseinsatz.status) {
            case 'Erstellt':
            case 'Verschickt':
            case 'MahnungVerschickt':
              if(arbeitseinsatz.faelligkeitsDatum < new Date()) {
                return 'fa-circle-o red';
              } else {
                return 'fa-circle-o';
              }
              break;
            case 'Bezahlt':
              return 'fa-check-circle-o';
            case 'Storniert':
              return 'fa-times-circle-o';
          }
        }
        return '';
      };

      $scope.gotoAbo = function(aboId) {
        $location.hash('abo' + aboId);
        $anchorScroll();
      };
    }
  ]);
