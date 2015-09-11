# Instantiable

Services in angular are *singletons*. Sometimes you don't want the same object everytime. The `Instantiable` mixin service allows for copies of an object to be created.

`Instantiable` has a single function `create(options...)` which creates a deep copy of itself with `options` also assigned to itself.

Extend your object with the mixin:

```js
angular
  .module('app')
  .factory('AppService', AppServiceFactory);
  
  AppServiceFactory.$inject = ['Instantiable'];
  
  function AppServiceFactory(Instantiable) {
    var service = {
	  name: 'Hi'
	};
	
	// Mixin Instantiable
	_.assign(service, _.cloneDeep(Instantiable));
	
	return service;
  }
```

Usage:
```js
angular
  .module('app')
  .controller('AppCtrl', AppCtrl);
  
  AppCtrl.$inject = ['AppService'];
  
  function AppCtrl(AppService) {
    var vm = this;
    
    vm.service = {};
    
    function init() {
      // Service now has a create({...}) function
      vm.service = AppService.create({ hello: 'world' });
    }
    
    init();
  }
```