'use strict';

describe('Controller: AbosListController', function() {
  // load the controller's module
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('openolitor-kundenportal'));

  var controller, $scope, $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$q_) {
    $q = _$q_;
    $scope = $rootScope.$new();

    var mockAbosListModel = {
      query: function() {
        return $q.when([]);
      }
    };

    controller = $controller('AbosListController', {
      $scope: $scope,
      AbosListModel: mockAbosListModel
    });
  }));

  it('should initialize scope variables', function() {
    expect($scope.loading).toBeDefined();
  });
});
