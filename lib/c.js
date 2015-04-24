/**
 * Created by wzgong on 1/28/15.
 */

define(["engine", "jquery"],    function (Engine, $) {
        function Calculator() {
            this.engine = new Engine();
            this.suffixExpression=[];
            this.numArray=[];
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
            if (this.getPriority(operator) <= this.getPriority(input)) {
                suffixExpression.push(input);
                this.check(operator, operatorStack, suffixExpression);
            } else {
                operatorStack.push(input);
                operatorStack.push(operator);
            }


        }

       /**
         * 计算后缀表达式
         * @param suffixExpression 后缀表达式  ("#" 表示这个值是从服务器上得到的)
         */
        Calculator.prototype.calculateSuffixExpression = function (deferred) {
           var self = this;
            var chain = deferred.then(function () {
                var data = self.suffixExpression.shift();
               if (('0' <= data && data <= '9') || data == '.' || data == '#') {
                   self.numArray.push(data);
               }else{
                   var d1 = self.numArray.pop();
                   var d2 = self.numArray.pop();
                   var result = self.operator(d1, d2, data);
                   self.numArray.push(result);
               }

               var d = $.Deferred();
               if(self.suffixExpression.size >0){
                   self.calculateSuffixExpression(d);
               }
              self.engine.queue.push(d);
            });
            return chain;

        }

        /**
         * 计算后缀表达式
         * @param suffixExpression 后缀表达式  ("#" 表示这个值是从服务器上得到的)
         */
        Calculator.prototype.calculateSuffixExpression2 = function (suffixExpression) {
//        var num = new Array();
            var self =this;
            var math = {
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
                    if (true === this.isReady()) {
                        //                    for (var key in this.dataReadyFunc) {
                        //
                        //                        this.resultNum = this.dataReadyFunc[key](this.dataSource[0].data, this.dataSource[1].data, this.operator);
                        //                        this.num.push(this.resultNum);
                        //                        console.log("this.resultNum : " + this.resultNum);
                        //                        math.dataSource = [];
                        //                        math.resultNum = "$"
                        //                    }
                        console.log("callReady   ....." + math.dataSource[0].data + this.operator + this.dataSource[1].data + " " + this.isReady());
                        this.resultNum = self.operator(this.dataSource[0].data, this.dataSource[1].data, this.operator);
                        this.num.push(this.resultNum);
                        console.log("this.resultNum : " + this.resultNum);
                        if (this.suffixExpressionVar.length == 0) {
                            console.log(" final result : " + this.resultNum);
                            //                        calculator.result = this.resultNum[0];
                            //                        calculator.setResult(this.resultNum);
                            self.callBack(this.resultNum);

                        } else {
                            this.dataSource = [];
                            this.resultNum = "$"
                            this.process(this.suffixExpressionVar);
                        }


                    }
                    this.resultNum = self.operator(this.dataSource[0].data, this.dataSource[1].data, this.operator);
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

            };


            math.process(suffixExpression);


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
                            this.check(currentChar, operatorStack, suffixExpression);
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
            this.suffixExpression = this.generateSuffixExpression(expression);
            console.log("====================================generateSuffixExpression : " + this.suffixExpression);
            //calculate  Suffix Expression
            var ex = new Array();
            if (this.suffixExpression .length > 0) {
//                ex.push(suffixExpression.pop());
//                this.engine.queue.push(suffixExpression.pop())
                var head = $.Deferred();
                var result = this.calculateSuffixExpression(head);
                 this.engine.queue.push(head);
                console.log("------------------- ");
//                console.log(result);
//                return result;
            }
            console.log("====================================generateSuffixExpression : " + ex);
//        math.steps = suffixExpression.length;
//        engine.queue = suffixExpression;
//        this.calculateSuffixExpression(ex);
//        this.calculateSuffixExpression(suffixExpression);


//        engine.queue = suffixExpression;

//            var result = this.calculateSuffixExpression(ex);
//            console.log("------------------- ");
//            console.log(result);
//            return result;
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


        return Calculator;

    });
