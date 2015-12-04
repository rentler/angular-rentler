(function () {
  'use strict';
  
  angular
  	.module('rentler.core')
	.factory('RequiredIfValidator', RequiredIfValidator);
	
  RequiredIfValidator.$inject = ['RequiredValidator'];
  
  function RequiredIfValidator(RequiredValidtor) {
	function validate(value, instance, opts) {
	  if (!opts || !_.isFunction(opts))
	  	return true;
	  
	  var required = opts(instance);
	  
	  return RequiredValidtor.validate(value, instance, required);
	}
	
	var requiredif = {
	  message: 'Required',
	  validate: validate
	};
	
	return requiredif;
  }
	
})();