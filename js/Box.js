/**
 * Created by wzgong on 12/10/14.
 */

function Box(x, y) {
    this.id = _.uniqueId("Box_");
    this.x = x;
    this.y = y;
    this.pixelId = "#pixel_" + x + "_" + y;
    this.contentId = "content_" + x + "_" + y;
    this.init();
}

Box.prototype.init = function () {
    console.log("init start " + this.pixelId);
    var content = $("<div></div>");
    content.attr("id", this.contentId);
    content.html(this.id.split("_")[1]);
    content.css({"background-color": "red"});
    content.appendTo(this.pixelId);
    console.log("init end ");
}

Box.prototype.show = function (effect, options, time, callback) {

    $("#"+this.contentId).show(effect, options, time, callback);
}

Box.prototype.hide = function (effect, options, time, callback) {
    $("#"+this.contentId).hide(effect, options, time, callback);
}


Box.prototype.isAsync = function (methodName) {
    if (methodName == "show" || methodName == "hide") {
        return true;
    } else {
        return false;
    }
}


Engine.prototype._parseExpression = function (expression) {

    while (expression.length > 0) {
        var exp = expression.pop();
        var sub = this.addSubEngine(null);
        var f = function (x) {
            return function (data) {
                console.log("before _longTaskFinish , sub id is " + x.id);
                return x._longTaskFinish(data);
            };
        }(sub);
        sub.start();
        var box = boxMap[exp.id];
        if (box == undefined) {
            console.log("  not found obj  by id " + exp.id);
        } else {
            exp.args.push(f)
            var task = new Task(box, exp.method, exp.args, _.uniqueId("task_"));
            var task2 = new Task(sub, "destroy", [], _.uniqueId("task_"))
            sub.taskQueue.push(task);
            sub.taskQueue.push(task2);
        }

    }


    this.status = Engine.STATUS_IDLE;

};

function Expression(id, method, args) {
    this.id = id;
    this.method = method;
    this.args = args;
}

// test code
var test = [
{"id":"Box_2","method":"hide","args":["pulsate",{"times":200},1000]},
{"id":"Box_4","method":"hide","args":["explode",{"pieces": 16},1000]}
]