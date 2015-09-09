(function () {
  'use strict';
  
  angular
  	.module('rentler.core')
	.factory('Instantiable', InstantiableFactory);
	
  InstantiableFactory.$inject = [];
  
  function InstantiableFactory() {
	var mixin = {
	  create: create
	};
	
	return mixin;
	
	function create(opts) {
	  var _this = this;
	  
	  var instance = _.cloneDeep(_this);
	  
	  _.assign(instance, opts);
	  
	  _.bindAll(instance);
	  
	  return instance;
	}
  }
  
}());