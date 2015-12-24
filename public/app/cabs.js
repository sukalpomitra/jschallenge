app.controller('CabsCtrl', function($scope, Cab, cabService, ngProgress, toaster, $http) {

//$scope.cab = new Cab();

var refresh = function() {
  //$scope.cabs = Cab.query(); 
  $scope.cabs = Cab.query(function (result) {
	    $scope.data = cabService.decorateMap(result);
		
  });
  $scope.cab ="";
  $scope.labels = ['Booking Statistics'];
  $scope.series = ['Current Bookings', 'Total Bookings Made', 'Total Cancellations','Total Transactions'];
  
}
refresh();

$scope.add = function(cab) {
	var start = Date.now() + 24 * 3600 * 1000;
	var end = start + 2 * 3600 * 1000;
	cabService.bookCab(start, end, cab)
	.then(function(){
		$scope.markers = [];
		$scope.map = { center: { latitude: 1.3, longitude: 103.8 }, zoom: 11 };
		$scope.markersOptions = { animation: google.maps.Animation.DROP};
			angular.forEach(cabService.carLocs, function(obj, key) {
				$scope.markers.push({
					id: obj.id,
					coords: {
					'latitude': obj.latitude,
					'longitude': obj.longitude
					}
				});
			});
	})
	.then(function(){
		cabService.sendSMS()
		.then(function(){
			$scope.cab.bookingDate = start;
      		$scope.cab.cancelled = 0;
      		console.log($scope.cab);
			Cab.save($scope.cab,function(){
				toaster.success("Your Cabtcha was successful");
				refresh();
			});
		});
	});
};

$scope.update = function() {
  $scope.cab.$update(function(){
    refresh();
  });
};

$scope.remove = function(cab) {
  cab.cancelled = 1;
  cab.$update(function(){
  	$scope.markers = [];
	$scope.map = {};
    refresh();
  });
};

$scope.removeAll = function() {
  angular.forEach($scope.cabs,function(value,index){
		value.$delete(function(){
		 });
	});
  	$scope.markers = [];
	$scope.map = {};
	refresh();		
};

$scope.edit = function(id) {
  $scope.cab = Cab.get({ id: id });
};  

$scope.deselect = function() {
  $scope.cab = "";
}

});
