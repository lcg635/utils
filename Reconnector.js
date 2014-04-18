var util = require('util');
var EventEmitter = require('events').EventEmitter;
var logger = require('winston');

function Reconnector(options) {
	EventEmitter.call(this);

	this.name = options.name || '';
	this.initDelay = options.initDelay || 1000;	//默认一秒
	this.step = options.step || 2;		//默认每次重连时间翻倍
	this.maxDelay = options.maxDelay || this.initDelay * Math.pow(this.step, 10);	//默认最大10次重
	this.loop = options.loop || true;
	this.reconnecting = false;
	this.delay = this.initDelay;
	this.connect = options.connect;

	this.on('connect', this.onConnect.bind(this));
	this.on('error', this.onError.bind(this));
}

util.inherits(Reconnector, EventEmitter);

Reconnector.prototype.reconnect = function() {
	if (this.delay > this.maxDelay) {
		this.delay = this.initDelay;
		if (!this.loop) return;
	}
	this.reconnecting = setTimeout(this.connect.bind(this), this.delay);
	this.delay = this.delay * this.step;
};

Reconnector.prototype.onError = function(err) {
	logger.debug('%s error: %s', this.name, err.message);
	this.reconnect();
};

Reconnector.prototype.onConnect = function() {
	logger.debug('%s connect', this.name);
	clearTimeout(this.reconnecting);
	this.delay = this.initDelay;
};


module.exports = Reconnector;
