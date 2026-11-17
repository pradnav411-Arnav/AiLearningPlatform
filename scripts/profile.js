// import { supabaseClient as db } from "./supabaseClient.js";

// const profileForm = document.getElementById("profile-form");
// const avatarForm = document.getElementById("avatar-form");
// const usernameInput = document.getElementById("profile-username");
// const emailInput = document.getElementById("profile-email");
// const avatarPreview = document.getElementById("current-avatar");
// const statusText = document.getElementById("profile-status");
// const avatarStatus = document.getElementById("avatar-status");
// const saveButton = document.getElementById("save-profile");
// const avatarButton = document.getElementById("save-avatar");
// const welcomeName = document.getElementById("username");

// const avatarPaths = {
//   1: "./photos/avatar1.jpg",
//   2: "./photos/avatar2.jpg",
//   3: "./photos/avatar3.jpg"
// };
// let currentUserId = null;
// let profileReady = false;
// saveButton.disabled = true;
// avatarButton.disabled = true;

// async function loadProfile() {
//   try {
//     const { data: { user }, error: authError } = await db.auth.getUser();
//     if (authError || !user) {
//       window.location.replace("./sign_in.html");
//       return;
//     }
//     currentUserId = user.id;
//     emailInput.value = user.email ?? "";
//     let { data: profile, error } = await db
//       .from("profiles")
//       .select("username, avatar_id")
//       .eq("id", currentUserId)
//       .maybeSingle();
//     if (error) throw error;

//     if (!profile) {
//       const defaultUsername = user.user_metadata?.username ||
//         "player_" + user.id.replace(/-/g, "").slice(0, 16);
//       const result = await db.from("profiles").insert({
//         id: currentUserId,
//         username: defaultUsername,
//         avatar_id: 1
//       }).select("username, avatar_id").single();
//       if (result.error) throw result.error;
//       profile = result.data;
//     }

//     usernameInput.value = profile.username ?? "";
//     welcomeName.textContent = profile.username || user.user_metadata?.username || user.email;
//     const avatarId = Object.hasOwn(avatarPaths, profile.avatar_id) ? profile.avatar_id : 1;
//     document.querySelector('input[name="avatar"][value="' + avatarId + '"]').checked = true;
//     avatarPreview.src = avatarPaths[avatarId];
//     profileReady = true;
//     saveButton.disabled = false;
//     avatarButton.disabled = false;
//   } catch (error) {
//     statusText.textContent = "Unable to load profile: " + error.message;
//     avatarStatus.textContent = "Load your profile before saving an avatar.";
//   }
// }

// document.querySelectorAll('input[name="avatar"]').forEach(input => {
//   input.addEventListener("change", () => {
//     avatarPreview.src = avatarPaths[Number(input.value)];
//     avatarStatus.textContent = "Preview only. Confirm to save your avatar.";
//   });
// });

// // Each form sends only its own field to the database.
// async function saveField(changes, button, status, successMessage) {
//   if (!profileReady) return false;
//   button.disabled = true;
//   status.textContent = "Saving...";
//   try {
//     const { error } = await db.from("profiles")
//       .update(changes).eq("id", currentUserId).select("id").single();
//     if (error) throw error;
//     status.textContent = successMessage;
//     return true;
//   } catch (error) {
//     status.textContent = error.code === "23505"
//       ? "Username is already taken."
//       : "Unable to save: " + error.message;
//     return false;
//   } finally {
//     button.disabled = false;
//   }
// }

// profileForm.addEventListener("submit", async event => {
//   event.preventDefault();
//   const username = usernameInput.value.trim();
//   if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
//     statusText.textContent = "Username must be 3-24 letters, numbers, or underscores.";
//     return;
//   }
//   const saved = await saveField({ username }, saveButton, statusText, "Username saved!");
//   if (saved) {
//     usernameInput.value = username;
//     welcomeName.textContent = username;
//   }
// });

// avatarForm.addEventListener("submit", async event => {
//   event.preventDefault();
//   const selected = avatarForm.querySelector('input[name="avatar"]:checked');
//   const avatarId = Number(selected?.value);
//   if (!Object.hasOwn(avatarPaths, avatarId)) {
//     avatarStatus.textContent = "Choose an avatar first.";
//     return;

//   }
//   await saveField({ avatar_id: avatarId }, avatarButton, avatarStatus, "Avatar saved!");
// });

// loadProfile();

//   }
//   await saveField({ avatar_id: avatarId }, avatarButton, avatarStatus, "Avatar saved!");
// });

// loadProfile();
//     return;
//   }

//   statusText.textContent = "Profile saved successfully!";
// });

// // Initialize the profile
// loadProfile();
// t>