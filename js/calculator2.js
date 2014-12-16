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
            //数据载入后要执行的函数暂存在这里
            dataReadyFunc: []
            //数据源URL及载入状态
            , dataSource: []
            //检查数据源是否全部载入完毕
            , isReady: function () {
                console.log("it is ready?");
                var isReady = true;
                for (var key in this.dataSource) {
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
                            self.callReady();


                        },

                        dataType: "html"


                    });

                } else {
                    obj.data = parseFloat(obj.data);
                    obj.ready = true
                    this.callReady();
                    console.log(" get value : " + obj.data + obj.ready);
                }


//                        return value;
            }

            //数据源全部加载完毕，则逐一运行dataReadyFunc中存放的函数
            , callReady: function () {
                  var self = this;
//                console.log("callReady   ....." + this.dataSource[0].data +this.operator  + this.dataSource[1].data  + " " + this.isReady());
                if (true === self.isReady()) {
//                    for (var key in self.dataReadyFunc) {
//                    console.log("self.dataSource.length : " + self.dataSource.length + this.dataSource.length);
////                        self.resultNum = self.dataReadyFunc[key](self.dataSource[0].data, self.dataSource[1].data, self.operator);
//                         console.log("this.resultNum : " + self.resultNum);
//                    }
                        console.log("callReady   ....." + math.dataSource[0].data + this.operator + this.dataSource[1].data + " " + this.isReady());
                    this.resultNum = calculator.operator(this.dataSource[0].data, this.dataSource[1].data, this.operator);
                    this.num.push(this.resultNum);
                    console.log("this.resultNum : " + this.resultNum);
                    this.dataSource = [];
                    this.resultNum = "$"
                    this.getResult();
                }
            }, dataReady: function (func) {
                if (typeof func !== 'function') {
                    return false;
                }
                this.dataReadyFunc.push(func);
            }, init: function (one, two, three) {
                var self = this;

//                        self.dataSource[0].data = one;
//                        self.dataSource[0].ready = false;
//                        self.dataSource[1].data = two;
//                        self.dataSource[1].ready = false;
                self.dataSource.push(one);
                self.dataSource.push(two);
                self.operator = three;
                for (var pointer = 0; pointer < self.dataSource.length; pointer++) {
                    this.getValue(self.dataSource[pointer]);

                }

//                        var _initElement = function (data) {
//                            for (var pointer = 0; pointer < self.dataSource.length; pointer++) {
//                                if (data = "#") {
//                                    self.dataSource[pointer].data = calculator.getValue();
//                                } else {
//                                    self.dataSource[pointer].data = data;
//                                    self.callReady();
//                                }
//                            }
//                        }


//                        var _initElement = function (key, url) {
//                            $.getScript(url, function (e) {
//                                //每次载入数据后，将数据存放于dataSource中，将ready状态置为true，并调用callReady
//                                self.dataSource[key].data = window[key];
//                                self.dataSource[key].ready = true;
//                                self.callReady();
//                            });
//                        }
//                        for (var key in this.dataSource) {
//                            _initElement(key, this.dataSource[key].url);
//                        }
            }, operator: "", resultNum: "$", getResult: function () {
                var self = this;
//                 var i = setInterval(function () {
//                     console.log("setInterval call  callReady()  " );
//                    self.callReady();
//                    if (self.result != "")
//                        clearInterval(i);
//                }, 1000);

//                console.log("get result start :  " + self.result);
//                console.log("get result start 2 :  " + this.result);
//                if (self.result == "$") {
//                    setTimeout(self.getResult, 10000);

//                }


//               var i = setInterval(this.isReady(), 2000);

//                var temp = function(){
//                    if(this.result!="$"){
//
//                    }
//                }
//
//                temp();
//                while (i) {
//                    clearInterval(i);
//                     setTimeout(self.getResult, 10000);
//                    self.callReady();
//                     console.log("self.result :  " + self.result);
//                }



//                var test = setTimeout(this.isReady(), 2000);
//                while (test) {
//                    test = setTimeout(this.isReady(), 2000);
//                }
//                clearTimeout(test);

                console.log("get result 1 :  " + self.resultNum);
                for(var index=0; index < self.dataSource.length; index++){
                    console.log("self.datasource.index  " + self.dataSource[index].data);
                }
                 if(this.resultNum=="$"){

                     setTimeout(function(){
                          console.log("get result 2 :  " + self.resultNum);
                         self.getResult();
                     },200000);

                     setTimeout(calculator.getABC,2000);
                }else{
                      console.log("get result :  " + self.resultNum);
                      return this.resultNum;
                 }

            }

        },

        calculator;

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
     * @param suffixExpression  后缀表达式  ("#" 表示这个值是从服务器上得到的)
     * @returns {Array} 后缀表达式的结果
     */
    Calculator.prototype.calculateSuffixExpression = function (suffixExpression) {
        var num = new Array();
        for (var index = 0; index < suffixExpression.length; index++) {
//                console.log("index" + index);
            console.log("num" + num);
            var data = suffixExpression[index];
//                console.log("data   " + data);


            if (('0' <= data && data <= '9') || data == '.' || data == '#') {
                num.push(data);
            } else {
//                    console.log("num   " + num);
//                    var one = parseInt(num.pop(), 10);
//                    var two = parseInt(num.pop(), 10);
//                var two = parseFloat(num.pop());
//                var one = parseFloat(num.pop());

                var two = {};
                two.data = num.pop();
                two.ready = false;
                var one = {};
                one.data = num.pop();
                one.ready = false;

                console.log("data ready : " + one.data + two.data + data);
                math.dataReady(calculator.operator);
                math.init(one, two, data);
                math.getResult();
//                var result = calculator.operator(one, two, data);
//                console.log("result =" + math.result);
//                 setInterval(function(){console.log("it is test")}, 10000);
//                num.push(math.getResult());
                console.log("===================getResult=============================="+ one.data , + data, +two.data);
//                 math.dataSource=[];
//                math.resultNum="$"
//                console.log("num after  push ");
//                console.log(num);
            }
        }
        return num;
    }


    /* Calculator.prototype.calculateSuffixExpression = function (suffixExpression) {

     // 事件对象
     var Event = function (obj) {
     this.obj = obj;
     this.getSource = function () {
     return this.obj;
     }
     }
     // 监听对象
     var F2 = function () {
     this.hander = function (event) {
     var f2 = event.getSource();
     console.log("f2 do something!");
     f2.callback();
     }
     }
     // 被监听对象
     var F1 = function () {
     this.abc = function () {
     console.log("f1 do something one!");
     var num = new Array();
     for (var index = 0; index < suffixExpression.length; index++) {
     //                console.log("index" + index);
     console.log("num" + num);
     var data = suffixExpression[index];
     //                console.log("data   " + data);


     if (('0' <= data && data <= '9') || data == '.' || data=='#') {
     num.push(data);
     } else {
     //                    console.log("num   " + num);
     //                    var one = parseInt(num.pop(), 10);
     //                    var two = parseInt(num.pop(), 10);
     //                var two = parseFloat(num.pop());
     //                var one = parseFloat(num.pop());

     var two = {};
     two.data= num.pop();
     two.ready= false;
     var one ={};
     one.data= num.pop();
     one.ready= false;
     }
     }
     // 创建事件对象
     var e = new Event(this);
     // 发布事件
     this.f2.hander(e);
     console.log("f1 do something two!");
     }

     this.on = function (f2) {
     this.f2 = f2;
     }

     this.callback = function () {
     console.log("f1 callback invoke!");
     }
     }



     var num = new Array();
     for (var index = 0; index < suffixExpression.length; index++) {
     //                console.log("index" + index);
     console.log("num" + num);
     var data = suffixExpression[index];
     //                console.log("data   " + data);


     if (('0' <= data && data <= '9') || data == '.' || data=='#') {
     num.push(data);
     } else {
     //                    console.log("num   " + num);
     //                    var one = parseInt(num.pop(), 10);
     //                    var two = parseInt(num.pop(), 10);
     //                var two = parseFloat(num.pop());
     //                var one = parseFloat(num.pop());

     var two = {};
     two.data= num.pop();
     two.ready= false;
     var one ={};
     one.data= num.pop();
     one.ready= false;



     var math = {
     //数据载入后要执行的函数暂存在这里
     dataReadyFunc: []
     //数据源URL及载入状态
     , dataSource: []
     //检查数据源是否全部载入完毕
     , isReady: function () {
     var isReady = true;
     for (var key in this.dataSource) {
     if (this.dataSource[key].ready !== true) {
     isReady = false;
     }
     }
     return isReady;
     }
     , getValue: function (obj) {
     console.log("start get value form server  .....");
     //                        var value = "";
     var self = this;

     if (obj.data =="#") {
     $.ajax({
     url: "http://127.0.0.1:9000/value.html",
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
     success:
     function get (data, textStatus) {
     console.log('received ', data);
     var random = parseInt(Math.random() * 10 + 1);
     //                                    $("#value").html(random);
     //                                    console.log('received ', $("#value").html());
     console.log('received ', random);
     //                                    obj.data =random;
     obj.data =5;
     obj.ready = true
     console.log(" get value form server : " +obj.data + obj.ready);
     self.callReady();


     },

     dataType: "html"


     });

     } else {
     //                            obj.data = data;
     obj.ready = true
     this.callReady();
     console.log(" get value : " +obj.data + obj.ready);
     }


     //                        return value;
     }

     //数据源全部加载完毕，则逐一运行dataReadyFunc中存放的函数
     , callReady: function () {
     console.log("callReady   .....");
     if (true === this.isReady()) {
     for (var key in this.dataReadyFunc) {
     this.dataReadyFunc[key](this.dataSource[0].data, this.dataSource[1].data, this.operator);
     }
     }
     }, dataReady: function (func) {
     if (typeof func !== 'function') {
     return false;
     }
     this.dataReadyFunc.push(func);
     }, init: function (one, two, three) {
     var self = this;

     //                        self.dataSource[0].data = one;
     //                        self.dataSource[0].ready = false;
     //                        self.dataSource[1].data = two;
     //                        self.dataSource[1].ready = false;
     self.dataSource.push(one);
     self.dataSource.push(two);
     self.operator = three;
     for (var pointer = 0; pointer < self.dataSource.length; pointer++) {
     this.getValue(self.dataSource[pointer]);

     }

     //                        var _initElement = function (data) {
     //                            for (var pointer = 0; pointer < self.dataSource.length; pointer++) {
     //                                if (data = "#") {
     //                                    self.dataSource[pointer].data = calculator.getValue();
     //                                } else {
     //                                    self.dataSource[pointer].data = data;
     //                                    self.callReady();
     //                                }
     //                            }
     //                        }


     //                        var _initElement = function (key, url) {
     //                            $.getScript(url, function (e) {
     //                                //每次载入数据后，将数据存放于dataSource中，将ready状态置为true，并调用callReady
     //                                self.dataSource[key].data = window[key];
     //                                self.dataSource[key].ready = true;
     //                                self.callReady();
     //                            });
     //                        }
     //                        for (var key in this.dataSource) {
     //                            _initElement(key, this.dataSource[key].url);
     //                        }
     },operator:""

     }


     var result = math.dataReady(calculator.operator);
     math.init(one, two, data);
     //                var result = calculator.operator(one, two, data);
     num.push(result);
     }
     }
     return num;
     }*/


    /**
     *
     */

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
            console.log("current index char is  : " + currentChar);
            console.log("operatorStack is : " + operatorStack);
            console.log("suffixExpression is : " + suffixExpression);

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
        console.log("generateSuffixExpression : " + suffixExpression);
        //calculate  Suffix Expression
        var result = calculator.calculateSuffixExpression(suffixExpression);
        console.log("------------------- ");
        console.log(result);
        return result;
    }

      Calculator.prototype.abc = 1;
        Calculator.prototype.getABC = function () {

        console.log("---------ABC---------- " + this.abc);
        console.log("---------ABC---------- " + calculator.abc);
         var a = this;
          console.log("---------ABC---------- " + a.abc);
    }



//    Calculator.prototype.getValue = function () {
//        console.log("start get value form server  .....");
//        var value = "";
//        $.ajax({
//            url: "http://127.0.0.1:9000/value.html",
////                crossDomain: true,
//            success: function (data, textStatus) {
//                console.log('received ', data);
//                var random = parseInt(Math.random() * 10 + 1);
//                $("#value").html(random);
//                console.log('received ', $("#value").html());
//                value = $("#value").html();
//
//            },
//
//            dataType: "html"
//
//
//        });
//
//        return value;
//    }


    calculator = new Calculator();


    exp.calculatorExpression = function (expression) {
        var result = calculator.calculate(expression);
        console.log(expression + " = " + result);
        return result;
    }


    /**
     * 初始化计算器
     */
    $.init = function () {

        var calculatorDiv = $('<div id="calculatorBox"><div id="calculator">' +
            ' <input type="text" id="expression">' +
            ' <ul class="one clearfix"> ' +
            '<li class="clear">C</li>' + '<li class="back">back</li>' + '<li class="num">(</li>' + '<li class="num">)</li>' + '<li class="num">#</li>' +
            '<li class="num">7</li>' + '<li class="num">8</li>' + '<li class="num">9</li>' + '<li class="num">/</li>' + '<li class="num"></li>' +
            '<li class="num">4</li>' + '<li class="num">5</li>' + '<li class="num">6</li>' + '<li class="num">*</li>' + '<li class="num"></li>' +
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


        $('#calculator').on('click', '.equal', function (e) {
            var expression = $("#expression").val();
            var result = calculator.calculate(expression);
            if (result != NaN) {
                $("#expression").val(result);
            } else {
                $("#expression").val("it is error , please enter again");
            }
        });

        console.log("Calculator is init .");

    }


})(window, window.jQuery);


//var arr=[ ];
//for (var i=1;i<3;i++) {
//    arr[i]=function(idx) {
//        console.log('var '+idx);
//    }(i);
//}
//
//arr[0]();
//arr[1]();