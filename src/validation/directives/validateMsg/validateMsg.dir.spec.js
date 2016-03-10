(function () {
  'use strict';
  
  describe('r-valdiate-msg', function () {
	  var $scope, $compile, $templateCache, Validator, schema, model, validator, formElem, elem;
	
    beforeEach(module('rentler.core'));
    
    beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _Validator_) {
      $scope = _$rootScope_;
      $compile = _$compile_;
      $templateCache = _$templateCache_;
      Validator = _Validator_;
    }));
    
    beforeEach(function () {
      $templateCache.put('validation/directives/validateMsg/validateMsg.html', '<div ng-if="messages.length > 0">error</div>');
    });
    
    beforeEach(function () {
      schema = {
        firstName: {
          required: true
        }
      };
      
      model = {
        firstName: ''
      };
      
      validator = Validator.create(schema, model);
    });
	
	beforeEach(function () {
    $scope.vm = {};
	  $scope.vm.model = model;
    $scope.vm.validator = validator;
	  
	  formElem = angular.element('<form r-validator="vm.validator"><div r-validate-msg="vm.model.firstName"></div></form>');
	  $compile(formElem)($scope);
	  
	  elem = angular.element(formElem.children()[0]);
	});
	
    it('should not show errors until the form is submitted', function () {
      $scope.$digest();
      elem = angular.element(formElem.children()[0]);
      expect(elem.text()).toBe('');
    });
    
    it('should show errors when the form is submitted', function () {
      validator.validate();
      formElem.triggerHandler('submit');
      $scope.$digest();
      elem = angular.element(formElem.children()[0]);
      expect(elem.text()).toBe('error');
    });
  });
  
})();