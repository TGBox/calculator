import "./CalculatorButton.css";

export const CalculatorButton = ({ className, value, onClick }) => {

  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );

};