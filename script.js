document.getElementById("toggle-visibility").addEventListener("click", () => {
    const passwordInput = document.getElementById("password-input");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});

document.getElementById("generate-btn").addEventListener("click", () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 16; i++) {
        const randIndex = Math.floor(Math.random() * charset.length);
        password += charset[randIndex];
    }
    document.getElementById("password-input").value = password;
});
