(function () {
  'use strict';
  
  fdescribe('r-valdiate-msg', function () {
	  var $scope, $compile, $templateCache, Validator, schema, model, validator, formElem, elem;
	
    beforeEach(module('rentler.core'));
    
    beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _Validator_) {
      $scope = _$rootScope_;
      $compile = _$compile_;
      $templateCache = _$templateCache_;
      Validator = _Validator_;
    }));
    
    beforeEach(function () {
      $templateCache.put('validation/directives/validateMsg/validateMsg.html', '<div ng-if="messages.length > 0">error</div>');
    });
    
    beforeEach(function () {
      schema = {
        firstName: {
          required: true
        },
        friends: {
          collection: {
            name: {
              required: true
            }
          }
        }
      };
      
      model = {
        firstName: '',
        friends: [
          { name: 'first' },
          { name: 'second' },
          { name: 'thrid' }
        ]
      };
      
      validator = Validator.create(schema, model);
    });
	
	beforeEach(function () {
    $scope.vm = {};
	  $scope.vm.model = model;
    $scope.vm.validator = validator;
	  
	  formElem = angular.element('<form r-validator="vm.validator"><div r-validate-msg="vm.model.firstName"></div></form>');
	  var repeatElem = angular.element('<div ng-repeat="friend in vm.model.friends"><div r-validate-msg="friend.firstName"></div></div>');
    formElem.append(repeatElem);
    $compile(formElem)($scope);
	  
	  elem = angular.element(formElem.children()[0]);
	});
	
    it('should not show errors until the form is submitted', function () {
      $scope.$digest();
      elem = angular.element(formElem.children()[0]);
      expect(elem.text()).toBe('');
    });
    
    it('should show errors when the form is submitted', function () {
      validator.validate();
      formElem.triggerHandler('submit');
      $scope.$digest();
      elem = angular.element(formElem.children()[0]);
      expect(elem.text()).toBe('error');
    });
  });
  
})();