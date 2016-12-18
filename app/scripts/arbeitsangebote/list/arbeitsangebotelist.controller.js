'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('ArbeitsangeboteListController', ['$scope', 'NgTableParams', 'ArbeitsangeboteListModel',
    'FileUtil', '$location', '$anchorScroll',
    function($scope, NgTableParams, ArbeitsangeboteListModel, FileUtil, $location, $anchorScroll) {
      $scope.arbeitsangebotTableParams = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      ArbeitsangeboteListModel.query(function(data) {
        $scope.entries = data;
        if($scope.arbeitsangebotTableParams) {
          $scope.arbeitsangebotTableParams.reload();
        }
      });

      if (!$scope.arbeitsangebotTableParams) {
        $scope.arbeitsangebotTableParams = new NgTableParams({ // jshint ignore:line
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

      $scope.statusClass = function(arbeitsangebot) {
        if(angular.isDefined(arbeitsangebot)) {
          switch(arbeitsangebot.status) {
            case 'Erstellt':
            case 'Verschickt':
            case 'MahnungVerschickt':
              if(arbeitsangebot.faelligkeitsDatum < new Date()) {
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

      $scope.participate = function(arbeitsangebot) {
        
      };
    }
  ]);
