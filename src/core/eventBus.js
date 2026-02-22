const EventEmitter = require("stream");

class AppEventBus extends EventEmitter { }

const eventBus = new AppEventBus();

module.exports = eventBus;