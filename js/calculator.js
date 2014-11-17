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
     *二个数加 减乘除运算
     */

    /**
     *
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
//            console.log("operator ======================");
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
     *
     */

    /**
     * 计算后缀表达式
     * @param suffixExpression  后缀表达式
     * @returns {Array} 后缀表达式的结果
     */
    Calculator.prototype.calculateSuffixExpression = function (suffixExpression) {
        var num = new Array();
        for (var index = 0; index < suffixExpression.length; index++) {
//                console.log("index" + index);
            console.log("num" + num);
            var data = suffixExpression[index];
//                console.log("data   " + data);
            if (('0' <= data && data <= '9') || data == '.') {
                num.push(data);
            } else {
//                    console.log("num   " + num);
//                    var one = parseInt(num.pop(), 10);
//                    var two = parseInt(num.pop(), 10);
                var two = parseFloat(num.pop());
                var one = parseFloat(num.pop());
                var result = calculator.operator(one, two, data);
                num.push(result);
            }
        }
        return num;
    }


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

            if (('0' <= currentChar && currentChar <= '9') || currentChar == '.') {
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





    calculator = new Calculator();


   /**
     * 初始化计算器
     */
    $.init = function () {

        var calculatorDiv = $('<div id="calculatorBox"><div id="calculator">' +
            ' <input type="text" id="expression">' +
            ' <ul class="one clearfix"> ' +
            '<li class="clear">C</li>' + '<li class="back">back</li>' + '<li class="num">(</li>' + '<li class="num">)</li>' + '<li class="num"></li>' +
            '<li class="num">7</li>' + '<li class="num">8</li>' + '<li class="num">9</li>' + '<li class="num">/</li>' + '<li class="num"></li>' +
            '<li class="num">4</li>' + '<li class="num">5</li>' + '<li class="num">6</li>' + '<li class="num">*</li>' + '<li class="num"></li>' +
            '<li class="num">1</li>' + '<li class="num">2</li>' + '<li class="num">3</li>' + '<li class="num">-</li>' +
            '<li class="zero">0</li>' + '<li class="num">.</li>' + '<li class="num">+</li>' + '<li class="equal black">=</li>' +
            '</ul> </div></div>');
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
