(function () {
  'use strict';
  
  describe('ngModel', function () {
    var $scope, $compile, Validator, schema, model, validator, ngModelCtrl;
    
    beforeEach(module('rentler.core'));
    
    beforeEach(inject(function (_$rootScope_, _$compile_, _Validator_) {
      $scope = _$rootScope_;
      $compile = _$compile_;
      Validator = _Validator_;
    }));
    
    beforeEach(function () {
      schema = {
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        middleName: {
          required: false
        }
      };
      
      model = {
        firstName: 'John',
        lastName: 'Doe',
        middleName: ''
      };
      
      validator = Validator.create(schema, model);
    });
    
    beforeEach(function () {
      $scope.vm = {};
      $scope.vm.validator = validator;
      $scope.vm.model = model;
      
      var formElem = angular.element('<form r-validator="vm.validator"></form>');
      var inputElem = angular.element('<input type="text" ng-model="vm.model.firstName" />');
      formElem.append(inputElem);
      $compile(formElem)($scope);

      ngModelCtrl = inputElem.controller('ngModel');
    });
    
    it('it should call validate on $digest', function () {
      expect(validator.errors.firstName).not.toBeDefined();
      expect(validator.errors.lastName).not.toBeDefined();
      expect(validator.errors.middleName).not.toBeDefined();
      $scope.$digest();
      expect(validator.errors.firstName).toBeDefined();
      expect(validator.errors.lastName).toBeDefined();
      expect(validator.errors.middleName).toBeDefined();
    });
    
    it('it should set the validity on ngModelController', function () {
      $scope.$digest();
      
      expect(ngModelCtrl.$valid).toBe(true);
      expect(ngModelCtrl.$invalid).toBe(false);
      
      model.firstName = '';
      $scope.$digest();
      
      expect(ngModelCtrl.$valid).toBe(false);
      expect(ngModelCtrl.$invalid).toBe(true);
    });
  });
  
})();