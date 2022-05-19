// When export statement is included at the start, we need the curly braces for importing that file.
import { CalculatorFrame } from "./components/CalculatorFrame.js";
import { Screen } from "./components/CalculatorScreen.js";
import { ButtonBox } from "./components/ButtonBox.js";
import { CalculatorButton } from "./components/CalculatorButton.js";
import React, { useState } from 'react';

// TODO: Implement additional advanced math features: sin, cos, arc, natural log, pi, etc. 

// Array representing all values for the buttons.
const buttonValues = [
  ["C", "CE", "√()", "+-"],
  ["sin", "cos", "tan", "xʸ"],
  ["lg()", "log()", "%", "/"],
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
    Handles the behaviour when the "+-", "xʸ" or the "/" buttons get pressed.
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
          : sign === "xʸ"
          ? Math.pow(a, b)
          : a / b;
      if(calc.num === "0" && calc.sign === "/") {
        alert("Error!\n\nBad Math!\n\nDivision by 0 is impossible!\n\nTry again!");
        setCalc({
          ...calc,
          res: 0,
          sign: "",
          num: 0
        });
      } else {
        let result = toLocaleString(math(
          Number(removeSpaces(calc.res)), 
          Number(removeSpaces(calc.num)), 
          calc.sign));
        if(result === "NaN") {
          alert("Can't calculate negative square roots!\n\nTry again!");
          setCalc({
            ...calc,
            res: 0,
            sign: "",
            num: 0
          });
        } else {
          setCalc({
            ...calc,
            res: result,
            sign: "",
            num: 0
          });
        }
        
      }
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
    TODO: Add functionality if the first input is square root. 
      Validation needs to be implemented via equal button.
  */
  const rootClickHandler = () => {
    if(calc.res !== 0) {
      if(Number(calc.res) > 0) {
        let alteredRes = toLocaleString(Math.sqrt(Number(removeSpaces(calc.res))));
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredRes,
        });
      } else if(Number(calc.res) < 0) {
        alert("Can't calculate negative square roots!\n\nTry again!");
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: 0,
        });
      } else {
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: 0,
        });
      }
    } else if(calc.num !== 0) {
      if(Number(calc.num) > 0) {
        let alteredNum = toLocaleString(Math.sqrt(Number(removeSpaces(calc.num))));
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredNum,
        });
      } else {
        alert("Can't calculate negative square roots!\n\nTry again!");
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: 0,
        });
      }
    }
  };

  /*
    Handles the behaviour if the clear entry ("CE") button was pressed.
    Checks if input was previously given, and will then delete the single last input.
  */
  const delClickHandler = () => {
    if(calc.res !== 0) {
      let alteredRes = toLocaleString(removeSpaces(calc.res)).slice(0, -1);
      if(alteredRes.length === 0) {
        alteredRes = 0;
      }
      setCalc({
        ...calc,
        sign: "",
        num: alteredRes,  // Is set as num value to allow further calculations with it.
        res: 0,
      });
    } else if(calc.num !== 0) {
      let alteredNum = toLocaleString(removeSpaces(calc.num)).slice(0, -1);
      if(alteredNum.length === 0) {
        alteredNum = 0;
      }
      setCalc({
        ...calc,
        sign: "",
        num: alteredNum,
        res: 0,
      });
    } 
  };

  /*
    Handles the behaviour of the logarithm button. 
    Will calculate the logarithm for the given input on base 10.
    TODO: Add functionality if the first input is the log button.
      Validation needs to be implemented via equal button.
  */
  const logClickHandler = () => {
    if(calc.res !== 0) {
      let alteredRes = toLocaleString(Math.log10(removeSpaces(calc.res)));
      if(alteredRes !== "NaN") {
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredRes,
        });
      } else {
        let positiveRes = (calc.res).substring(1);
        setCalc({
          ...calc,
          sign: "",
          num: calc.num,
          res: positiveRes,
        });
        alteredRes = "-" + toLocaleString(Math.log10(removeSpaces(positiveRes)));
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredRes,
        });
      }
    } else if(calc.num !== 0) {
      let alteredNum = toLocaleString(Math.log10(removeSpaces(calc.num)));
      if(alteredNum !== "NaN") {
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredNum,
        });
      } else {
        let positiveNum = (calc.num).substring(1);
        setCalc({
          ...calc,
          sign: "",
          num: positiveNum,
          res: 0,
        });
        alteredNum = "-" + toLocaleString(Math.log10(removeSpaces(positiveNum)));
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredNum,
        });
      }
    }
  };

  /*
    Handles the behaviour if the "sin" button was pressed.
    Checks for previous input and applies the sinus function to that value.
  */
  const sinClickHandler = () => {
    if(calc.res !== 0) {
      let alteredRes = toLocaleString(Math.sin(removeSpaces(calc.res)));
      setCalc({
        ...calc,
        sign: "",
        num: 0,
        res: alteredRes,
      });
    } else if(calc.num !== 0) {
      let alteredNum = toLocaleString(Math.sin(removeSpaces(calc.num)));
      setCalc({
        ...calc,
        sign: "",
        num: 0,
        res: alteredNum,
      });
    }
  };

  /*
    Handles the behaviour if the "cos" button was pressed.
    Checks for previous input and applies the cosinus function to that value.
  */
  const cosClickHandler = () => {
    if(calc.res !== 0) {
      let alteredRes = toLocaleString(Math.cos(removeSpaces(calc.res)));
      setCalc({
        ...calc,
        sign: "",
        num: 0,
        res: alteredRes,
      });
    } else if(calc.num !== 0) {
      let alteredNum = toLocaleString(Math.cos(removeSpaces(calc.num)));
      setCalc({
        ...calc,
        sign: "",
        num: 0,
        res: alteredNum,
      });
    }
  };

  /*
    Handles the behaviour if the "tan" button was pressed.
    Checks for previous input and applies the tangens function to that value.
  */
  const tanClickHandler = () => {
    if(calc.res !== 0) {
      let alteredRes = toLocaleString(Math.tan(removeSpaces(calc.res)));
      setCalc({
        ...calc,
        sign: "",
        num: 0,
        res: alteredRes,
      });
    } else if(calc.num !== 0) {
      let alteredNum = toLocaleString(Math.tan(removeSpaces(calc.num)));
      setCalc({
        ...calc,
        sign: "",
        num: 0,
        res: alteredNum,
      });
    }
  };

  /*
    Handles the behaviour if the "lg()" button was pressed.
    Checks for previous input and calculates the natural logarithm (base e) of that value.
    TODO: Add functionality if the first input is the lg button.
      Validation needs to be implemented via equal button.
  */
  const lgClickHandler = () => {
    if(calc.res !== 0) {
      let alteredRes = toLocaleString(Math.log(removeSpaces(calc.res)));
      if(alteredRes !== "NaN") {
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredRes,
        });
      } else {
        let positiveRes = (calc.res).substring(1);
        setCalc({
          ...calc,
          sign: "",
          num: calc.num,
          res: positiveRes,
        });
        alteredRes = "-" + toLocaleString(Math.log(removeSpaces(positiveRes)));
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredRes,
        });
      }
    } else if(calc.num !== 0) {
      let alteredNum = toLocaleString(Math.log(removeSpaces(calc.num)));
      if(alteredNum !== "NaN") {
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredNum,
        });
      } else {
        let positiveNum = (calc.num).substring(1);
        setCalc({
          ...calc,
          sign: "",
          num: positiveNum,
          res: 0,
        });
        alteredNum = "-" + toLocaleString(Math.log(removeSpaces(positiveNum)));
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: alteredNum,
        });
      }
    }
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
                    : but === "/" || but === "X" || but === "-" || but === "+" || but === "xʸ"
                    ? signClickHandler
                    : but === "."
                    ? decimalClickHandler
                    : but === "√()"
                    ? rootClickHandler
                    : but === "CE"
                    ? delClickHandler
                    : but === "log()"
                    ? logClickHandler
                    : but === "lg()"
                    ? lgClickHandler
                    : but === "sin"
                    ? sinClickHandler
                    : but === "tan"
                    ? tanClickHandler
                    : but === "cos"
                    ? cosClickHandler
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