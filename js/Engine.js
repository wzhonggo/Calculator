/**
 * Created by wzgong on 11/25/14.
 */
function Engine(fun) {
    this.init(fun);
}

Engine.prototype.init = function (fun) {
    this.log(" Engine init ...");
    this.util = fun;
    var self = this;
    this.log(" Engine init end  ...");
    setInterval(function () {
        self.log(" setInterval ...");
        self.workProcess();
    }, self.frequency);


    /*        setTimeout(function () {
     //        self.log(" setInterval ...");
     self.workProcess();
     }, self.frequency);*/


}

Engine.prototype.debug = true;
//Engine.prototype.debug = false;


Engine.prototype.suspend = false;

/**
 * A log wrapper, that only logs if logging is turned on in the config
 * @param  {string} msg Log message
 */
Engine.prototype.log = function (msg) {
    if (!this.debug) return;
    if (!console) return;
    if (!console.log) return;

    // console.log("LOG(), Arguments", arguments, msg)
    if (arguments.length > 1) {
        console.log(arguments);
    } else {
        console.log(msg);
    }

}

Engine.prototype.frequency = 1000;

Engine.prototype.queue = new Array();
Engine.prototype.util;

Engine.prototype.complete = function () {
//        this.workProcess();
}

Engine.prototype.workProcess = function () {
//    var self = this;
    this.log(" Engine workProcess ....");
    this.log(" Engine  queue length = " + this.queue.length);
    if (!this.suspend) {
        if (this.queue.length > 0) {
            this.util(this.queue.shift());
//        this.log(this.queue.pop());
        }
    }


}
