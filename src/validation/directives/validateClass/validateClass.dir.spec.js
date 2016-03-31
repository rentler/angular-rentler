(function () {
  'use strict';
  
  describe('rValidateClass', function () {
    var $scope, $compile, Validator, Validation, schema, model, validator, formElem, elem;
    
    beforeEach(module('rentler.core'));
    
    beforeEach(inject(function (_$rootScope_, _$compile_, _Validator_, _Validation_) {
      $scope = _$rootScope_;
      $compile = _$compile_;
      Validator = _Validator_;
      Validation = _Validation_;
    }));
    
    beforeEach(function () {
      schema = {
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        middleName: {
          required: false
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
        lastName: '',
        middleName: '',
        friends: [
          { name: 'first' },
          { name: 'second' },
          { name: 'thrid' }
        ]
      };
    });
    
    beforeEach(function () {
      $scope.vm = {};
      $scope.vm.validator = validator = Validator.create(schema, model, $scope.vm);
      $scope.vm.model = model;
      
      formElem = angular.element('<form r-validator="vm.validator"><div r-validate-class="vm.model.firstName"></div></form>');
      var repeatElem = angular.element('<div ng-repeat="friend in vm.model.friends"><div r-validate-class="friend.firstName"></div></div>');
	    formElem.append(repeatElem);
      $compile(formElem)($scope);
	    elem = angular.element(formElem.children()[0]);
    });
    
    it('should not add classes to the element until form is submitted', function () {
      $scope.$digest();
      expect(elem.hasClass(Validation.getClasses().error)).toBe(false);
      expect(elem.hasClass(Validation.getClasses().success)).toBe(false);
    });
    
    it('should add error class exclusively to element when invalid', function () {
      validator.validate();
      formElem.triggerHandler('submit');
      $scope.$digest(function () {
        expect(elem.hasClass(Validation.getClasses().error)).toBe(true);
        expect(elem.hasClass(Validation.getClasses().success)).toBe(false);
      });
    });
    
    it('should add success class exclusively to element when valid', function () {
      model.firstName = 'John';
      validator.validate();
      formElem.triggerHandler('submit');
      $scope.$digest(function () {
        expect(elem.hasClass(Validation.getClasses().error)).toBe(false);
        expect(elem.hasClass(Validation.getClasses().success)).toBe(true);
      });
    });
  
  });
  
})();