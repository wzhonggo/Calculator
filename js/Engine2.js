/**
 * Created by wzgong on 12/1/14.
 */

/**
 * Engine 类
 * @param id engine id
 * @param tick engine timer 频率
 * @param objctx 对象上下文
 * @constructor
 */
function Engine(id, tick, objctx) {

    if (id == undefined) id = '';
    this.id = id;
    this.timer = -1;
    this.tick = DataUtil.parseNumber(tick);
    this.tick <= 0 ? 50 : this.tick;
    this.debug = true;
    this.status = Engine.STATUS_SLEEP;
    this.taskQueue = new TaskQueue();
    this.subEngines = [];
    this.objctx = objctx;
    this.expresionQueue = [];
    // engine timer 空转次数
    this.idleCount = 0;
    //engine的空转的最大次数
    this.maxIdleCount = 10;
    //当父engine 调用 start的时候， 子engine 根据这个表示来判断是否 start , 如果子engine主动调用start ，则这个参数不起作用
    this.startFlag = true;
    // 调用task产生的中间结果
    this.results = [];
    this._log("Engine init .. " + id);
};

//Engine.STATUS_RUN = 'run';
// engine timer 还没有初始化
Engine.STATUS_SLEEP = 'sleep';
// engine 被销毁了
Engine.STATUS_DEAD = 'dead';
// engine timer 已经初始化并在执行
Engine.STATUS_IDLE = 'idle';
// engine timer 正在执行中
Engine.STATUS_BUSY = 'busy';


/**
 * A log wrapper, that only logs if logging is turned on in the config
 * @param  {string} msg Log message
 */
Engine.prototype._log = function (msg) {
    if (!this.debug) return;
    if (!console) return;
    if (!console.log) return;

    // console.log("LOG(), Arguments", arguments, msg)
    if (arguments.length > 1) {
        console.log(arguments);
    } else {
        console.log(msg);
    }

};


/**
 *  engine timer 调用这个方法来解析表达式和执行task
 */
Engine.prototype._workProcess = function () {
    this._log(this.id + " Engine workProcess ...." + this.idleCount);
    this._log(" Engine  queue length = " + this.taskQueue.length());


    if (this.status == Engine.STATUS_DEAD) {
        this._log('Engine is dead, ignoring _work tick');
        return;
    }
    if (this.status == Engine.STATUS_BUSY) {
        this._log(this.id  + ' is busy');
        return;
    }

    if (this.status == Engine.STATUS_SLEEP) {
        this._log('Engine is sleep ');
        return;
    }


    if (this.taskQueue.length() == 0 && this.expresionQueue.length > 0) {
        this._parseExpression(this.expresionQueue.shift());
        return;
    }


    if (this.taskQueue.length() > 0) {
        this.idleCount = 0; //idleCount
        var task = this.taskQueue.shift();

        if (task.c.isAsync && task.c.isAsync(task.method)) {
            this.status = Engine.STATUS_BUSY;
        }

        task._process();

    } else {
        this.idleCount = this.idleCount + 1;
    }

    if (this.idleCount > this.maxIdleCount) {
        this.status = Engine.STATUS_SLEEP;
        clearInterval(this.timer);
        this.timer = -1;
    }

    this._purgeSubEngine();

};


/**
 * 启动 engine
 * @param flag  flag 为true, 表示是这个方法是被父engine调用的， startFlag 不会改变；
 */
Engine.prototype.start = function (isParentCall) {
//    flag = flag || false;
    this._log(this.id + " isParentCall: " + isParentCall + " ,startFlag:" + this.startFlag);
    this.idleCount = 0;
    if (!isParentCall) {
        this.startFlag = true;
    }

    if (!isParentCall || this.startFlag) {
        this._log(this.id + "Engine start .......");


        if (this.status != Engine.STATUS_SLEEP) return;
        this.status = Engine.STATUS_IDLE;
        var self = this;
        this.timer = setInterval(function () {
            self._workProcess();
        }, this.tick);
    }


    if (this.status != Engine.STATUS_DEAD) {
        $.each(this.subEngines, function (index, sub) {
            this._log("sub engin status " + sub.status);
            if (sub.status == Engine.STATUS_SLEEP) sub.start(true);
        });
    }

};


/**
 * 停止 engine
 * @param flag  flag 为true, 表示是这个方法是被父engine调用的, startFlag 不会改变；
 */
Engine.prototype.stop = function (isParentCall) {
    this._log(this.id + " engine is start stop  ...");
    if (this.status != Engine.STATUS_DEAD) {
        $.each(this.subEngines, function (index, sub) {
            sub.stop(true);
        });
    }


    if (!isParentCall) {
        this.startFlag = false;
    }

    if (this.status == Engine.STATUS_SLEEP || this.status == Engine.STATUS_DEAD) return;


    this.status = Engine.STATUS_SLEEP;
    clearInterval(this.timer);
    this.timer = -1;
    this.idleCount = 0;
    this._log(this.id + ' goes into sleep (stop)');
};


/**
 * 摧毁engine
 */
Engine.prototype.destroy = function () {
    this._log(this.id + " engine is start destroy  ...");
    if (this.status != Engine.STATUS_DEAD) {
        $.each(this.subEngines, function (index, sub) {
            sub.destroy();
        });
    }


    this.stop();
    this.status = Engine.STATUS_DEAD;
    this.timer = undefined;
    this.taskQueue = undefined;
    this.subEngines = undefined;
    this.objctx = undefined;
    this.expresionQueue = undefined;
    this._log(this.id + ' is  destroy ');
};


/**
 * 添加engine
 * @param engine
 */
Engine.prototype.addEngine = function (engine) {
    this.subEngines.push(engine);
};

/**
 * 添加子engine, id 为当前父engine+"-" 在加一个唯一id
 * @param objctx 对象上下文
 * @returns {Engine} 子engine
 */
Engine.prototype.addSubEngine = function (objctx) {
    var subEngine = new Engine(_.uniqueId(this.id + "_"), this.tick * 1.1, objctx);
    this.subEngines.push(subEngine);
    return subEngine;
};

/**
 * 从子engine队列中移除状态为Engine.STATUS_DEAD的子engine
 */
Engine.prototype._purgeSubEngine = function () {
//    if (this.subEngines.length > 0) {
    if (this.status != Engine.STATUS_DEAD) {
        this._log(this.id + "  start remove sun engine ...");
        for (var index = 0; index < this.subEngines.length; index++) {
            this._log(this.id + "  start remove sun engine ..." + this.subEngines[index].status);
            if (this.subEngines[index].status == Engine.STATUS_DEAD) {
                this._log("remove  engine " + this.subEngines[index].id);
                this.subEngines.splice(index, 1);

            }
        }
    }
};


Engine.prototype.addExpression = function (expression) {
    this.expresionQueue.push(expression);
};

/**
 * 异步task 会回调这个函数
 * @param result
 */
Engine.prototype._longTaskFinish = function (result) {

    var self = this;
        self._log(self.id + " longTaskFinish start ... " );

    if (this.status != Engine.STATUS_DEAD) {

        self._log("finish result" + result);
        self._log(self.id + " results " + self.results);
        if (result != undefined) {
            self.results.push(result);
        }
        self.status = Engine.STATUS_IDLE;


    }


};


Engine.prototype.isAsync = function (methodName) {
    return false;
}




function TaskQueue() {
    this.queue = [];
};

TaskQueue.prototype.shift = function () {
    return this.queue.shift();
};

TaskQueue.prototype.push = function (task) {
    this.queue.push(task);
};

TaskQueue.prototype.length = function () {
    return this.queue.length;
};

/**
 *  Task 类
 * @param c  对象名
 * @param method 方法名
 * @param arguments 参数数组
 * @param id task id
 * @constructor
 */
function Task(c, method, arguments, id) {
    this.c = c;
    this.method = method;
    this.arguments = arguments;
    this.id = id;
};

/**
 *  执行task
 */
Task.prototype._process = function () {
    console.log("this.arguments : " + this.arguments);
//       _.invoke([this.c], this.method, this.arguments);
    ClassUtil.invoke(this.c, this.method, this.arguments);

};


/**
 *  对象上下文类
 * @param extctx 对象上下文对象
 * @constructor
 */
function ObjContext(extctx) {
    this.extctx = extctx;
    this.map = {}

};

/**
 *  添加对象
 * @param key 对象的唯一标示
 * @param value 对象
 */
ObjContext.prototype.add = function (key, value) {
    this.map[key] = value;
};

/**
 * 查找对象 (会在对象链上查找)
 * @param key 对象的唯一标示
 * @returns {*} 对象
 */
ObjContext.prototype.lookup = function (key) {
    var ret = this.map[key];
    if (ret == undefined && this.extctx != null) {
        ret = this.extctx.lookup(key);
    }
    return ret;
};
