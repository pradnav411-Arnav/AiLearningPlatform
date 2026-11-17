function generatePrompt() {
    const role = document.getElementById("roleInput").value.trim();
    const prompt = document.getElementById("promptInput").value.trim();

    if (!role || !prompt) {
        alert("Please fill in both fields.");
        return;
    }

    const finalPrompt =
`Act as a ${role}.

Use the knowledge, experience, and communication style of a professional ${role} to answer the following request:

${prompt}`;

    document.getElementById("outputPrompt").value = finalPrompt;
}
