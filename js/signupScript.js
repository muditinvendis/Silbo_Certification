document.getElementById('signupForm').addEventListener('submit', async function (event) {
  event.preventDefault();
    // Disable the submit button to prevent multiple submissions
  document.querySelector('button[type="submit"]').disabled = true;
  var isValid = validateForm();
  if (isValid) {
    showLoadingScreen();
    // var username = document.getElementById('indentifier').value.trim();
    // var phone_number = document.getElementById('indentifier').value.trim();
    // var email = document.getElementById('indentifier').value.trim();
    var username = document.getElementById('indentifier').value.trim();
    var password = document.getElementById('password').value;
    var webTerms = document.getElementById('termsOfService').checked;
    var dataProcessing = document.getElementById('dataProcessingAgreement').checked;
    var subscription = document.getElementById('newsletterSubscription').checked;

    try {
      const response = await fetch('http://192.168.1.107:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username:username,
          password: password,
          web_terms: webTerms,
          dataprocessing: dataProcessing,
          subscription: subscription,
        }),
      });

      if (response.ok) {
        showResponseMessage('Sign up successful!');
      } else {
        const errorMessage = await response.text();
        showResponseMessage(`Sign up failed. ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
      showResponseMessage('An error occurred. Please try again later.');
    }
    finally {
      hideLoadingScreen();
      document.querySelector('button[type="submit"]').disabled = false;
  }
  }
});

function validateForm() {
  var indentifier = document.getElementById('indentifier').value.trim();
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;
  var nameEmailPhoneError = document.getElementById('nameEmailPhoneError');
  var passwordError = document.getElementById('passwordError');
  var confirmPasswordError = document.getElementById('confirmPasswordError');
  var isValid = true;
  var pattern = /^[A-Za-z]+(?:\s[A-Za-z]+)*$|^[\w-]+(\.[\w-]+)*@[A-Za-z\d-]+(\.[A-Za-z\d-]{2,})+|^\d{10}$/;
  nameEmailPhoneError.textContent = '';
  passwordError.textContent = '';
  confirmPasswordError.textContent = '';
  if (!indentifier.match(pattern)) {
    nameEmailPhoneError.textContent = 'Please enter a valid name, email, or phone number.';
    isValid = false;
  }
  if (password.length < 8) {
    passwordError.textContent = 'Password must be at least 8 characters long.';
    isValid = false;
  }
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Passwords do not match.';
    isValid = false;
  }
  return isValid;
}

function togglePasswordVisibility(inputFieldId) {
  var passwordInput = document.getElementById(inputFieldId);
  var toggleIcon = document.getElementById('eyeIcon');
  var confirmToggleIcon = document.getElementById('confirmEyeIcon');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

function toggleConfirmPasswordVisibility(inputFieldId) {
  var confirmPasswordInput = document.getElementById(inputFieldId);
  var toggleIcon = document.getElementById('confirmEyeIcon');
  if (confirmPasswordInput.type === 'password') {
    confirmPasswordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    confirmPasswordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

function showResponseMessage(message) {
  var successMessage = document.getElementById('successMessage');
  if (successMessage.textContent.trim() === '') {
    successMessage.textContent = message;
  }
}
