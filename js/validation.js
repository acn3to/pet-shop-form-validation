export function validate(input) {
  const inputType = input.dataset.type;

  if (validators[inputType]) {
    validators[inputType](input);
  }
}

const validators = {
  birthDate: (input) => validateBirthDate(input),
};

function validateBirthDate(input) {
  const receivedDate = new Date(input.value);
  let message = "";

  if (!overAge(receivedDate)) {
    message = "You must be 18 years old!";
  }

  input.setCustomValidity(message);
}

function overAge(date) {
  const actualDate = new Date();
  const datePlus18 = new Date(
    date.getUTCFullYear() + 18,
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return datePlus18 <= actualDate;
}
