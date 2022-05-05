export function validate(input) {
  const inputType = input.dataset.type;

  if (validators[inputType]) {
    validators[inputType](input);
  }

  if (input.validity.valid) {
    input.parentElement.classList.remove("input-container--invalid");
    input.parentElement.querySelector(".input-message-error").innerHTML = "";
  } else {
    input.parentElement.classList.add("input-container--invalid");
    input.parentElement.querySelector(".input-message-error").innerHTML =
      showErrorMessage(inputType, input);
  }
}

const errorTypes = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "customError",
];

const errorMessages = {
  name: {
    valueMissing: "The name filed must be filed!",
  },
  email: {
    valueMissing: "The email filed must be filed!",
    typeMismatch: "This is not a valid email",
  },
  password: {
    valueMissing: "The password filed must be filed!",
    patternMismatch:
      "The password must contain between 6 and 12 characters and at least one lower-case character, one upper-case character, one digit and no special characters.",
  },
  birthDate: {
    valueMissing: "The birth date must be filed filed!",
    customError: "You must be 18 years old!",
  },
};

const validators = {
  birthDate: (input) => validateBirthDate(input),
};

function showErrorMessage(inputType, input) {
  let message = "";
  errorTypes.forEach((error) => {
    if (input.validity[error]) {
      message = errorMessages[inputType][error];
    }
  });
  return message;
}

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
