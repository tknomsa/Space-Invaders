// Getting the feedbackPara without waiting for "DOMContentLoaded"
let feedbackPara = document.getElementById("feedback");

// Defining feedbackPara
if (feedbackPara) {
   // Checking if username is already taken
   function isUsernameTaken(username) {
      let storedUserData = localStorage.getItem(username);
      return storedUserData !== null;
   }

   // Checking if username is a regular expression
   function isValidUsername(username) {
      return /^[a-zA-Z0-9]+$/.test(username);
   }

   //  Storing user data in localStorage
   function storeUserData() {
      let newUserData = {
         username: document.getElementById("username").value,
         email: document.getElementById("email").value,
         age: document.getElementById("age").value,
         password: document.getElementById("password").value,
         creationDate: new Date().toLocaleString(),
         highScore: 0

      };

      let enteredUsername = document.getElementById("username").value;

      // Checking if the username is valid
      if (!isValidUsername(enteredUsername)) {
         feedbackPara.innerHTML = "Username can only contain letters and numbers.";
         return;
      }

      // Checking if the username is already taken
      if (isUsernameTaken(enteredUsername)) {
         feedbackPara.innerHTML = "Username is already taken.";
         return;
      }

      localStorage.setItem(enteredUsername, JSON.stringify(newUserData));

      // Storing the logged-in user in sessionStorage
      sessionStorage.setItem('loggedInUser', enteredUsername);

      // Clearing any previous error message
      feedbackPara.innerHTML = "";
      redirectToGamePage();
   }

   // Checking if age meets sign-up requiremeent
   function checkAge(age) {
      if (age < 12) {
         feedbackPara.innerHTML = "You must be at least 12 years old to sign up.";
         return false;
      }

      return true;
   }

   function checkPassword(password) {
      let isValid = true;

      if (!/(?=.*[a-z])/.test(password)) {
         feedbackPara.innerHTML = "Your password must contain at least one lowercase letter.";
         isValid = false;
      }

      if (!/(?=.*[A-Z])/.test(password)) {
         feedbackPara.innerHTML = "Your password must contain at least one uppercase letter.";
         isValid = false;
      }

      if (!/(?=.*\d)/.test(password)) {
         feedbackPara.innerHTML = "Your password must contain at least one number.";
         isValid = false;
      }

      if (password.length < 6) {
         feedbackPara.innerHTML = "Your password must be at least 6 characters long.";
         isValid = false;
      }

      return isValid;
   }

   // Checking if passwords match
   function checkPasswordMatch(password, confirmPassword) {
      if (password !== confirmPassword) {
         feedbackPara.innerHTML = "Passwords do not match.";
         return false;
      }

      return true;
   }

   // Handling form validation and submission
   function checkForm(formType) {
      let age = document.getElementById("age").value;
      let password = document.getElementById("password").value;
      let confirmPassword = document.getElementById("confirmPassword").value;

      if (formType === 'signup') {
         if (checkAge(age) && checkPassword(password) && checkPasswordMatch(password, confirmPassword)) {
            storeUserData();
         }
      }

      return false;
   }

   function redirectToGamePage() {
      window.location.href = "game.html";
   }
}