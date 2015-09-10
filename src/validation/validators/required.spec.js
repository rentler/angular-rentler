(function () {
  'use strict';

  describe('RequiredValidator', function () {
    var RequiredValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_RequiredValidator_) {
      RequiredValidator = _RequiredValidator_;
    }));

    it('should validate to true when given a value', function () {
      expect(RequiredValidator.validate(1, {}, true)).toBe(true);
      expect(RequiredValidator.validate('konichiwa', {}, true)).toBe(true);
      expect(RequiredValidator.validate(false, {}, true)).toBe(true);
      expect(RequiredValidator.validate([], {}, true)).toBe(false);
    });

    it('should validate to false when given null', function () {
      expect(RequiredValidator.validate(null, {}, true)).toBe(false);
    });

    it('should validate to false when given undefined', function () {
      expect(RequiredValidator.validate(undefined, {}, true)).toBe(false);
    });

    it('should validate to true when options are false', function () {
      expect(RequiredValidator.validate(null, {}, false)).toBe(true);
    });
  });

}());
