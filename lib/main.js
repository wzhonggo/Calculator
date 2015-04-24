require.config({
    paths: {
        jquery: "jquery-1.11.1.min",
        engine: "Engine",
        calculator: "c"

    },
    shim: {
//        'underscore': {
//            exports: '_'
//        }
    }
});


require(['calculator', "jquery"], function (c, $) {

      var calculator = new c();

    /**
     * 初始化计算器
     */

    var init = function (calculator) {

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
    }


    init(calculator);

});



