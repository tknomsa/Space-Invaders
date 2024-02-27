// Validating user's login credentials
function validateLogin() {
	let enteredUsername = document.getElementById("loginUsername").value;
	let enteredPassword = document.getElementById("loginPassword").value;

	// Obtaining the stored user data from localStorage
	let storedUserData = localStorage.getItem(enteredUsername);

	// Checking if the user exists in localStorage
	if (storedUserData) {
		let user = JSON.parse(storedUserData);

		// Checking if password matches the stored password
		if (user.password === enteredPassword) {
			// Clearing previous error messages
			feedbackPara.innerHTML = "";
			// Storing the logged-in user in session storage
			sessionStorage.setItem('loggedInUser', enteredUsername);
			window.location.href = 'game.html'
		} else {
			feedbackPara.innerHTML = "Incorrect password.";
		}
	} else {
		feedbackPara.innerHTML = "User not found. Please check your username.";
	}

	return false;
}

let feedbackPara = document.getElementById("feedback");

// Toggling the display of the user dropdown menu
function toggleUserDropdown() {
	var userDropdown = document.getElementById("userDropdown");
	userDropdown.classList.toggle("show");
}

// Closing the user dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.closest('.user-icon')) {
		var userDropdown = document.getElementById("userDropdown");
		if (userDropdown.classList.contains('show')) {
			userDropdown.classList.remove('show');
		}
	}
}

// Logging out user
function logout() {
	// Clearing the logged-in user from session storage
	sessionStorage.loggedInUser = undefined;
	window.location.href = "login.html";
}