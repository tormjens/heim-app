angular.module('starter.controllers', [])

.controller('SensorCtrl', function($scope) {
    
})
.controller('SwitchCtrl', function($scope, $http, Base64, $localstorage) {

    var url = $localstorage.get('ip', '192.168.0.1'),
        port = $localstorage.get('port', '3000');

    var config = {
        method: 'GET',
        cache: false,
        headers:  {
            // 'Authorization': 'Basic ' + Base64.encode('admin' + ':' + 'admin'),
            // "X-Testing" : "testing"
        }
    };

    var urlPath = 'http://' + url + ':' + port;

    $http.get(urlPath + '/groups/', config).
    success(function(data, status, headers, config) {

        var groups = [];

        for (var groupIndex = 0; groupIndex < data.length; groupIndex++) {
            var group = data[groupIndex];
            var devices = [];
            for (var deviceIndex = 0; deviceIndex < group.devices.length; deviceIndex++) {
                var device = group.devices[deviceIndex];
                var state = $localstorage.get('state_' + device.provider + '_' + device.id, '0');
                device.isToggled = state === '0' ? false : true;
                devices.push(device);
            }
            group.devices = devices;
            groups.push(group);
        }

        $scope.groups = groups;


        // this callback will be called asynchronously
        // when the response is available
    }).
    error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $scope.switch = function(group, device) {
        console.log(device.isToggled);
        if(!device.isToggled) {
            var send = '2';
            var newState = '0';
        }
        else {
            var send = '1';
            var newState = '1';
        }

        $localstorage.set('state_' + device.provider + '_' + device.id, newState);

        $http.post(urlPath +  device.endpoint, {id: device.id, state: send}).
        success(function(data, status, headers, config) {
            console.log(data);
            var groupIndex = $scope.groups.indexOf(group);
            var deviceIndex = $scope.groups[groupIndex].devices.indexOf(device);
            device.state = newState;
            $scope.groups[groupIndex].devices[deviceIndex] = device;
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

})

.controller('AccountCtrl', function($scope, $localstorage, $window) {

  $scope.settings = {
      ip: $localstorage.get('ip', '192.168.0.1'),
      port: $localstorage.get('port', 3000),
      username: $localstorage.get('username', ''),
      password: $localstorage.get('password', '')
  };

  $scope.submit = function() {

      $localstorage.set('ip', $scope.settings.ip);
      $localstorage.set('port', $scope.settings.port);
      $localstorage.set('username', $scope.settings.username);
      $localstorage.set('password', $scope.settings.password);

      $window.location.reload(true)

  };
});
