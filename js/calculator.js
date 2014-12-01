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
                    $.ajax({
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


                    });

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


    function Calculator() {
    }


    /**
     * 二个数加 减乘除运算
     * @param one 第一个操作数
     * @param two 第二个操作数
     * @param opeators 运算符
     * @returns {*} 这两个操作数运算后的结果
     */
    Calculator.prototype.operator = function (one, two, opeators) {
//            console.log("operator ======================");
//            console.log(one);
//            console.log(two);
//            console.log(opeator);
        console.log("operator function : " + one + opeators + two);
        var result;
        switch (opeators) {
            case '+':
                result = one + two;
                break;
            case '-':
                result = one - two;
                break;
            case '*':
                result = one * two;
                break;
            case '/':
                result = one / two;
                break;
        }

        return result;
    }


    /**
     *  这里的优先级是在ope ratorStack弹出来的时候的优先级，不是数学运算时候的优先级
     * @param opeator   运算符 比如： "+"
     * @returns {number}
     */
    Calculator.prototype.getPriority = function (opeator) {
        switch (opeator) {
            case '+':
            case '-':
                return 0;
                break;
            case '/':
            case '*':
                return 1;
                break;
            case '(':
            case ')':
                return -1;
                break;
        }
    }


    /**
     *
     * @param operator  运算符
     * @param operatorStack   运算符堆栈
     * @param suffixExpression  后缀表达式
     */
    Calculator.prototype.check = function (operator, operatorStack, suffixExpression) {
//            console.log(" ======================");
//               console.log("current index operator is  : " + operator);
//                console.log("operatorStack is : " + operatorStack);
//                console.log("suffixExpression is : " + suffixExpression);
//            console.log(operator);
//            console.log(operatorStack);
//            console.log(suffixExpression);
//            console.log(" =======check===============");


        if (operatorStack.length == 0) {
            operatorStack.push(operator);
            return;
        }

        var input = operatorStack.pop();
        if (calculator.getPriority(operator) <= calculator.getPriority(input)) {
            suffixExpression.push(input);
            calculator.check(operator, operatorStack, suffixExpression);
        } else {
            operatorStack.push(input);
            operatorStack.push(operator);
        }


    }


    /**
     * 计算后缀表达式
     * @param suffixExpression 后缀表达式  ("#" 表示这个值是从服务器上得到的)
     */
    Calculator.prototype.calculateSuffixExpression = function (suffixExpression) {
//        var num = new Array();
        /*   var math = {
         //数据载入后要执行的函数暂存在这里
         dataReadyFunc: []
         //数据源URL及载入状态
         , dataSource: [], num: [], suffixExpressionVar: []
         //检查数据源是否全部载入完毕
         , isReady: function () {
         console.log("it is ready?" + this.dataSource.length);
         var isReady = true;
         for (var key in this.dataSource) {
         console.log(key + ":" + this.dataSource[key].data);
         if (this.dataSource[key].ready !== true) {
         isReady = false;
         }
         }

         return isReady;
         }

         // 得到真实的数字
         , getValue: function (obj) {
         console.log("start get value form server  ....." + obj.data);
         //                        var value = "";
         var self = this;

         if (obj.data == "#") {
         $.ajax({
         url: "http://127.0.0.1:9000/value.html",
         //                                async:false,
         //                crossDomain: true,
         //                                success: function getValueFormServer (self){
         //                                    function get (data, textStatus) {
         //                                    console.log('received ', data);
         //                                    var random = parseInt(Math.random() * 10 + 1);
         ////                                    $("#value").html(random);
         ////                                    console.log('received ', $("#value").html());
         //                                      console.log('received ', random);
         //                                    obj.data =random;
         //                                    obj.ready = true
         //                                    console.log(" get value form server : " +obj.data + obj.ready);
         //                                    self.callReady();
         //
         //                                }
         //                                },
         success: function get(data, textStatus) {
         //                                    console.log('received ', data);
         var random = parseInt(Math.random() * 10 + 1);
         //                                    $("#value").html(random);
         //                                    console.log('received ', $("#value").html());
         //                            console.log('received ', random);
         //                                    obj.data =random;
         obj.data = parseFloat(5);
         obj.ready = true
         console.log(" get value form server : " + obj.data + obj.ready);
         self.num.push(data);
         //                            self.callReady();


         },

         dataType: "html"


         });

         } else {
         obj.data = parseFloat(obj.data);
         obj.ready = true
         this.num.push(data);
         //                    this.callReady();
         console.log(" get value : " + obj.data + obj.ready);
         }


         //                        return value;
         }

         //数据源全部加载完毕，则逐一运行dataReadyFunc中存放的函数
         , callReady: function () {
         */
        /*      if (true === this.isReady()) {
         //                    for (var key in this.dataReadyFunc) {
         //
         //                        this.resultNum = this.dataReadyFunc[key](this.dataSource[0].data, this.dataSource[1].data, this.operator);
         //                        this.num.push(this.resultNum);
         //                        console.log("this.resultNum : " + this.resultNum);
         //                        math.dataSource = [];
         //                        math.resultNum = "$"
         //                    }
         console.log("callReady   ....." + math.dataSource[0].data + this.operator + this.dataSource[1].data + " " + this.isReady());
         this.resultNum = calculator.operator(this.dataSource[0].data, this.dataSource[1].data, this.operator);
         this.num.push(this.resultNum);
         console.log("this.resultNum : " + this.resultNum);
         if (this.suffixExpressionVar.length == 0) {
         console.log(" final result : " + this.resultNum);
         //                        calculator.result = this.resultNum[0];
         //                        calculator.setResult(this.resultNum);
         calculator.callBack(this.resultNum);

         } else {
         this.dataSource = [];
         this.resultNum = "$"
         this.process(this.suffixExpressionVar);
         }


         }*/
        /*
         this.resultNum = calculator.operator(this.dataSource[0].data, this.dataSource[1].data, this.operator);
         this.num.push(this.resultNum);
         }, dataReady: function (func) {
         if (typeof func !== 'function') {
         return false;
         }
         this.dataReadyFunc.push(func);
         }, init: function (one, two, three) {
         this.dataSource.push(one);
         this.dataSource.push(two);
         this.operator = three;
         console.log("init length " + this.dataSource.length);
         for (var pointer = 0; pointer < this.dataSource.length; pointer++) {
         this.getValue(this.dataSource[pointer]);

         }

         }, operator: "", resultNum: "$", process: function (data) {
         //                console.log("suffixExpression " + suffixExpression);
         //                while (suffixExpression.length > 0) {
         //                console.log("index" + index);
         //                    console.log("num" + this.num);
         //                    var data = suffixExpression.pop();
         //                console.log("data   " + data);


         if (('0' <= data && data <= '9') || data == '.' || data == '#') {
         this.getValue(data);

         } else {
         //                        var two = {};
         //                        two.data = this.num.pop();
         //                        two.ready = false;
         //                        var one = {};
         //                        one.data = this.num.pop();
         //                        one.ready = false;
         ////                        this.suffixExpressionVar = suffixExpression;
         //                        console.log("data ready : " + one.data + two.data + data);
         //                        this.init(one, two, data);
         //                        break;

         this.resultNum = calculator.operator(this.dataSource[0].data, this.dataSource[1].data, this.operator);
         this.num.push(this.resultNum);
         }
         //                }

         }

         };*/


//        math.process(suffixExpression);


    }


    /**
     * 根据中缀表达式生成后缀表达式
     * @param expression   中缀表达式
     * @returns   后缀表达式
     */
    Calculator.prototype.generateSuffixExpression = function (expression) {

        //当最后一个字符是数字的时候不会被存在suffixExpression里面， 在外面加一层括号就可以了
        expression = "(" + expression + ")";


        var operatorStack = new Array()
        var suffixExpression = new Array();
        console.log(expression);
        var num = "";

        for (var index = 0; index < expression.length; index++) {
            var currentChar = expression[index];
//            console.log("current index char is  : " + currentChar);
//            console.log("operatorStack is : " + operatorStack);
//            console.log("suffixExpression is : " + suffixExpression);

            if (('0' <= currentChar && currentChar <= '9') || currentChar == '.' || currentChar == '#') {
                num = num + currentChar;
            } else if (currentChar == "+" || currentChar == "-" || currentChar == "*" || currentChar == "/" || currentChar == "(" || currentChar == ")") {

                if (num.length > 0) {
                    suffixExpression.push(num);
                }


                // reset num
                num = "";


                if (operatorStack.length == 0) {
                    operatorStack.push(currentChar);
                } else {
                    if (currentChar == "(") {
                        operatorStack.push(currentChar);
                    } else if (currentChar == ")") {
                        while (operatorStack.length > 0) {
                            var input = operatorStack.pop();
                            if (input != "(") {
                                suffixExpression.push(input);
                            } else {
                                break;
                            }

                        }
                    } else {
                        calculator.check(currentChar, operatorStack, suffixExpression);
                    }
                }


            }

        }
        return suffixExpression;
    }


    /**
     * 计算表达式
     * @param expression   中缀表达式
     * @returns  中缀表达式的结果
     */
    Calculator.prototype.calculate = function (expression) {
        console.log("calculate start .....");
        var suffixExpression = calculator.generateSuffixExpression(expression);
        console.log("====================================generateSuffixExpression : " + suffixExpression);
        //calculate  Suffix Expression
//        var ex = new Array();
//        while (suffixExpression.length > 0) {
//            ex.push(suffixExpression.pop());
//            engine.queue.push(suffixExpression.pop())
//        }
//        console.log("====================================generateSuffixExpression : " + ex);
        math.steps = suffixExpression.length;
        engine.queue = suffixExpression;
//        calculator.calculateSuffixExpression(ex);
//        calculator.calculateSuffixExpression(suffixExpression);


//        engine.queue = suffixExpression;

//        var result = calculator.calculateSuffixExpression(ex);
//        console.log("------------------- ");
//        console.log(result);
//        return result;
    }

    Calculator.prototype.callBack;

//    Calculator.prototype.result;

    /**
     * 初始化回调函数
     * @param func  在计算完成后会回调这个函数，把结果当做参数
     * @returns {boolean}
     */
    Calculator.prototype.init = function (func) {
        console.log("init callback ");
        if (typeof func !== 'function') {
            return false;
        }
        this.callBack = func;
    }


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
