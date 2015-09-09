(function () {
  'use strict';

  angular
  	.module('rentler.core')
	  .directive('form', FormDirective);

  FormDirective.$inject = [];

  function FormDirective() {
    var directive = {
      restrict: 'E',
      require: '^form',
      link: {
        pre: pre
      }
    };

    return directive;

    function pre(scope, element, attrs, ctrl) {
      element.on('submit', function () {
        ctrl.$submitted = true;
      });
    }
  }

}());