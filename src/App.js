import './App.css';
// When export statement is included at the start, we need the curly braces for importing that file.
import { CalculatorFrame } from "./components/CalculatorFrame.js";
import { Screen } from "./components/CalculatorScreen.js";
import { ButtonBox } from "./components/ButtonBox.js";
import { CalculatorButton } from "./components/CalculatorButton.js";
import React from 'react';

// Array representing all values for the buttons.
const buttonValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="]
];

export const App = () => {
  return (
    <CalculatorFrame>
      <Screen value="0"></Screen>
      <ButtonBox>
        {
          buttonValues.flat().map((but, i) => {
            return (
              <CalculatorButton
                key={i}
                className={but === "=" ? "equals" : "but"}
                value={but}
                onClick={() => {
                  console.log(`${but} was pressed!`);
                }}
              ></CalculatorButton>
            );
          })
        }
      </ButtonBox>
    </CalculatorFrame>
  );
};

