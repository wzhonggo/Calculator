
define("engine",
    [ ],
    function () {
        function Engine(fun) {
            this.init(fun);
        }

//        // engine timer
//        Engine.STATUS_SLEEP = 'sleep';
//// engine 被销毁了
//        Engine.STATUS_DEAD = 'dead';
//// engine timer 已经初始化并在执行
//        Engine.STATUS_IDLE = 'idle';
//// engine timer 正在执行中,
//        Engine.STATUS_BUSY = 'busy';

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
//        Engine.prototype.util;

        Engine.prototype.complete = function () {
//        this.workProcess();
        }

        Engine.prototype.workProcess = function () {
        var self = this;
            this.log(" Engine workProcess ....");
            this.log(" Engine  queue length = " + this.queue.length);
            if (!this.suspend) {
                if (this.queue.length > 0) {
                    // all task is jquery deferred object
                    var task = this.queue.shift();
                    this.suspend = true;
                    task.always(function(){
                        self.suspend=false;
                    });
                    task.resolve();
                }
            }


        }

        return Engine;
    });

