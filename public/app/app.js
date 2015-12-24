var app = angular.module('jschallengeApp', ['ngResource', 'ngProgress','ngAnimate', 'toaster','chart.js','uiGmapgoogle-maps']);

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
});

// Handle http server errors
app.factory('myHttpInterceptor', function ($q,toaster) {
    return {
        responseError: function (response) {
          console.log(response);
          if(response.data){
            if(response.data.message)
            toaster.error("Error: ", response.data.message);
            else
            toaster.error("Error: ", response.data);
          }
          return $q.reject(response);
        }
    };
});

// Showing loading indicator on top while data is requested from database
app.directive('loading',   ['$http', 'ngProgress', function ($http, ngProgress)
{
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    ngProgress.start();
                }else{
                    ngProgress.complete();
                }
            });
        }
    };
}]);

// Create a resource factory to access cabs table from database 
app.factory('Cab', function($resource) {
  return $resource('/api/cabs/:id', { id: '@_id' }, {
    update: { // We need to define this method manually as it is not provided with ng-resource
      method: 'PUT'
    }
  });
});

app.factory('cabService', ['$http', '$q', function($http, $q){
  var obj = {};
  obj.carLocs = [];
  obj.cab = {};
  var url = 'http://jschallenge.smove.sg/provider/1/availability?';

  obj.bookCab = function(start, end, cab){
    obj.cab = cab;
    url = url + 'book_start=' + start + '&book_end=' + end;
    return $http.get(url)
      .success(function(result) {
        angular.copy(result, obj.carLocs);
      });

      return deferred.promise;
  }

  obj.sendSMS = function(){
    var domain = "http://localhost:9000"
    var url = domain + '/send?phone='+ obj.cab.phone+'&name='+ obj.cab.name;
    return $http.get(url).success(function(result) {
      });
  }

  obj.decorateMap = function(cabs)
  {
      var booking = [ ];
      var cancel = [];
      for (var i=0;i < cabs.length; i++)
      {
        if (cabs[i].cancelled == 0)
          booking.push(cabs[i]);
        else
          cancel.push(cabs[i]);
      }
      
      return [[booking.length],[booking.length + cancel.length],[cancel.length],[cabs.length + cancel.length]];
  }

  return obj;
}]);

