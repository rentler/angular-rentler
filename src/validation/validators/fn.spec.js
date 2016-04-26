(function () {
  'use strict';

  describe('FnValidator', function () {
    var FnValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_FnValidator_) {
      FnValidator = _FnValidator_;
    }));

    it('should validate to true not given a function as an option', function () {
      expect(FnValidator.validate(undefined, {}, undefined)).toBe(true);
    });
    
    it('should validate to true if the function returns true', function () {
      expect(FnValidator.validate(undefined, {}, function() { return true; })).toBe(true);
    });
    
        it('should validate to false if the function returns false', function () {
      expect(FnValidator.validate(undefined, {}, function() { return false; })).toBe(false);
    });
  });

}());
