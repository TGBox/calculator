// When export statement is included at the start, we need the curly braces for importing that file.
import { CalculatorFrame } from "./components/CalculatorFrame.js";
import { Screen } from "./components/CalculatorScreen.js";
import { ButtonBox } from "./components/ButtonBox.js";
import { CalculatorButton } from "./components/CalculatorButton.js";
import React, { useState } from 'react';

// Array representing all values for the buttons.
const buttonValues = [
  ["C", "del", "√()", "log()"],
  ["xʸ", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="]
];

/*
  Value formatting via regular expression to change the number into a String.
  Will add space separator for thousand mark.
*/
const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

  /*
    Value reformatting. Takes a String, removes the space separators and converts it back to a number.
  */
const removeSpaces = (num) => num.toString().replace(/\s/g, "");

export const App = () => {

  /* 
    Declaration of the state variables as one object via the react useState hook.
    Uses let instead of var so that the values are mutable and do not create unwanted side effects.
    - sign: the selected sign of the number.
    - num: the entered value.
    - res: the calculated value.
  */
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0
  });

  /* 
    Handles all the operations that correlate to the press of one of the 10 number buttons.
    Takes the value of the pressed button and adds the number to the current num value.
    Also has check against no whole numbers starting with zero, no multiple zeros being present
      before the comma, the adding of a leading zero if "." is pressed first and that numbers entered 
      won't exceed the maximum length of 16 integers.
  */
  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  /* 
    Handles the functionality if the "." button gets pressed. 
    Adds the decimal point to the current num value to make it a decimal.
    Prevents multiple decimal points.
  */
  const decimalClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
  
    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  /*
    Handles the behaviour when the "+-" or the "/" buttons get pressed.
    Prevents effects when repeated inputs are registered.
  */
  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
  
    setCalc({
      ...calc,
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0,
    });
  };

  /*
    Handles the behaviour for the press of the "=" button.
    Will calculate the result via the num, res and sign values and sets the result as the new res value.
    Also prevents effects for repeated calls and makes sure that dividing by zero is impossible.
    Calculating is handled via the built in math() function.
  */
  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
        sign === "+"
          ? a + b
          : sign === "-"
          ? a - b
          : sign === "X"
          ? a * b
          : a / b;
  
      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "/"
            ? "Can't divide with 0"
            : toLocaleString(
              math(
                Number(removeSpaces(calc.res)), 
                Number(removeSpaces(calc.num)), 
                calc.sign)),
        sign: "",
        num: 0,
      });
    }
  };

  /*
    Handles the inversion of the value. Will check if there is any entered value stored at num,
      or if any previous calculated value is stored at res. 
    Will then invert this value by multiplying it with -1.
  */
  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  /*
    Handles the behaviour if the "%" button gets pressed. Checks for values in num or res first.
    Will then calculate the percentage using the Math.pow() function.
    Will return the base to the exponent power.
  */
  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
  
    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  /*
    Handles the resetting of the values when the "C" button gets pressed.
    Will reset all values of the calc state to the initial setup on first render.
  */
  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };

  /*
    Handles the functionality of the square root button.
    If an input is already present and it is not negative, that value will be squared.
    Otherwise, the input will be ignored.
    TODO: Add functionality as to implement the square root for longer equations.
  */
  const rootClickHandler = () => {
    console.log("square root button pressed!");
  };

  /*
    Handles the behaviour if the exponent button gets pressed.
    Checks if a first input is present, ignores press with no prior input.
    Will wait for the next input to calculate the first input raised to the exponent of the second input.
    TODO: Add possibility for longer exponents.
  */
  const exponentClickHandler = () => {
    console.log("eponent button pressed!");
  };

  /*
    Handles the behaviour if the delete button was pressed.
    Checks if input was previously given, and will then delete the single last input.
  */
  const delClickHandler = () => {
    console.log("delete button pressed!");
  };

  /*
    Handles the behaviour of the logarithm button. 
    Will calculate the natural logarithm for the given input on base 10.
  */
  const logClickHandler = () => {
    console.log("logarithm button pressed!");
  };

  return (
    <CalculatorFrame>
      <Screen 
        value={calc.num ? calc.num : calc.res}
      ></Screen>
      <ButtonBox>
        {
          buttonValues.flat().map((but, i) => {
            return (
              <CalculatorButton
                key={i}
                className={but === "=" ? "equals" : "but"}
                value={but}
                onClick={
                  but === "C"
                    ? resetClickHandler
                    : but === "+-"
                    ? invertClickHandler
                    : but === "%"
                    ? percentClickHandler
                    : but === "="
                    ? equalsClickHandler
                    : but === "/" || but === "X" || but === "-" || but === "+"
                    ? signClickHandler
                    : but === "."
                    ? decimalClickHandler
                    : but === "√()"
                    ? rootClickHandler
                    : but === "del"
                    ? delClickHandler
                    : but === "xʸ"
                    ? exponentClickHandler
                    : but === "log()"
                    ? logClickHandler
                    : numClickHandler
                }
              ></CalculatorButton>
            );
          })
        }
      </ButtonBox>
    </CalculatorFrame>
  );
};