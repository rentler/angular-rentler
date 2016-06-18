(function () {
  'use strict';

  fdescribe('DateValidator', function () {
    var DateValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_DateValidator_) {
      DateValidator = _DateValidator_;
    }));

    it('should validate to false when not a formatted date string', function () {
      expect(DateValidator.validate('lkajsldfkj', {}, true)).toBe(false);
    });

    it('should validate to true when given an ISO 8601 formatted date string', function () {
      expect(DateValidator.validate('2014-09-08T08:02:17-05:00', {}, true)).toBe(true);
    });
  });

}());
