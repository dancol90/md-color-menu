(function() {

  angular
    .module('mdColorMenu', ['ngAria', 'ngAnimate', 'ngMaterial'])
    .factory('mdPickerColors', mdPickerColors)
    .directive('mdColorMenu', mdColorMenuDirective);

  function mdPickerColors($mdColorPalette) {
    var colors = [];

    angular.forEach($mdColorPalette, function(swatch, swatchName) {
      var swatchColors = [];
      angular.forEach(swatch, function(color, colorName) {
        if (excludeAccentColors(colorName))
          return;
        var foregroundColor = list2rgbString(color.contrast);
        var backgroundColor = list2rgbString(color.value);
        var name = swatchName + ' ' + colorName;
        swatchColors.push({name: name, style: {'color': foregroundColor, 'background-color': backgroundColor}});
      });
      colors.push(swatchColors);
    });

    return colors;

    function excludeAccentColors(colorName) {
      return colorName[0] === 'A' || colorName === '1000';
    }

    function list2rgbString(rgbList) {
      if (rgbList.length === 4) {
        return 'rgba(' + rgbList.join(',') + ')';
      }
      return 'rgb(' + rgbList.join(',') + ')';
    }
  }

  function mdColorMenuDirective() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        color: '='
      },
      controller: function($scope, mdPickerColors) {
        var vm = this;

        vm.openMenu = openMenu;
        vm.colors = mdPickerColors;
        vm.selectColor = selectColor;

        function openMenu($mdOpenMenu, event) {
          $mdOpenMenu(event);
        }

        function selectColor(color) {
          vm.color = color;
        }
      },
      controllerAs: 'vm',
      bindToController: true,
      template: [
        '<md-menu md-position-mode="target-right target">',
        '  <div ng-click="vm.openMenu($mdOpenMenu, $event)" ng-transclude=""></div>',
        '  <md-menu-content class="md-cm">',
        '    <div></div>',
        '    <div class="md-cm-swatches" layout="row">',
        '      <div ng-repeat="swatch in vm.colors" layout=column>',
        '        <div ng-repeat="color in swatch" class="md-cm-color" ng-style="color.style" ng-click="vm.selectColor(color)" layout="row" layout-align="center center">',
        '          <span ng-if="color.name == vm.color.name">&#10004;</span>',
        '          <md-tooltip>{{color.name}}</md-tooltip>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </md-menu-content>',
        '</md-menu>'
      ].join('')
    }

  }

})();