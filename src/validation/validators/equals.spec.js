(function () {
  'use strict';

  describe('EqualsValidator', function () {
    var EqualsValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_EqualsValidator_) {
      EqualsValidator = _EqualsValidator_;
    }));

    it('should validate to false when strings not equal', function () {
      expect(EqualsValidator.validate('hello', {}, 'world')).toBe(false);
    });

    it('should validate to true when strings equal', function () {
      expect(EqualsValidator.validate('test', {}, 'test')).toBe(true);
    });

    it('should validate to true when strings equal', function () {
      expect(EqualsValidator.validate('TEST', {}, { equals: 'TEST', caseSensitive: true })).toBe(true);
    });

    it('should validate to false when strings not equal', function () {
      expect(EqualsValidator.validate('TEST', {}, { equals: 'test', caseSensitive: true })).toBe(false);
    });

    it('should validate to false when numbers not equal', function () {
      expect(EqualsValidator.validate(1, {}, 2)).toBe(false);
    });

    it('should validate to true when numbers equal', function () {
      expect(EqualsValidator.validate(3, {}, 3)).toBe(true);
    });

    it('should validate to false when booleans not equal', function () {
      expect(EqualsValidator.validate(true, {}, false)).toBe(false);
    });

    it('should validate to true when booleans equal', function () {
      expect(EqualsValidator.validate(false, {}, false)).toBe(true);
    });

    it('should validate to false when arrays not equal', function () {
      expect(EqualsValidator.validate([5,3,7], {}, [5,3])).toBe(false);
    });

    it('should validate to true when arrays equal', function () {
      expect(EqualsValidator.validate([1,2,3], {}, [1,2,3])).toBe(true);
    });

    it('should validate to false when objects not equal', function () {
      expect(EqualsValidator.validate({ name: 'Skeletons' }, {}, { name: 'Farewell' })).toBe(false);
    });

    it('should validate to true when objects equal', function () {
      expect(EqualsValidator.validate({ name: 'The Amity Affliction' }, {}, { name: 'The Amity Affliction' })).toBe(true);
    });
    
    it('should valdiate to true when given undefined', function () {
      expect(EqualsValidator.validate(undefined, {}, true)).toBe(true);
    });
    
    it('should validate to true when given null', function () {
      expect(EqualsValidator.validate(null, {}, true)).toBe(true);
    });
  });

}());
