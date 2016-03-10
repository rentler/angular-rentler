(function () {
  'use strict';
  
  describe('r-validator', function () {
    var $scope, $compile, Validator, validator;
    
    beforeEach(module('rentler.core'));
    
    beforeEach(inject(function (_$rootScope_, _$compile_, _Validator_) {
      $scope = _$rootScope_;
      $compile = _$compile_;
      Validator = _Validator_;
    }));
    
    beforeEach(function () {
      var schema = {
        firstName: {
          required: true
        }
      };
      
      var model = {
        firstName: 'john'
      };
      
      validator = Validator.create(schema, model);
    });
    
    it('should throw an error if given a bad validator', function () {
      var elem = angular.element('<form r-validator="badValidator"></form>');

      expect(function() { $compile(elem)($scope); }).toThrow();
    });
    
    it('should add a validator field to the controller that is bound', function () {
      $scope.vm = {};
      $scope.vm.validator = validator;
      
      var elem = angular.element('<form r-validator="vm.validator"></form>');
      $compile(elem)($scope);
      
      var ctrl = elem.controller('rValidator');
      
      expect(ctrl.validator).toEqual(validator);
    });
  });
  
})();