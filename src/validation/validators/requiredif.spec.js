(function () {
  'use strict';
  
  describe('RequiredIfValidator', function () {
	var RequiredIfValidator;
	
	beforeEach(module('rentler.core'));
	
	beforeEach(inject(function (_RequiredIfValidator_) {
	  RequiredIfValidator = _RequiredIfValidator_;
	}));
	
	it('should require the field if condition is true', function () {
	  function condition(instance) {
	    if (instance.hello === 'world')
		  return true;
	  }
	  
	  expect(RequiredIfValidator.validate(null, { hello: 'world' }, condition)).toBe(false);
	  expect(RequiredIfValidator.validate(1, { hello: 'world' }, condition)).toBe(true);
	});
	
	it('should not require the field if condition is false', function () {
	  function condition(instance) {
	    if (instance.hello === 'world')
		  return true;
	  }
		
      expect(RequiredIfValidator.validate(null, { hello: '' }, condition)).toBe(true);
	  expect(RequiredIfValidator.validate(1, { hello: '' }, condition)).toBe(true);
	});
	
	it('should not require the field if condition is not a function', function () {
	  expect(RequiredIfValidator.validate(null, { hello: 'world' }, 1));
	});
	
  });
  
})();