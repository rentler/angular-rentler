(function () {
  'use strict';
  
  describe('rValidateClass', function () {
	var Validation, Validatable, User, $scope, formElement, element;
	
	beforeEach(module('rentler.core'));
	
	beforeEach(inject(function(_Validation_, _Validatable_) {
	  Validation = _Validation_;
	  Validatable = _Validatable_;
	}));
	
	beforeEach(function () {
	  User = {
		schema: {
		  firstName: {
		    required: true,
		  }
		}
	  };
	
	  _.assign(User, _.cloneDeep(Validatable));
	});
	
	beforeEach(inject(function ($compile, $rootScope) {
	  $scope = $rootScope;
	  $scope.user = User;
	  
	  formElement = angular.element('<form><div r-validate-class="user.firstName"></div></form>');
	  $compile(formElement)($rootScope);
	  
	  element = angular.element(formElement.children()[0]);
	}));
	
	it('should not add classes to the element until form is submitted', function () {
	  $scope.$digest();
	  expect(element.hasClass(Validation.getClasses().error)).toBe(false);
	  expect(element.hasClass(Validation.getClasses().success)).toBe(false);
	});
	
	it('should add error class exclusively to element when invalid', function () {
	  $scope.user.validate();
	  formElement.triggerHandler('submit');
	  $scope.$digest();

	  expect(element.hasClass(Validation.getClasses().error)).toBe(true);
	  expect(element.hasClass(Validation.getClasses().success)).toBe(false);
	});
	
	it('should add success class exclusively to element when valid', function () {
      $scope.user.firstName = 'John';
	  $scope.user.validate();
	  formElement.triggerHandler('submit');
	  $scope.$digest();

	  expect(element.hasClass(Validation.getClasses().error)).toBe(false);
	  expect(element.hasClass(Validation.getClasses().success)).toBe(true);
	});
  });
  
}());