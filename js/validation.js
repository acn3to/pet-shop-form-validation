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
    valueMissing: "The name field must be filed!",
  },
  email: {
    valueMissing: "The email field must be filed!",
    typeMismatch: "This is not a valid email",
  },
  password: {
    valueMissing: "The password field must be filed!",
    patternMismatch:
      "The password must contain between 6 and 12 characters and at least one lower-case character, one upper-case character, one digit and no special characters.",
  },
  birthDate: {
    valueMissing: "The birth date field must be filed!",
    customError: "You must be 18 years old!",
  },
  cpf: {
    valueMissing: "The CPF field must be filed!",
    customError: "The CPF is invalid!",
  },
  cep: {
    valueMissing: "The CEP field must be filed!",
    patternMismatch: "This is not a valid CEP.",
    customError: "CEP not found.",
  },
  address: {
    valueMissing: "The address field must be filed!",
  },
  city: {
    valueMissing: "The city field must be filed!",
  },
  state: {
    valueMissing: "The state field must be filed!",
  },
  price: {
    valueMissing: "The price field must be filed!",
  },
};

const validators = {
  birthDate: (input) => validateBirthDate(input),
  cpf: (input) => validateCpf(input),
  cep: (input) => recoverCep(input),
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

function validateCpf(input) {
  const formattedCpf = input.value.replace(/\D/g, "");
  let message = "";

  if (!checkRepeatedCpf(formattedCpf) || !checkCpfStructure(formattedCpf)) {
    message = "The CPF is invalid!";
  }

  input.setCustomValidity(message);
}

function checkRepeatedCpf(cpf) {
  const repeatedValues = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];
  let validCpf = true;

  repeatedValues.forEach((value) => {
    if (value === cpf) {
      validCpf = false;
    }
  });

  return validCpf;
}

function checkTesterDigit(cpf, multiplier) {
  if (multiplier >= 12) {
    return true;
  }

  let initialMultiplier = multiplier;
  let sum = 0;
  const cpfWithoutDigits = cpf.substring(0, multiplier - 1).split("");
  const testerDigit = cpf.charAt(multiplier - 1);

  for (let counter = 0; initialMultiplier > 1; initialMultiplier--) {
    sum = sum + cpfWithoutDigits[counter] * initialMultiplier;
    counter++;
  }

  if (testerDigit == confirmDigit(sum)) {
    return checkTesterDigit(cpf, multiplier + 1);
  }

  return false;
}

function checkCpfStructure(cpf) {
  const multiplier = 10;

  return checkTesterDigit(cpf, multiplier);
}

function confirmDigit(sum) {
  return 11 - (sum % 11);
}

function recoverCep(input) {
  const cep = input.value.replace(/\D/g, "");
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const options = {
    method: "GET",
    mode: "cors",
    headers: {
      "content-type": "application/json;charset=utf-8",
    },
  };

  if (!input.validity.patternMismatch && !input.validity.valueMissing) {
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.erro) {
          input.setCustomValidity("CEP not found.");
          return;
        }
        input.setCustomValidity("");
        fillAddressWithCep(data);
        return;
      });
  }
}

function fillAddressWithCep(data) {
  const address = document.querySelector('[data-type="address"]');
  const city = document.querySelector('[data-type="city"]');
  const state = document.querySelector('[data-type="state"]');

  address.value = data.logradouro;
  city.value = data.localidade;
  state.value = data.uf;
}
