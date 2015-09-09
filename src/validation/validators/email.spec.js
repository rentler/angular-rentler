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

  });

})();
