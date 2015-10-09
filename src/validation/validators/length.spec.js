(function () {
  'use strict';

  describe('LengthValidator', function () {
    var LengthValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_LengthValidator_) {
      LengthValidator = _LengthValidator_;
    }));

    it('should validate to true when given a string in range', function () {
      expect(LengthValidator.validate('katana', {}, [1, 10])).toBe(true);
      expect(LengthValidator.validate('katana', {}, [6, 10])).toBe(true);
      expect(LengthValidator.validate('katana', {}, [1, 6])).toBe(true);
    });

    it('should validate to false when given a string out of range', function () {
      expect(LengthValidator.validate('katana', {}, [1, 3])).toBe(false);
    });

    it('should allow for only min or only max length options', function () {
      expect(LengthValidator.validate('rentler', {}, [1, null])).toBe(true);
      expect(LengthValidator.validate('rentler', {}, [10, null])).toBe(false);
      expect(LengthValidator.validate('rentler', {}, [null, 7])).toBe(true);
      expect(LengthValidator.validate('rentler', {}, [null, 2])).toBe(false);
    });

    it('should validate to false when given anything but a string', function () {
      expect(LengthValidator.validate(1, {}, [])).toBe(false);
      expect(LengthValidator.validate(true, {}, [])).toBe(false);
      expect(LengthValidator.validate([], {}, [])).toBe(false);
    });

    it('should validate to true when given null', function () {
      expect(LengthValidator.validate(null, {}, [])).toBe(true);
    });

    it('should validate to true when given undefined', function () {
      expect(LengthValidator.validate(undefined, {}, [])).toBe(true);
    });

    it('should validate to true when options are false', function () {
      expect(LengthValidator.validate(null, {}, false)).toBe(true);
    });
  });

}());
