const form = document.getElementById('applicationForm');

if (form) {
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const birthDate = document.getElementById('birthDate');
  const password = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const successMessage = document.getElementById('successMessage');

  const fullNameError = document.getElementById('fullNameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const birthDateError = document.getElementById('birthDateError');
  const passwordError = document.getElementById('passwordError');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?[0-9\s()-]{7,20}$/;
  const fullNamePattern = /^[a-zA-Z\s\u00C0-\u017F'.-]+$/;
  const errorInputClasses = ['border-red-600', 'ring-2', 'ring-red-200'];
  const validInputClasses = ['border-green-600', 'ring-2', 'ring-green-200'];

  const removeStateClasses = (input) => {
    input.classList.remove(...errorInputClasses);
    input.classList.remove(...validInputClasses);
  };

  const clearError = (input, errorNode) => {
    removeStateClasses(input);
    input.setAttribute('aria-invalid', 'false');
    errorNode.classList.add('hidden');
    errorNode.textContent = '';
  };

  const setError = (input, errorNode, message) => {
    removeStateClasses(input);
    input.classList.add(...errorInputClasses);
    input.setAttribute('aria-invalid', 'true');
    errorNode.textContent = message;
    errorNode.classList.remove('hidden');
  };

  const setValid = (input, errorNode) => {
    removeStateClasses(input);
    input.classList.add(...validInputClasses);
    input.setAttribute('aria-invalid', 'false');
    errorNode.classList.add('hidden');
    errorNode.textContent = '';
  };

  const calculateAge = (value) => {
    const today = new Date();
    const birth = new Date(value);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }

    return age;
  };

  const getFullNameError = () => {
    const value = fullName.value.trim();

    if (!value) {
      return 'El nombre completo es obligatorio.';
    }

    if (value.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!fullNamePattern.test(value)) {
      return 'El nombre solo puede incluir letras y espacios.';
    }

    return '';
  };

  const getEmailError = () => {
    const value = email.value.trim();

    if (!value) {
      return 'El correo electronico es obligatorio.';
    }

    if (!emailPattern.test(value)) {
      return 'Ingresa un correo electronico valido.';
    }

    return '';
  };

  const getPhoneError = () => {
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, '');

    if (!value) {
      return 'El telefono es obligatorio.';
    }

    if (!phonePattern.test(value) || digits.length < 7) {
      return 'Ingresa un numero de telefono valido (minimo 7 digitos).';
    }

    return '';
  };

  const getBirthDateError = () => {
    if (!birthDate.value) {
      return 'La fecha de nacimiento es obligatoria.';
    }

    const selectedDate = new Date(birthDate.value);
    const today = new Date();

    if (Number.isNaN(selectedDate.getTime())) {
      return 'Selecciona una fecha valida.';
    }

    if (selectedDate > today) {
      return 'La fecha de nacimiento no puede ser futura.';
    }

    if (calculateAge(birthDate.value) < 18) {
      return 'Debes tener al menos 18 anos para registrarte.';
    }

    return '';
  };

  const getPasswordError = () => {
    const value = password.value;

    if (!value) {
      return 'La contrasena es obligatoria.';
    }

    if (value.length < 8) {
      return 'La contrasena debe tener al menos 8 caracteres.';
    }

    if (!/[A-Z]/.test(value)) {
      return 'La contrasena debe incluir al menos una letra mayuscula.';
    }

    if (!/[a-z]/.test(value)) {
      return 'La contrasena debe incluir al menos una letra minuscula.';
    }

    if (!/\d/.test(value)) {
      return 'La contrasena debe incluir al menos un numero.';
    }

    return '';
  };

  const validateField = (input, errorNode, getError) => {
    const error = getError();

    if (error) {
      setError(input, errorNode, error);
      return false;
    }

    setValid(input, errorNode);
    return true;
  };

  const validateAll = () => {
    const isFullNameValid = validateField(fullName, fullNameError, getFullNameError);
    const isEmailValid = validateField(email, emailError, getEmailError);
    const isPhoneValid = validateField(phone, phoneError, getPhoneError);
    const isBirthDateValid = validateField(birthDate, birthDateError, getBirthDateError);
    const isPasswordValid = validateField(password, passwordError, getPasswordError);

    return isFullNameValid && isEmailValid && isPhoneValid && isBirthDateValid && isPasswordValid;
  };

  const setupRealtimeValidation = (input, errorNode, getError) => {
    const runValidation = () => {
      validateField(input, errorNode, getError);
      successMessage.classList.add('hidden');
    };

    input.addEventListener('input', runValidation);
    input.addEventListener('blur', runValidation);
    input.addEventListener('change', runValidation);
  };

  setupRealtimeValidation(fullName, fullNameError, getFullNameError);
  setupRealtimeValidation(email, emailError, getEmailError);
  setupRealtimeValidation(phone, phoneError, getPhoneError);
  setupRealtimeValidation(birthDate, birthDateError, getBirthDateError);
  setupRealtimeValidation(password, passwordError, getPasswordError);

  if (togglePassword && password) {
    togglePassword.addEventListener('click', () => {
      const isHidden = password.type === 'password';
      password.type = isHidden ? 'text' : 'password';
      togglePassword.textContent = isHidden ? 'Ocultar' : 'Mostrar';
      togglePassword.setAttribute('aria-pressed', String(isHidden));
    });
  }

  form.addEventListener('reset', () => {
    successMessage.classList.add('hidden');

    clearError(fullName, fullNameError);
    clearError(email, emailError);
    clearError(phone, phoneError);
    clearError(birthDate, birthDateError);
    clearError(password, passwordError);

    if (togglePassword && password) {
      password.type = 'password';
      togglePassword.textContent = 'Mostrar';
      togglePassword.setAttribute('aria-pressed', 'false');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.classList.add('hidden');

    if (!validateAll()) {
      return;
    }

    successMessage.textContent = 'Formulario enviado correctamente. La validacion fue completada sin errores.';
    successMessage.classList.remove('hidden');
  });
}
