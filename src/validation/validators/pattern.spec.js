(function () {
  'use strict';

  describe('PatternValidator', function () {
    var PatternValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_PatternValidator_) {
      PatternValidator = _PatternValidator_;
    }));

    it('should validate to true when matches pattern', function () {
      expect(PatternValidator.validate('hello', {}, /^hello|world$/)).toBe(true);
      expect(PatternValidator.validate('world', {}, /^hello|world$/)).toBe(true);
    });

    it('should validate to false when doesn\'t match pattern', function () {
      expect(PatternValidator.validate('yo', {}, /^hello|world$/)).toBe(false);
      expect(PatternValidator.validate(1, {}, /^hello|world$/)).toBe(false);
      expect(PatternValidator.validate([], {}, /^hello|world$/)).toBe(false);
    });

    it('should validate to true when given null', function () {
      expect(PatternValidator.validate(null, {}, /^hello|world$/)).toBe(true);
    });

    it('should validate to true when given undefined', function () {
      expect(PatternValidator.validate(undefined, {}, /^hello|world$/)).toBe(true);
    });

    it('should validate to true when options are false', function () {
      expect(PatternValidator.validate(null, {}, false)).toBe(true);
    });
  });

}());
