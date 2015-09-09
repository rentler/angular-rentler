(function () {
  'use strict';

  describe('AlphanumericValidator', function () {
    var AlphanumericValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_AlphanumericValidator_) {
      AlphanumericValidator = _AlphanumericValidator_;
    }));

    it('should validate to true when a string', function () {
      expect(AlphanumericValidator.validate('keiki', {}, true)).toBe(true);
    });

    it('should validate to false when given anything but a string', function () {
      expect(AlphanumericValidator.validate(1, {}, true)).toBe(false);
      expect(AlphanumericValidator.validate(true, {}, true)).toBe(false);
      expect(AlphanumericValidator.validate([], {}, true)).toBe(false);
    });

    it('should validate to false when given null', function () {
      expect(AlphanumericValidator.validate(null, {}, true)).toBe(false);
    });

    it('should validate to false when given undefined', function () {
      expect(AlphanumericValidator.validate(undefined, {}, true)).toBe(false);
    });

    it('should validate to true when options are false', function () {
      expect(AlphanumericValidator.validate(null, {}, false)).toBe(true);
    });

  });

})();

