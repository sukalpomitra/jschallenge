app.controller('CabsCtrl', function($scope, Cab, ngProgress, toaster, $http) {

$scope.cab = new Cab();

var refresh = function(apiResponse) {
  //$scope.cabs = Cab.query(); 
  $scope.cabs = Cab.query(function (result) {
	    var booking = [];
		var cancel = [];
        for (var i=0;i < result.length; i++)
		{
			if (result[i].cancelled == 0)
				booking.push(result[i]);
			else
				cancel.push(result[i]);
		}
		
		$scope.data = [[booking.length],[booking.length + cancel.length],[cancel.length],[result.length + cancel.length]];
		$scope.map = { center: { latitude: 1.3, longitude: 103.8 }, zoom: 11 };
		$scope.markersOptions = { animation: google.maps.Animation.DROP};
		if (apiResponse != null)
		{
			
			$scope.markers = [];
			angular.forEach(apiResponse, function(obj, key) {
				$scope.markers.push({
					id: obj.id,
					coords: {
					'latitude': obj.latitude,
					'longitude': obj.longitude
					}
				});
			});
			toaster.success("The car locations are shown in the map");
		}
		else
		{
			$scope.markers = [];
		}
  });
  $scope.cab ="";
  $scope.labels = ['Booking Statistics'];
  $scope.series = ['Current Bookings', 'Total Bookings Made', 'Total Cancellations','Total Transactions'];
  
}
refresh(null);

var sendSms = function(cab, apiResponse)
{
	var domain = "http://localhost:9000"
	var url = domain + '/send?phone='+cab.phone+'&name='+cab.name;
	$http.get(url).success(function(result) {
		toaster.success("Your Cabtcha was successful");
		Cab.save(cab,function(cab){
			refresh(apiResponse);
		});
	}).error(function(err) {
		console.log('error');
		return false;
	});
}

var bookCab = function(start, end, cab) {
	
	var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;
	//return true; //REMOVE this, when implemented in smove network. Getting CORS not enabled
	  $http.get(url).success(function(result) {
		cab.bookingDate = start;
		cab.cancelled = 0;
		sendSms(cab, result);
	  }).error(function(err) {
		// Hum, this is odd ... contact us...
		console.error(err);
		return false;
	  });
}

$scope.add = function(cab) {
	var start = Date.now() + 24 * 3600 * 1000;
	var end = start + 2 * 3600 * 1000;
	bookCab(start, end, cab);
};

$scope.update = function(cab) {
  cab.$update(function(){
    refresh(null);
  });
};

$scope.remove = function(cab) {
  cab.cancelled = 1;
  cab.$update(function(){
    refresh(null);
  });
};

$scope.removeAll = function() {
  angular.forEach($scope.cabs,function(value,index){
		value.$delete(function(){
		 });
	});
	refresh(null);		
};

$scope.edit = function(id) {
  $scope.cab = Cab.get({ id: id });
};  

$scope.deselect = function() {
  $scope.cab = "";
}

});
