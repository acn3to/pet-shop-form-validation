import { validate } from "./validation.js";

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  if (input.dataset.type === "price") {
    SimpleMaskMoney.setMask(input, {
      prefix: "$",
      fixed: true,
      fractionDigits: 2,
      decimalSeparator: ".",
      thousandsSeparator: ",",
      cursor: "end",
    });
  }
  input.addEventListener("blur", (event) => {
    validate(event.target);
  });
});
