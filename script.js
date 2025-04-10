// Password analysis function
function analyzePassword(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    let strength = 0;
    if (password.length > 8) strength += 25;
    if (hasUppercase && hasLowercase) strength += 25;
    if (hasNumbers) strength += 25;
    if (hasSpecial) strength += 25;

    return {
        strength,
        criteria: {
            length: password.length >= 8,
            complexity: (hasUppercase && hasLowercase && hasNumbers),
            unique: !(/(.)\1{2,}/.test(password)),
            patternFree: !(/123|abc|qwerty/i.test(password))
        },
        hasUppercase,
        hasLowercase,
        hasNumbers,
        hasSpecial
    };
}

const passwordHistory = [];

function addToHistory(password, strength) {
    if (!password) return;
    
    const entry = {
        password: password,
        strength: strength,
        timestamp: new Date().toLocaleString()
    };
    
    passwordHistory.unshift(entry);
    if (passwordHistory.length > 5) passwordHistory.pop();
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.querySelector(".history-list");
    historyList.innerHTML = passwordHistory.map(entry => `
        <div class="history-entry">
            <div>Password: ${'*'.repeat(entry.password.length)}</div>
            <div>Strength: ${entry.strength}%</div>
            <div>Time: ${entry.timestamp}</div>
        </div>
    `).join('');
}

// Event listeners
document.getElementById("password-input").addEventListener("input", (e) => {
    const password = e.target.value;
    if (!password) return;
    
    const analysis = analyzePassword(password);
    
    // Update strength bar
    const strengthBar = document.querySelector(".strength-bar");
    strengthBar.style.width = analysis.strength + "%";
    strengthBar.style.backgroundColor = analysis.strength <= 25 ? "#ff4444" :
                                      analysis.strength <= 50 ? "#ffaa33" :
                                      analysis.strength <= 75 ? "#ffff33" : "#44ff44";

    document.querySelector(".strength-label").textContent = 
        analysis.strength <= 25 ? "Weak" :
        analysis.strength <= 50 ? "Medium" :
        analysis.strength <= 75 ? "Strong" : "Very Strong";

    // Update criteria cards
    const cards = document.querySelectorAll(".criteria-cards .card");
    cards[0].className = `card ${analysis.criteria.length ? 'pass' : 'fail'}`;
    cards[1].className = `card ${analysis.criteria.complexity ? 'pass' : 'warn'}`;
    cards[2].className = `card ${analysis.criteria.unique ? 'pass' : 'fail'}`;
    cards[3].className = `card ${analysis.criteria.patternFree ? 'pass' : 'fail'}`;

    // Update vulnerability bar
    const vulBar = document.querySelector(".vulnerability-bar");
    vulBar.style.width = (100 - analysis.strength) + "%";
    
    // Update detailed analysis
    const detailedSection = document.querySelector(".detailed-analysis-section");
    const weaknesses = [];
    if (password.length < 8) {
        weaknesses.push(`<div class="weakness red">❌ Password is too short (currently ${password.length} characters, minimum 8 needed)</div>`);
    } else if (password.length < 12) {
        weaknesses.push('<div class="weakness yellow">⚠️ Consider making password longer (12+ characters recommended)</div>');
    }

    // Character type analysis
    const missingTypes = [];
    if (!analysis.hasUppercase) missingTypes.push("uppercase letters (A-Z)");
    if (!analysis.hasLowercase) missingTypes.push("lowercase letters (a-z)");
    if (!analysis.hasNumbers) missingTypes.push("numbers (0-9)");
    if (!analysis.hasSpecial) missingTypes.push("special characters (!@#$%^&*)");

    if (missingTypes.length > 0) {
        weaknesses.push(`<div class="weakness yellow">⚠️ Add ${missingTypes.join(", ")}</div>`);
    }

    // Pattern analysis
    if (/(.)\1{2,}/.test(password)) {
        const match = password.match(/(.)\1{2,}/);
        weaknesses.push(`<div class="weakness red">❌ Repeated character found: '${match[1]}' appears multiple times in sequence</div>`);
    }

    if (/123|abc|qwerty/i.test(password)) {
        const patterns = password.match(/(123|abc|qwerty)/i);
        weaknesses.push(`<div class="weakness red">❌ Common pattern detected: '${patterns[0]}'</div>`);
    }

    // Time to crack estimate
    const possibleChars = (analysis.hasLowercase ? 26 : 0) + (analysis.hasUppercase ? 26 : 0) + 
                         (analysis.hasNumbers ? 10 : 0) + (analysis.hasSpecial ? 8 : 0);
    const combinations = Math.pow(possibleChars, password.length);
    let timeEstimate = "instant";
    if (combinations > 1e12) timeEstimate = "years";
    else if (combinations > 1e9) timeEstimate = "months";
    else if (combinations > 1e7) timeEstimate = "days";
    else if (combinations > 1e5) timeEstimate = "hours";
    else if (combinations > 1e3) timeEstimate = "minutes";

    weaknesses.push(`<div class="weakness ${timeEstimate === 'instant' ? 'red' : timeEstimate === 'years' ? 'green' : 'yellow'}">
        🕒 Estimated time to crack: ${timeEstimate}
    </div>`);
    
    const weaknessHTML = weaknesses.length ? weaknesses.join('') : '<div class="weakness green">✅ Your password is strong!</div>';
    detailedSection.innerHTML = `
        <h2>📘 Detailed Analysis</h2>
        ${weaknessHTML}
        <h3>Dictionary Attack Vulnerability</h3>
        <div class="bar-container">
            <div class="vulnerability-bar"></div>
            <span>${analysis.strength <= 25 ? "High" : analysis.strength <= 50 ? "Medium" : "Low"}</span>
        </div>
    `;

    // Add to history
    addToHistory(password, analysis.strength);
});

document.getElementById("toggle-visibility").addEventListener("click", () => {
    const passwordInput = document.getElementById("password-input");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// Password generator configuration
document.getElementById("password-length").addEventListener("input", (e) => {
    document.getElementById("length-value").textContent = e.target.value;
});
