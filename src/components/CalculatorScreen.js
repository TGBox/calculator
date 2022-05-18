import { Textfit } from "react-textfit";
import "./CalculatorScreen.css";

export const Screen = ({ value }) => {

  return (
    <Textfit className="screen" mode="single" max={70}>
      {value}
    </Textfit>
  );

};