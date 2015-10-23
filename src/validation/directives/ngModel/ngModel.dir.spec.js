(function () {
  'use strict';
  
  describe('ngModel', function () {
	var Validatable, User, $scope, element, ngModelCtrl;
	
	beforeEach(module('rentler.core'));
	
	beforeEach(inject(function (_Validatable_) {
	  Validatable = _Validatable_;
	}));
	
  beforeEach(function () {
    User = {
      schema: {
        firstName: {
          required: true,
          alphanumeric: {
            message: function () {
              return 'Custom function error';
            }
          }
        }
      }
    };

    _.assign(User, _.cloneDeep(Validatable));
  });
	
	beforeEach(inject(function ($compile, $rootScope) {
	  $scope = $rootScope;
	  $scope.user = User;
	  
	  element = angular.element('<input type="text" ng-model="user.firstName" />');
	  $compile(element)($rootScope);
	  
	  ngModelCtrl = element.controller('ngModel');
    
    $scope.$digest();
	}));
	
	it('should call validate on digest', function () {
      $scope.$digest();
	  expect($scope.user.validation.errors).toBeDefined();
	  expect($scope.user.validation.errors.firstName).toBeDefined();
	});
	
	it('should set validity on NgModelController', function () {
	  $scope.$digest();
	  expect(ngModelCtrl.$valid).toBe(false);
	  expect(ngModelCtrl.$invalid).toBe(true);
	  
	  $scope.user.firstName = 'Bob';
	  $scope.$digest();
	  expect(ngModelCtrl.$valid).toBe(true);
	  expect(ngModelCtrl.$invalid).toBe(false);
	});
  });
  
}());