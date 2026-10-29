// Sign up function
const signUpForm = document.getElementById('signUpForm');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const dashboardLink = document.getElementById('dashboard-link');

signUpForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const { data, error } = await window.supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  });

  if (error) {
    console.error('Error signing up:', error);
    errorMessage.textContent = error.message;
  } else {
    console.log('User signed up:', data);
    successMessage.textContent = 'User signed up successfully!';
    dashboardLink.style.display = 'block';
  }
});