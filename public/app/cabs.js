app.controller('CabsCtrl', function($scope, Cab, ngProgress, toaster, $http) {

$scope.cab = new Cab();

var refresh = function() {
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
		
		$scope.data = [[booking.length],[cancel.length],[result.length]];
		
  });
  $scope.cab ="";
  $scope.labels = ['Booking Statistics'];
  $scope.series = ['Series A'];
  
}
refresh();

var sendSms = function(cab)
{
	var domain = "http://localhost:9000"
	var url = domain + '/send?phone='+cab.phone+'&name='+cab.name;
	console.log(url);
	$http.get(url).success(function(result) {
		console.log('Done');
		toaster.success("Your Cabtcha was successful");
		Cab.save(cab,function(cab){
			refresh();
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
		console.log('Result from the API call:', result);
		cab.bookingDate = start;
		cab.cancelled = 0;
		sendSms(cab);
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
    refresh();
  });
};

$scope.remove = function(cab) {
  cab.cancelled = 1;
  cab.$update(function(){
    refresh();
  });
};

$scope.removeAll = function() {
  angular.forEach($scope.cabs,function(value,index){
		value.$delete(function(){
		 });
	});
	refresh();		
};

$scope.edit = function(id) {
  $scope.cab = Cab.get({ id: id });
};  

$scope.deselect = function() {
  $scope.cab = "";
}

});
