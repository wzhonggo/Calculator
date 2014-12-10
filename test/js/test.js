/**
 * Created by wzgong on 11/18/14.
 */
QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});


//QUnit.test( "calculator Expression 1", function( assert ) {
//  assert.ok(calculatorExpression("((2*(19-13*(1+2)/39)/6+4)-5)/5+((2+3)*2-5)") == "6", "Passed!" );
//});
//
//QUnit.test("calculator Expression 2", function( assert ) {
//  assert.ok(calculatorExpression("1+(2*3+(4*5+6)*7)") == "189", "Passed!" );
//});
//module("计算器测试");

var test1 = function (result) {
    QUnit.test("calculator Expression test1", function (assert) {
        assert.ok(result == "6", "Passed!");
    });
};


calculatorExpression("((2*(19-13*(1+2)/39)/6+4)-5)/5+((2+3)*2-5)", test1);
var test2 = function (result) {
    QUnit.test("calculator Expression test2", function (assert) {
        assert.ok(result == "189", "Passed!");
    });
};


calculatorExpression("1+(2*3+(4*5+6)*7)", test2);
var test3 = function (result) {
    QUnit.test("calculator Expression test3", function (assert) {
        assert.ok(result == "3", "Passed!");
    });
}

calculatorExpression("1+#-3", test3);
//QUnit.test("calculator Expression 3", function( assert ) {
//  assert.ok(calculatorExpression("1+#-3") == "3", "Passed!" );
//});

