(function () {
  'use strict';

  describe('EmailValidator', function () {
    var EmailValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_EmailValidator_) {
      EmailValidator = _EmailValidator_;
    }));

    it('should validate to false when not an email', function () {
      expect(EmailValidator.validate('lkajsldfkj', {}, true)).toBe(false);
    });

    it('should validate to false when not an email with suffix', function () {
      expect(EmailValidator.validate('lkajsldfkj@asdfasdf', {}, true)).toBe(false);
    });

    it('should validate to true when a standard email', function () {
      expect(EmailValidator.validate('cyberkruz@gmail.com', {}, true)).toBe(true);
    });

    it('should validate to true when a multi-suffix email', function () {
      expect(EmailValidator.validate('japoppy.test@student.neumont.edu', {}, true)).toBe(true);
    });

    it('should validate to true when given an email with a "+" (plus) symbol', function () {
      expect(EmailValidator.validate('user+forpurpose@example.com', {}, true)).toBe(true);
    });

    it('should validate to true when given undefined', function () {
      expect(EmailValidator.validate(undefined, {}, true)).toBe(true);
    });

    it('should validate to true when given null', function () {
      expect(EmailValidator.validate(null, {}, true)).toBe(true);
    });
  });

}());
