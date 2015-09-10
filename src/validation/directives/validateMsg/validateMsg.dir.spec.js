(function () {
  'use strict';
  
  describe('r-valdiate-msg', function () {
	var $templateCache, Validatable, User, $scope, formElement, element;
	
	beforeEach(module('rentler.core'));
	
	beforeEach(inject(function (_$templateCache_, _$httpBackend_, _Validatable_) {
	  $templateCache = _$templateCache_;
	  $templateCache.put('validation/directives/validateMsg/validateMsg.html', '<div ng-if="messages.length > 0">error</div>');
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
	  
	  formElement = angular.element('<form><div r-validate-msg="user.firstName"></div></form>');
	  $compile(formElement)($rootScope);
	  
	  element = angular.element(formElement.children()[0]);
	}));
	
	it('should not show errors until the form is submitted', function () {
	  $scope.$digest();
	  element = angular.element(formElement.children()[0]);
	  expect(element.text()).toBe('');
	});
	
	it('should show errors when the form is submitted', function () {
	  $scope.user.validate();
	  formElement.triggerHandler('submit');
	  $scope.$digest();
	  element = angular.element(formElement.children()[0]);
	  expect(element.text()).toBe('error');
	});
  });
  
}());