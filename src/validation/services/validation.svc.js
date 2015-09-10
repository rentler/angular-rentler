(function () {
  'use strict';
  
  angular
    .module('rentler.core')
  	.provider('Validation', ValidationProvider);
	  
  ValidationProvider.$inject = [];
  
  function ValidationProvider() {
	var classes = {
	  success: 'has-success',
	  warning: 'has-warning',
	  error: 'has-error'	
	};
	
	this.setClasses = setClasses;
	this.$get = Validation;
	
	function setClasses(opts) {
	  opts = _.pick(opts, _.keys(classes));
	  _.merge(classes, opts);
	}
	
	function Validation() {
	  var service = {
		getClasses: getClasses
	  };
	  
	  return service;
	  
	  function getClasses() {
		return classes;
	  }
	}
  }
  
}());