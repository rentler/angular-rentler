(function () {
  'use strict';

  describe('NotEqualToValidator', function () {
    var NotEqualToValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_NotEqualToValidator_) {
      NotEqualToValidator = _NotEqualToValidator_;
    }));

    it('should validate to true when not equal', function () {
      expect(NotEqualToValidator.validate('hello', { compareme: 'world' }, 'compareme')).toBe(true);
      expect(NotEqualToValidator.validate(1, { compareme: '1' }, 'compareme')).toBe(true);
    });

    it('should validate to false when equal', function () {
      expect(NotEqualToValidator.validate('hello', { compareme: 'hello' }, 'compareme')).toBe(false);
    });

    it('should validate to true when options are false', function () {
      expect(NotEqualToValidator.validate(null, {}, false)).toBe(true);
    });

    it('should validate to true when given undefined', function () {
      expect(NotEqualToValidator.validate(undefined, {}, true)).toBe(true);
    });

    it('should validate to true when given null', function () {
      expect(NotEqualToValidator.validate(null, {}, true)).toBe(true);
    });
  });

}());
