import { supabaseClient } from "./supabaseClient.js";

function createSignInModal() {
  const existingModal = document.getElementById("signInModal");
  if (existingModal) return existingModal;

  const template = document.createElement("template");
  template.innerHTML = `
    <div id="signInModal" class="modal-overlay" aria-hidden="true">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="popupSignInTitle">
        <button type="button" class="modal-close" id="closeSignInBtn" aria-label="Close">&times;</button>
        <div class="modal-logo-wrapper">
          <img src="./photos/logo.svg" alt="Logo" class="modal-logo">
        </div>
        <h2 class="modal-title" id="popupSignInTitle">Sign in</h2>
        <form id="popupSignInForm" class="modal-form">
          <input type="email" id="popupSignInEmail" class="modal-input" placeholder="Email or username" autocomplete="username" required>
          <input type="password" id="popupSignInPassword" class="modal-input" placeholder="Password" autocomplete="current-password" required>
          <button type="submit" class="modal-btn-dark">Sign in with YOUR email</button>
        </form>
        <p id="popupSignInStatus" class="modal-status" role="status" aria-live="polite"></p>
        <p class="modal-footer-text">New user? <a href="./signUp.html" class="modal-link">Sign up</a></p>
      </div>
    </div>
  `;
  document.body.append(template.content);
  return document.getElementById("signInModal");
}

const signInModal = createSignInModal();
const closeSignInBtn = signInModal.querySelector("#closeSignInBtn");

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const openButton = event.target.closest(".sign_in, [data-open-sign-in]");
  if (!openButton) return;

  event.preventDefault();
  signInModal.classList.add("active");
  signInModal.setAttribute("aria-hidden", "false");
  signInModal.querySelector('input[type="email"]').focus();
});

closeSignInBtn?.addEventListener("click", () => {
  signInModal.classList.remove("active");
  signInModal.setAttribute("aria-hidden", "true");
});

signInModal.addEventListener("click", (event) => {
  if (event.target === signInModal) {
    signInModal.classList.remove("active");
    signInModal.setAttribute("aria-hidden", "true");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && signInModal.classList.contains("active")) {
    signInModal.classList.remove("active");
    signInModal.setAttribute("aria-hidden", "true");
  }
});

// Sign Up Form Handler (if on signUp.html)
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
      successMessage.textContent = "Check your email to confirm your account.";
    }
  });
}

// Sign In Form Handler (in the modal and sign_in.html)
const signInForms = document.querySelectorAll("#signInForm, #popupSignInForm");

signInForms.forEach((signInForm) => {
  const status = signInForm.closest(".modal-card")?.querySelector(".modal-status")
    || document.getElementById("status");
  const submitButton = signInForm.querySelector('button[type="submit"]');
  let signingIn = false;

  signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (signingIn) return;
    signingIn = true;
    submitButton.disabled = true;
    if (status) status.textContent = "Signing in...";

    const email = signInForm.querySelector('input[type="email"]').value.trim();
    const password = signInForm.querySelector('input[type="password"]').value;

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (status) status.textContent = error.message;
        return;
      }
      if (!data.session) {
        if (status) status.textContent = "Sign-in did not create a session. Please try again.";
        return;
      }

      if (status) status.textContent = "Signed in successfully!";
      window.location.href = "dashboard.html";
    } catch {
      if (status) status.textContent = "Couldn't connect to sign in. Please check your connection.";
    } finally {
      signingIn = false;
      submitButton.disabled = false;
    }
  });
});

// The account link replaces guest actions wherever this shared module is loaded.
function initializeAccountNavigation() {
  const nav = document.querySelector("ul.topnav");
  if (!nav || nav.querySelector(".nav-account")) return;
  const guestItems = Array.from(nav.querySelectorAll("li")).filter(item =>
    item.querySelector('.sign_in, #openSignInBtn, a[href*="signUp.html"], a[href*="sign_in.html"]')
  );
  const style = document.createElement("style");
  style.textContent = ".topnav.has-signed-in-account { display: flex !important; align-items: center; flex-wrap: wrap; }\n.topnav.has-signed-in-account li.nav-account { margin-left: auto !important; float: none; }\n.topnav .nav-account[hidden], .topnav .nav-auth-hidden { display: none !important; }\n.topnav li.nav-account { float: right; margin-left: auto; }\n.topnav li.nav-account a.nav-account-link { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 28px; text-decoration: none; color: #173d32; font: 700 16px Arial, sans-serif; min-height: 44px; box-sizing: border-box; }\n.topnav li.nav-account a.nav-account-link:hover { background: rgba(81,201,165,.2); }\n.topnav li.nav-account a.nav-account-link:focus-visible { outline: 3px solid #237c60; outline-offset: 3px; }\n.topnav li.nav-account img.nav-account-avatar { width: 40px !important; height: 40px !important; border-radius: 50%; object-fit: cover; margin: 0 !important; padding: 0 !important; border: 2px solid #51c9a5; flex-shrink: 0; }\n.topnav .nav-account-name { max-width: 180px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }\n@media (max-width: 600px) { .topnav .nav-account-name { max-width: 110px; } .topnav li.nav-account a.nav-account-link { padding: 8px; } }";
  document.head.append(style);
  const accountItem = document.createElement("li");
  accountItem.className = "right_nav nav-account";
  accountItem.hidden = true;
  const link = document.createElement("a");
  link.className = "nav-account-link";
  link.href = new URL("../dashboard.html", import.meta.url).href;
  const avatar = document.createElement("img");
  avatar.className = "nav-account-avatar";
  avatar.alt = "";
  avatar.width = 40;
  avatar.height = 40;
  const name = document.createElement("span");
  name.className = "nav-account-name";
  link.append(avatar, name);
  accountItem.append(link);
  nav.append(accountItem);
  const logoutStyle = document.createElement("style");
  logoutStyle.textContent = "\n#account-logout-dock[hidden] { display: none !important; }\n#account-logout-dock { position: fixed; bottom: max(20px, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); z-index: 900; display: flex; flex-direction: column; align-items: center; gap: 8px; max-width: calc(100vw - 32px); }\n#account-logout-button { border: 1px solid #334c53; border-radius: 24px; padding: 12px 26px; min-height: 44px; background: #16262b; color: white; font: 700 15px Arial, sans-serif; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,.2); }\n#account-logout-button:hover { background: #29454a; }\n#account-logout-button:focus-visible { outline: 3px solid #51c9a5; outline-offset: 3px; }\n#account-logout-button:disabled { opacity: .65; cursor: wait; }\n#account-logout-status:empty { display: none; }\n#account-logout-status { margin: 0; padding: 8px 12px; border-radius: 10px; background: #fff; color: #8a2020; font: 14px Arial, sans-serif; }\nbody.has-logout-button { padding-bottom: 88px; }\n";
  document.head.append(logoutStyle);
  const logoutDock = document.createElement("div");
  logoutDock.id = "account-logout-dock";
  logoutDock.hidden = true;
  const logoutStatus = document.createElement("p");
  logoutStatus.id = "account-logout-status";
  logoutStatus.setAttribute("role", "status");
  const logoutButton = document.createElement("button");
  logoutButton.id = "account-logout-button";
  logoutButton.type = "button";
  logoutButton.textContent = "Log Out";
  logoutDock.append(logoutStatus, logoutButton);
  document.body.append(logoutDock);
  logoutButton.addEventListener("click", async () => {
    if (logoutButton.disabled) return;
    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";
    logoutStatus.textContent = "";
    try {
      const { error } = await supabaseClient.auth.signOut({ scope: "local" });
      if (error) {
        // Local logout may succeed even if server revocation is unavailable.
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        if (sessionError || session) throw error;
      }
      window.location.replace(new URL("../index.html", import.meta.url).href);
    } catch (error) {
      logoutStatus.textContent = "Couldn't log out. " + error.message;
      logoutButton.disabled = false;
      logoutButton.textContent = "Log Out";
    }
  });

  let requestVersion = 0;
  function showGuest() {
    logoutDock.hidden = true;
    document.body.classList.remove("has-logout-button");
    nav.classList.remove("has-signed-in-account");
    accountItem.hidden = true;
    name.textContent = "";
    guestItems.forEach(item => item.classList.remove("nav-auth-hidden"));
  }
  function showAccount(user, profile) {
    const isDashboard = document.body.classList.contains("dashboard-page");
    logoutDock.hidden = !isDashboard;
    document.body.classList.toggle("has-logout-button", isDashboard);
    nav.classList.add("has-signed-in-account");
    const username = profile?.username || user.user_metadata?.username || "My Account";
    const avatarId = [1, 2, 3].includes(Number(profile?.avatar_id)) ? Number(profile.avatar_id) : 1;
    name.textContent = username;
    link.setAttribute("aria-label", "Open dashboard for " + username);
    link.title = "Open your dashboard";
    avatar.src = new URL("../photos/avatar" + avatarId + ".jpg", import.meta.url).href;
    guestItems.forEach(item => item.classList.add("nav-auth-hidden"));
    accountItem.hidden = false;
  }
  async function refreshAccount() {
    const version = ++requestVersion;
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (version !== requestVersion) return;
      if (error || !user) { showGuest(); return; }
      showAccount(user, null);
      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles").select("username, avatar_id").eq("id", user.id).maybeSingle();
      if (version !== requestVersion) return;
      if (profileError) console.warn("Unable to load navigation profile:", profileError.message);
      showAccount(user, profileError ? null : profile);
    } catch (error) {
      if (version === requestVersion) showGuest();
      console.warn("Unable to load account navigation:", error.message);
    }
  }
  supabaseClient.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      ++requestVersion;
      showGuest();
    } else if (["INITIAL_SESSION", "SIGNED_IN", "USER_UPDATED"].includes(event)) {
      window.setTimeout(refreshAccount, 0);
    }
  });
  window.addEventListener("focus", refreshAccount);
  document.addEventListener("profile-updated", refreshAccount);
  const statusObserver = new MutationObserver(records => {
    if (records.some(record => /saved/i.test(record.target.textContent))) refreshAccount();
  });
  ["profile-status", "avatar-status"].forEach(id => {
    const status = document.getElementById(id);
    if (status) statusObserver.observe(status, { childList: true, subtree: true, characterData: true });
  });
  refreshAccount();
}

initializeAccountNavigation();

