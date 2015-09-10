(function () {
  'use strict';
  
  describe('Validation', function () {
	var ValidationProvider, Validation;
	
	beforeEach(module('rentler.core', function (_ValidationProvider_) {
	  ValidationProvider = _ValidationProvider_;
	}));
	
	beforeEach(inject(function(_Validation_) {
	  Validation = _Validation_;
	}));
	
	it('should be able to get validation classes', function () {
	  expect(Validation.getClasses().success).toBe('has-success');
	  expect(Validation.getClasses().error).toBe('has-error');
	});
	
	it('should be able to set validation classes', function () {
	  ValidationProvider.setClasses({ success: 'success'});
	  expect(Validation.getClasses().success).toBe('success');
	  expect(Validation.getClasses().error).toBe('has-error');
	});
  });
  
}());