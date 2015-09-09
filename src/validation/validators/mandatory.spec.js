(function () {
  'use strict';

  describe('MandatoryValidator', function () {
    var MandatoryValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_MandatoryValidator_) {
      MandatoryValidator = _MandatoryValidator_;
    }));

    it('should validate to true when given true', function () {
      expect(MandatoryValidator.validate(true, {}, true)).toBe(true);
    });

    it('should validate to false when given false', function () {
      expect(MandatoryValidator.validate(false, {}, true)).toBe(false);
    });

    it('should validate to false when given anything but a bool', function () {
      expect(MandatoryValidator.validate('yo', {}, true)).toBe(false);
      expect(MandatoryValidator.validate(1, {}, true)).toBe(false);
      expect(MandatoryValidator.validate([], {}, true)).toBe(false);
    });

    it('should validate to false when given null', function () {
      expect(MandatoryValidator.validate(null, {}, true)).toBe(false);
    });

    it('should validate to false when given undefined', function () {
      expect(MandatoryValidator.validate(undefined, {}, true)).toBe(false);
    });

    it('should validate to true when options are false', function () {
      expect(MandatoryValidator.validate(null, {}, false)).toBe(true);
    });
  });

})();
