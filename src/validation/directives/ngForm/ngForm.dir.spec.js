(function () {
  'use strict';
  
  describe('ngForm', function () {
	var $scope, element, formCtrl;
	
	beforeEach(module('rentler.core'));
	
	beforeEach(inject(function ($compile, $rootScope) {
	  $scope = $rootScope;
	  
	  element = angular.element('<div ng-form></div>');
	  $compile(element)($rootScope);
	  
	  formCtrl = element.controller('form');
	}));
	
	it('should set $submitted to false', function () {
	  expect(formCtrl.$submitted).toBe(false);
	});
	
	it('should add and set $submitted field to FormController on submit', function () {
	  element.triggerHandler('submit');
	  expect(formCtrl.$submitted).toBe(true);
	});
  });
  
}());