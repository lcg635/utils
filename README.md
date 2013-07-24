utils
=====

#Reconnector
断线重连

`javascript`
  var dnode = require('dnode');
  var Reconnector = require('Reconnector');
  var logger = require('winston');
  
  var client = null;
  var masterReconnector = new Reconnector({
    name: 'testClient', initDelay: 1000, step: 2, maxDelay: 10000, loop: true,
  	connect: function() {
  		var self = this;
  		client = dnode({ id: 'test' }).connect('127.0.0.1', 9999);
  		client.on('remote', function(remote) {
  			logger.info('connected');
  			//do something
  			self.emit('connected');
  		});
  		client.on('error', function(err) {
  			self.emit('error', err);
  		});
  		client.on('end', function() {
  			logger.info('end');
  			self.emit('end');
  		});
  	}
  });
  masterReconnector.connect();
