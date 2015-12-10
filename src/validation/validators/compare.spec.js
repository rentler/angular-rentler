(function () {
  'use strict';

  describe('CompareValidator', function () {
    var CompareValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_CompareValidator_) {
      CompareValidator = _CompareValidator_;
    }));

    it('should validate to true when equal', function () {
      expect(CompareValidator.validate('hello', { compareme: 'hello' }, 'compareme')).toBe(true);
    });

    it('should validate to false when not equal', function () {
      expect(CompareValidator.validate('hello', { compareme: 'world' }, 'compareme')).toBe(false);
      expect(CompareValidator.validate(1, { compareme: '1' }, 'compareme')).toBe(false);
    });

    it('should validate to true when options are false', function () {
      expect(CompareValidator.validate(null, {}, false)).toBe(true);
    });
    
    it('should validate to true when given undefined', function () {
      expect(CompareValidator.validate(undefined, {}, true)).toBe(true);
    });
    
    it('should validate to true when given null', function () {
      expect(CompareValidator.validate(null, {}, true)).toBe(true);
    });
  });

}());
