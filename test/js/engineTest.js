/**
 * Created by wzgong on 12/5/14.
 */

function DummyObjectA() {
    this.id = _.uniqueId("DummyObjectA_");
    this.num = [0, 0, 0, 0];
    console.log(this.id);

}


DummyObjectA.prototype.sum = function (index) {
    this.num[index] = this.num[index] + index + 1;
};


DummyObjectA.prototype.asyncSum = function (index, callback) {
    var self = this;
    setTimeout(function () {
        self.num[index] = self.num[index] + parseFloat(5);
        console.log("this.callback : " + callback);
        callback(self.num[index]);
    }, 100);

};

/**
 *  这个对象中的方法是否是异步的 ( 如果方法是异步的，那么这个方法就必须多加一个参数callback ,把这个方法的返回值作为callback的参数)
 * @param methodName 方法名
 * @returns {boolean}
 */
DummyObjectA.prototype.isAsync = function (methodName) {
    if (methodName == "asyncSum") {
        return true;
    } else {
        return false;
    }
}


/**
 *  解析表达式
 * @param expression  需要解析的表达式
 */
Engine.prototype._parseExpression = function (expression) {

    console.log(" parse " + expression);
    this.status = Engine.STATUS_BUSY;

    var task1 = new Task(expression, "sum", [parseInt(this.id)], _.uniqueId("task_"));
    var thatobj = this;
    var f = function (data) {
        return thatobj._longTaskFinish(data);
    };
    var task2 = new Task(expression, "asyncSum", [parseInt(this.id), f], _.uniqueId("task_"));
    this.taskQueue.push(task1);
    this.taskQueue.push(task2);


    this.status = Engine.STATUS_IDLE;

};


QUnit.module("engine stop  start test");

var p1 = new Engine("parent", 100, null);
var sub1 = p1.addSubEngine(null);
var sub2 = p1.addSubEngine(null);
var sub3 = p1.addSubEngine(null);
setTimeout(function () {

    QUnit.test(" create p1, sub1, sub2,sub3", function (assert) {

        assert.ok(p1.status == Engine.STATUS_SLEEP, "p1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub1.status == Engine.STATUS_SLEEP, "sub1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub2.status == Engine.STATUS_SLEEP, "sub2 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub3.status == Engine.STATUS_SLEEP, "sub3 status : " + Engine.STATUS_SLEEP);
    });
}, 100);


setTimeout(function () {
    p1.start();
    QUnit.test(" p1 start", function (assert) {
        assert.ok(p1.status == Engine.STATUS_IDLE, "p1 status : " + Engine.STATUS_IDLE);
        assert.ok(sub1.status == Engine.STATUS_IDLE, "sub1 status : " + Engine.STATUS_IDLE);
        assert.ok(sub2.status == Engine.STATUS_IDLE, "sub2 status : " + Engine.STATUS_IDLE);
        assert.ok(sub3.status == Engine.STATUS_IDLE, "sub3 status : " + Engine.STATUS_IDLE);
    });
}, 200);


setTimeout(function () {

    QUnit.test(" status", function (assert) {
        assert.ok(p1.status == Engine.STATUS_SLEEP, "p1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub1.status == Engine.STATUS_SLEEP, "sub1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub2.status == Engine.STATUS_SLEEP, "sub2 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub3.status == Engine.STATUS_SLEEP, "sub3 status : " + Engine.STATUS_SLEEP);
    });
}, 2000);


setTimeout(function () {
    p1.start();
    QUnit.test(" p1 restart", function (assert) {
        assert.ok(p1.status == Engine.STATUS_IDLE, "p1 status : " + p1.status);
        assert.ok(sub1.status == Engine.STATUS_IDLE, "sub1 status : " + sub1.status);
        assert.ok(sub2.status == Engine.STATUS_IDLE, "sub2 status : " + sub2.status);
        assert.ok(sub3.status == Engine.STATUS_IDLE, "sub3 status : " + sub3.status);
    });
}, 2500);


setTimeout(function () {
    sub1.stop();
    sub2.stop();
    QUnit.test(" sub1 ,sub2 stop", function (assert) {
        assert.ok(p1.status == Engine.STATUS_IDLE, "p1 status : " + Engine.STATUS_IDLE);
        assert.ok(sub1.status == Engine.STATUS_SLEEP, "sub1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub2.status == Engine.STATUS_SLEEP, "sub2 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub3.status == Engine.STATUS_IDLE, "sub3 status : " + Engine.STATUS_IDLE);
    });
}, 2800);


setTimeout(function () {
    p1.stop();
    QUnit.test("p1 stop", function (assert) {
        assert.ok(p1.status == Engine.STATUS_SLEEP, "p1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub1.status == Engine.STATUS_SLEEP, "sub1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub2.status == Engine.STATUS_SLEEP, "sub2 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub3.status == Engine.STATUS_SLEEP, "sub3 status : " + Engine.STATUS_SLEEP);
    });
}, 3000);

setTimeout(function () {
    console.log(p1.status + " : " + p1.idleCount);
    p1.start();
    QUnit.test(" p1 start", function (assert) {
        assert.ok(p1.status == Engine.STATUS_IDLE, "p1 status : " + Engine.STATUS_IDLE);
        assert.ok(sub1.status == Engine.STATUS_SLEEP, "sub1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub2.status == Engine.STATUS_SLEEP, "sub2 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub3.status == Engine.STATUS_IDLE, "sub3 status : " + Engine.STATUS_IDLE);
    });
}, 3200);


setTimeout(function () {
    QUnit.test(" status", function (assert) {
        assert.ok(p1.status == Engine.STATUS_SLEEP, "p1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub1.status == Engine.STATUS_SLEEP, "sub1 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub2.status == Engine.STATUS_SLEEP, "sub2 status : " + Engine.STATUS_SLEEP);
        assert.ok(sub3.status == Engine.STATUS_SLEEP, "sub3 status : " + Engine.STATUS_SLEEP);
    });
}, 5000);


setTimeout(function () {
    sub1.destroy();
    sub2.destroy();
    p1.start();

    setTimeout(function () {
        QUnit.test(" p1, start; sub1 ,sub2, destroy", function (assert) {
            assert.ok(p1.status == Engine.STATUS_IDLE, "p1 status : " + p1.status);
//        assert.ok(sub1.status == Engine.STATUS_IDLE, "sub1 status : " + sub1.status);
//        assert.ok(sub2.status == Engine.STATUS_IDLE, "sub2 status : " + sub2.status);
            assert.ok(sub3.status == Engine.STATUS_IDLE, "sub3 status : " + sub3.status);
            assert.ok(p1.subEngines.length == 1, "p1 subEngines  length : " + p1.subEngines.length);
        });
    }, 200);

}, 5500);

setTimeout(function () {
    p1.destroy();
}, 6000);


setTimeout(function () {

    QUnit.module("multiple engine test sync/async mixed expression");

    var p2 = new Engine("0", 100, null);
    var s1 = new Engine("1", 100, null);
    var s2 = new Engine("2", 100, null);
    var s3 = new Engine("3", 100, null);


    p2.addEngine(s1);
    p2.addEngine(s2);
    p2.addEngine(s3);

    var demo = new DummyObjectA();
    p2.addExpression(demo);
    p2.addExpression(demo);
    s1.addExpression(demo);
    s2.addExpression(demo);
    s3.addExpression(demo);



     setTimeout(function () {
         p2.start();

    QUnit.test(" p2 start", function (assert) {
        assert.ok(demo.num[0] == 0, demo.num);
        assert.ok(demo.num[1] == 0, demo.num);
        assert.ok(demo.num[2] == 0, demo.num);
        assert.ok(demo.num[3] == 0, demo.num);
    });
    }, 20);


    setTimeout(function () {
        QUnit.test("status", function (assert) {
            assert.ok(demo.num[0] == 0, demo.num);
            assert.ok(demo.num[1] == 0, demo.num);
            assert.ok(demo.num[2] == 0, demo.num);
            assert.ok(demo.num[3] == 0, demo.num);
        });
    }, 150);


    setTimeout(function () {
        QUnit.test(" p2 add expression", function (assert) {
            assert.ok(demo.num[0] == 1, demo.num);
            assert.ok(demo.num[1] == 2, demo.num);
            assert.ok(demo.num[2] == 3, demo.num);
            assert.ok(demo.num[3] == 4, demo.num);
        });
        p2.addExpression(demo);
    }, 250);

    setTimeout(function () {
        QUnit.test("status 1", function (assert) {
            assert.ok(demo.num[0] == 6, demo.num);
            assert.ok(demo.num[1] == 7, demo.num);
            assert.ok(demo.num[2] == 8, demo.num);
            assert.ok(demo.num[3] == 9, demo.num);
        });
    }, 450);

    setTimeout(function () {
        QUnit.test("status 2", function (assert) {
            assert.ok(demo.num[0] == 7, demo.num);
            assert.ok(demo.num[1] == 7, demo.num);
            assert.ok(demo.num[2] == 8, demo.num);
            assert.ok(demo.num[3] == 9, demo.num);
        });
    }, 650);

    setTimeout(function () {
        QUnit.test("status 3", function (assert) {
            assert.ok(demo.num[0] == 18, demo.num);
        });
        p2.destroy();
    }, 1250);


//        setTimeout(function () {
//        QUnit.test("10s, just for test", function (assert) {
//            assert.ok(true, demo.num);
//        });
//        p2.destroy();
//
// }, 6000);


}, 6100);


setTimeout(function () {
    QUnit.module("single engine busy  status test ");
    var p3 = new Engine("2", 50, null);
    var demo = new DummyObjectA();
    p3.addExpression(demo);
    p3.start();


    setTimeout(function () {
        QUnit.test(" after p3 start ", function (assert) {
            assert.ok(p3.status == Engine.STATUS_BUSY, p3.status + " , task Queue length " + p3.taskQueue.length());
        });

    }, 220);
    setTimeout(function () {
        QUnit.test("after p3 start", function (assert) {
            assert.ok(p3.status == Engine.STATUS_IDLE, p3.status + " , task Queue length " + p3.taskQueue.length());
            p3.destroy();
        });

    }, 350);


}, 8000);


//Engine2
//start
//pause
//stop


//TaskCue
//pop
//push


//ObjContext


/// idleCount
/// removeEngine
/// async
///parse expression need create sub engine

/// move and show

//Engine {
//    _asyncFinish（）；
//}
//
//if (obj1.isMethodSync && obj1.isMethodSync(methodname)) {
//    (a,this);
//}
//
//isMethodAsyc(name) {
//    return true;
//}


//    [
//    ['obj1', 'method1', []],
//        ['obj1', 'asyncMethod2', []],
//    ]








