
const boxes = document.querySelectorAll(".preview-box");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");

let lastFocusedElement;

function openPopup(box) {
  lastFocusedElement = document.activeElement;
  popupTitle.textContent = box.dataset.title;
  popupDescription.textContent = box.dataset.description;
  popup.classList.add("show");
  closePopup.focus();
}

function hidePopup() {
  popup.classList.remove("show");
  lastFocusedElement?.focus();
}

// Open popup on click
boxes.forEach(box => {
  box.addEventListener("click", () => openPopup(box));
});

// Close with X
closePopup.addEventListener("click", hidePopup);

// Close when clicking outside
popup.addEventListener("click", event => {
  if (event.target === popup) hidePopup();
});

// Close with Escape key
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && popup.classList.contains("show")) {
    hidePopup();
  }

  // Keep keyboard focus inside the popup
  if (event.key === "Tab" && popup.classList.contains("show")) {
    event.preventDefault();
    closePopup.focus();
  }
});
