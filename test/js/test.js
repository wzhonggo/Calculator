/**
 * Created by wzgong on 11/18/14.
 */
QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});



QUnit.test( "calculator Expression 1", function( assert ) {
  assert.ok(calculatorExpression("((2*(19-13*(1+2)/39)/6+4)-5)/5+((2+3)*2-5)") == "6", "Passed!" );
});

QUnit.test("calculator Expression 2", function( assert ) {
  assert.ok(calculatorExpression("1+(2*3+(4*5+6)*7)") == "189", "Passed!" );
});