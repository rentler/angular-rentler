﻿(function () {
  'use strict';

  describe('RangeValidator', function () {
    var RangeValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_RangeValidator_) {
      RangeValidator = _RangeValidator_;
    }));

    it('should validate to true when given a number in range', function () {
      expect(RangeValidator.validate(7, {}, [1, 10])).toBe(true);
      expect(RangeValidator.validate(7, {}, [7, 10])).toBe(true);
      expect(RangeValidator.validate(7, {}, [1, 7])).toBe(true);
    });

    it('should validate to false when given a number out of range', function () {
      expect(RangeValidator.validate(-5, {}, [1, 10])).toBe(false);
    });

    it('should allow for text entries like from textboxes', function () {
      expect(RangeValidator.validate('7', {}, [1, 10])).toBe(true);
    });
    
    it('should allow for array values', function () {
      expect(RangeValidator.validate([1, 2, 3], {}, [1, 5])).toBe(true);
      expect(RangeValidator.validate([], {}, [1, null])).toBe(false);
    });

    it('should allow for only min or only max options', function () {
      expect(RangeValidator.validate(7, {}, [1, null])).toBe(true);
      expect(RangeValidator.validate(-1, {}, [1, null])).toBe(false);
      expect(RangeValidator.validate(7, {}, [null, 7])).toBe(true);
      expect(RangeValidator.validate(7, {}, [null, 2])).toBe(false);
    });

    it('should validate to false when given anything but a number or an array', function () {
      expect(RangeValidator.validate('yo', {}, [])).toBe(false);
      expect(RangeValidator.validate(true, {}, [])).toBe(false);
    });

    it('should validate to true when given null', function () {
      expect(RangeValidator.validate(null, {}, [])).toBe(true);
    });

    it('should validate to true when given undefined', function () {
      expect(RangeValidator.validate(undefined, {}, [])).toBe(true);
    });

    it('should validate to true when options are false', function () {
      expect(RangeValidator.validate(null, {}, false)).toBe(true);
    });
  });

}());
