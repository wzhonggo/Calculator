/**
 * Created by wzgong on 11/13/14.
 */
(function (exp, $) {

    var
        config = {},
        options = {
            "debug": true
//			"debug": false
        },
        math = {
            //操作数堆栈
            num: []

            // 得到真实的数字
            , getValue: function (obj) {
                console.log("start get value form server  .....");
//                        var value = "";
                var self = this;

                if (obj == "#") {
                    /*        $.ajax({
                     url: "http://127.0.0.1:9000/value.html",
                     //                        url: "http://127.0.0.1:18080/salsa_test/user/welcome.htm",
                     //                                async:false,
                     //                                        crossDomain: true,
                     success: function get(data, textStatus) {
                     //                                    console.log('received ', data);
                     var random = parseInt(Math.random() * 10 + 1);
                     //                                    $("#value").html(random);
                     //                                    console.log('received ', $("#value").html());
                     //                            console.log('received ', random);
                     //                                    obj.data =random;
                     obj = parseFloat(5);
                     self.num.push(obj);
                     self.callback();


                     },

                     dataType: "html"


                     });*/

                    setTimeout(function () {
                        var random = parseInt(Math.random() * 10 + 1);
//                                    $("#value").html(random);
//                                    console.log('received ', $("#value").html());
//                            console.log('received ', random);
//                                    obj.data =random;
                        obj = parseFloat(5);
                        self.num.push(obj);
                        self.callback();
                        engine.suspend = false;
                    }, 5000);
                    engine.suspend = true;


                } else {
                    obj = parseFloat(obj);
                    console.log(" get value : " + obj);
                    this.num.push(obj);
                    this.callback();

                }
            }, process: function (data) {
//                console.log("data : " + data);
//                console.log(this);
                math.steps = math.steps - 1;
                console.log("this num  : " + math.num);
//                console.log("this queue  : " + this.queue);
                if (('0' <= data && data <= '9') || data == '.' || data == '#') {
//                    console.log("this.getValue : " + data);
                    math.getValue(data);

                } else {
//                    console.log("calculator.operator : " + data);
                    var two = math.num.pop();
                    var one = math.num.pop();
                    var temp = calculator.operator(one, two, data);
                    math.num.push(temp);
                    math.callback();
                }


            }, callback: function () {

                console.log("when callback this num is   : " + this.num);
                console.log("when callback this step is  : " + this.steps);
                engine.complete();
                if (this.steps == 0) {
                    console.log("call back  calculator")
                    calculator.callBack(this.num);
                    //清空数据
                    this.num = [];
                    this.steps = -1;
                }
            }, steps: -1

        },


        calculator, engine, testEngine;

    /*
     * ------ SECTION: Utilities
     */

    /*
     * Returns a random string used for state
     */
    var uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * A log wrapper, that only logs if logging is turned on in the config
     * @param  {string} msg Log message
     */
    var log = function (msg) {
        if (!options.debug) return;
        if (!console) return;
        if (!console.log) return;

        // console.log("LOG(), Arguments", arguments, msg)
        if (arguments.length > 1) {
            console.log(arguments);
        } else {
            console.log(msg);
        }

    }

    /**
     * Set the global options.
     */
    var setOptions = function (opts) {
        if (!opts) return;
        for (var k in opts) {
            if (opts.hasOwnProperty(k)) {
                options[k] = opts[k];
            }
        }
        log("Options is set to ", options);
    }


    /*
     * Takes an URL as input and a params object.
     * Each property in the params is added to the url as query string parameters
     */
    var encodeURL = function (url, params) {
        var res = url;
        var k, i = 0;
        var firstSeparator = (url.indexOf("?") === -1) ? '?' : '&';
        for (k in params) {
            res += (i++ === 0 ? firstSeparator : '&') + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }
        return res;
    }


    /*
     * Returns epoch, seconds since 1970.
     * Used for calculation of expire times.
     */
    var epoch = function () {
        return Math.round(new Date().getTime() / 1000.0);
    }


    var parseQueryString = function (qs) {
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) {
                return decodeURIComponent(s.replace(a, " "));
            },
            q = qs,
            urlParams = {};

        while (e = r.exec(q))
            urlParams[d(e[1])] = d(e[2]);

        return urlParams;
    }
    /*
     * ------ / SECTION: Utilities
     */


//    exp.jso_ensureTokens = function (ensure) {
//        var providerid, scopes, token;
//        for (providerid in ensure) {
//            scopes = undefined;
//            if (ensure[providerid]) scopes = ensure[providerid];
//            token = api_storage.getToken(providerid, scopes);
//
//            log("Ensure token for provider [" + providerid + "] ");
//            log(token);
//
//            if (token === null) {
//                jso_authrequest(providerid, scopes);
//            }
//        }
//
//
//        return true;
//    }


//    $.oajax = function (settings) {
//        return null;
//    };





    calculator = new Calculator()

    engine = new Engine(math.process);
//    testEngine = new Engine(console.log);


    /**
     * 在html 中可以直接调用这个方法来计算表达式
     * @param expression 中缀表达式
     * @param callback 回调函数
     */
    exp.calculatorExpression = function (expression, callback) {
        calculator.init(callback);
        calculator.calculate(expression);
    }


    /**
     * 初始化计算器
     */
    $.init = function () {

        var calculatorDiv = $('<div id="calculatorBox"><div id="calculator">' +
            ' <input type="text" id="expression">' +
            ' <ul class="one clearfix"> ' +
            '<li class="clear">C</li>' + '<li class="back">back</li>' + '<li class="num">(</li>' + '<li class="num">)</li>' + '<li class="num">#</li>' +
            '<li class="num">7</li>' + '<li class="num">8</li>' + '<li class="num">9</li>' + '<li class="num">/</li>' + '<li class="suspend">suspend</li>' +
            '<li class="num">4</li>' + '<li class="num">5</li>' + '<li class="num">6</li>' + '<li class="num">*</li>' + '<li class="continue">continue</li>' +
            '<li class="num">1</li>' + '<li class="num">2</li>' + '<li class="num">3</li>' + '<li class="num">-</li>' +
            '<li class="zero">0</li>' + '<li class="num">.</li>' + '<li class="num">+</li>' + '<li class="equal black">=</li>' +
            '</ul> </div></div>  <div id="value"></div>');
//    calculatorDiv.attr("id", "calculator");
//    calculatorDiv.html("it is test")


        calculatorDiv.appendTo("body");


        $('#calculator').on('click', '.num,.zero', function (e) {
            $("#expression").val($("#expression").val() + $(this).html());
        });

        $('#calculator').on('click', '.clear', function (e) {
            $("#expression").val("");
        });

        $('#calculator').on('click', '.suspend', function (e) {
            engine.suspend = true;
        });

        $('#calculator').on('click', '.continue', function (e) {
            engine.suspend = false;
        });

        $('#calculator').on('click', '.back', function (e) {
            var expression = $("#expression").val();
//            console.log("expression " + expression);
            if (expression != null) {
                if (expression.length == 1) {
                    $("#expression").val("");
                } else {
                    $("#expression").val(expression.substring(0, expression.length - 1));
                }
            } else {
                $("#expression").val("");
            }
        });

        //设置回调函数
        var setResult = function (result) {
            console.log("calculate final result is " + result);
            if (result != NaN) {
                $("#expression").val(result);
            } else {
                $("#expression").val("it is error , please enter again");
            }
        }


        $('#calculator').on('click', '.equal', function (e) {
            var expression = $("#expression").val();
            calculator.init(setResult);
            calculator.calculate(expression);
//            var result = calculator.calculate(expression);
//            if (result != NaN) {
//            } else {
//                $("#expression").val(result);
//                $("#expression").val("it is error , please enter again");
//            }
        });

        console.log("Calculator is init .");

    }


})(window, window.jQuery);
