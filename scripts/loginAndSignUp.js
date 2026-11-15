
import { supabaseClient } from "./supabaseClient.js";

// Sign Up

const signUpForm = document.getElementById("signUpForm");

if (signUpForm) {
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const dashboardLink = document.getElementById("dashboard-link");

    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        errorMessage.textContent = "";
        successMessage.textContent = "";
        dashboardLink.style.display = "none";

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("ConfirmPassword").value;

        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match!";
            return;
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        });

        if (error) {
            errorMessage.textContent = error.message;
            return;
        }

        if (data.session) {
            successMessage.textContent = "Account created successfully!";
            dashboardLink.style.display = "block";
        } else {
            successMessage.textContent =
                "Check your email to confirm your account.";
        }
    });
}

// Sign In

const signInForm = document.getElementById("signInForm");

if (signInForm) {
    const status = document.getElementById("status");
    const submitButton = signInForm.querySelector('button[type="submit"]');
    let signingIn = false;

    signInForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (signingIn) return;
        signingIn = true;
        submitButton.disabled = true;
        status.textContent = "Signing in...";

        const email = document.getElementById("signInEmail").value.trim();
        const password = document.getElementById("signInPassword").value;

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                status.textContent = error.message;
                return;
            }
            if (!data.session) {
                status.textContent = "Sign-in did not create a session. Please try again.";
                return;
            }

            status.textContent = "Signed in successfully!";
            window.location.href = "dashboard.html";
        } catch {
            status.textContent = "Couldn't connect to sign in. Please check your connection and try again.";
        } finally {
            signingIn = false;
            submitButton.disabled = false;
        }
    });
}
