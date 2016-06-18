(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('DateValidator', Factory);

  Factory.$inject = [];

  function Factory() {
    var validator = {
      message: 'Invalid',
      validate: validate
    };
    
    return validator;
    
    function validate(value, instance, opts) {
      if (!opts || _.isNil(value) || _.isDate(value))
        return true;
      
      if (!window.moment) {
        var date = new Date(value);
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
      }

      var formats = [moment.ISO_8601];
      if (_.isArray(opts)) formats.concat(opts);
      else if (_.isString(opts) || _.isFunction(opts)) formats.push(opts);
      
      return moment(value, formats, true).isValid();
    }
  }

})();
