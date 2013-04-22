var qs = require('querystring');
var request = require('request').defaults({timeout: 5000});

var HttpSQS = module.exports = function(source, queueName, auth) {
  this.source = source;
	this.queueName = queueName;
	this.auth = auth;
};

//加入队列
HttpSQS.prototype.push = function(value, cb) {
	this.sendCommand({
		name: this.queueName,
		opt: 'put',
		data: encodeURIComponent(value)
	}, function(err, res, body) {
		if (!err && body == 'HTTPSQS_PUT_OK')//加入队列失败
			cb(null, body);
		else
			cb(err || new Error(body), value);
	});
};

//从队列取出
HttpSQS.prototype.pop = function(cb) {
	this.sendCommand({
		name: this.queueName,
		opt: 'get'
	}, function(err, res, body) {
		if (err || body == 'HTTPSQS_GET_END')//加入队列失败
			cb(err || new Error(body));
		else
			cb(null, body);
	});
};

//队列状态
HttpSQS.prototype.staus = function(cb) {
	var _this = this;
	this.sendCommand({
		name: this.queueName,
		opt: 'status'
	}, function(err, res, body) {
		if (err) cb(err);
		else {
			var tmp = data.split('\n');
			cb(err, {
				queueName: tmp[2],
				maxQeueu: tmp[3],
				putPosition: tmp[4],
				getPosition: tmp[5],
				unreadQueue: tmp[6]
			});
		}
	});
};

HttpSQS.prototype.sendCommand = function(data, cb) {
	data.auth = this.auth;
	request.get(this.source + '?' + qs.stringify(data), { headers: { Connection: 'keep-alive' } }, cb);
};
