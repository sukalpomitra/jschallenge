var client = require('twilio')('AC0af94b6ba800970f28928ab7d92f07a7', '544bae9f17bd41c665dd4824dfd6f1d3');
var url = require('url');

module.exports.sendSms = function(request, response) {
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	var to = query['phone'];
	var name = query['name'];
  client.messages.create({
    body: 'Dear ' + name + ',You have a Successful Cabtcha!!',
    to: '+65' + to,
    from: '+14845784287'
//  mediaUrl: imageUrl
  }, function(err, data) {
    if (err) {
      console.error('Could not deliver Message');
      console.error(err);
	  response.send(500,err)
    } else {
      console.log('Message Delivered');
	  response.send('Message Delivered')
    }
  });
};
