(() => {

const toggle = document.getElementById("chat-toggle");
const close = document.getElementById("chat-close");
const box = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");

// Theses are the only HTML files that can be linked in Chatty's answers. This stops any malicious HTML or scripts from being injected into the page.
const isPageFile = (href) => {
  if (typeof href !== "string") return false;
  try {
    const url = new URL(href, location.href);
    return url.origin === location.origin && url.pathname.endsWith(".html");
  } catch {
    return false; // malformed URLs like "http://[" throw
  }
};

function setOpen(open) {
  box.hidden = !open;
  if (open) input.focus();
  else toggle.focus();
}

toggle.addEventListener("click", () => setOpen(box.hidden));
close.addEventListener("click", () => setOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !box.hidden) setOpen(false);
});

// Cloudflare sends structured formatting; this only creates safe browser nodes.
function renderParts(parent, parts, allowLinks = true) {
  for (const part of parts) {
    if (!part || typeof part !== "object") continue;
    if (part.type === "link" && Array.isArray(part.children)) {
      // Only relative HTML filenames are accepted, never scripts or remote URLs.
      if (allowLinks && isPageFile(part.href)) {
        const link = document.createElement("a");
        link.href = part.href;
        renderParts(link, part.children, false);
        parent.appendChild(link);
      } else {
        renderParts(parent, part.children, false);
      }
    } else if (typeof part.text === "string") {
      if (part.type === "bold") {
        const strong = document.createElement("strong");
        strong.textContent = part.text;
        parent.appendChild(strong);
      } else {
        parent.appendChild(document.createTextNode(part.text));
      }
    }
  }
}

function addMessage(text, className, parts = null) {
  const p = document.createElement("p");
  p.className = className;
  if (Array.isArray(parts) && parts.length) renderParts(p, parts);
  else p.textContent = text;
  messages.appendChild(p);
  messages.scrollTop = messages.scrollHeight;
  return p;
}

let isSending = false;

form.onsubmit = async (event) => {
  event.preventDefault();

  const question = input.value.trim();
  if (!question || isSending) return;

  isSending = true;
  const sendButton = form.querySelector('button[type="submit"]');
  sendButton.disabled = true;

  addMessage(question, "user-message");
  input.value = "";

  const loading = addMessage("Chatty is thinking…", "bot-message");

  try {
    const response = await fetch("https://website-chatbot.04justo10.workers.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(30000) // 30 seconds
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Chatbot error");
    }
    if (typeof data.answer !== "string" || !data.answer.trim()) {
      throw new Error("Chatty couldn't answer that question. Please try again.");
    }

    loading.remove();
    addMessage(data.answer, "bot-message", data.parts);
  } catch (error) {
    loading.remove();
    const message = error.name === "TimeoutError"
      ? "Chatty took too long to respond. Please try again."
      : error instanceof TypeError || error instanceof SyntaxError
        ? "Couldn't reach Chatty. Please try again in a moment."
        : error.message || "Something went wrong. Please try again.";
    addMessage(message, "bot-message");
    // Keep the question available to retry without overwriting a new draft.
    if (!input.value) input.value = question;
  } finally {
    isSending = false;
    sendButton.disabled = false;
  }
};

})();
