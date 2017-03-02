(function () {
  'use strict';

  angular
  	.module('rentler.core')
	.factory('RequiredIfValidator', Factory);

  Factory.$inject = ['RequiredValidator'];

  function Factory(RequiredValidtor) {
    var validator = {
      validate: validate,
      message: 'Required'
    };

    return validator;

    function validate(value, instance, opts, item) {
      if (!opts) return true;

      var fn = _.isFunction(opts) ? opts : opts.requiredIf;

      var required = fn(instance, item);

      return RequiredValidtor.validate(value, instance, required);
    }
  }

})();
