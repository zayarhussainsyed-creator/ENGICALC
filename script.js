let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

// Add values safely
function addValue(value) {

    let current = display.value;

    // Operators
    let operators = ['+', '-', '*', '/'];

    let lastChar = current.slice(-1);

    // Prevent multiple operators
    if (operators.includes(value) && operators.includes(lastChar)) {
        return;
    }

    // Prevent starting with + * /
    if (current === "" && ['+', '*', '/'].includes(value)) {
        return;
    }

    // Prevent multiple decimals in same number
    if (value === '.') {

        let parts = current.split(/[+\-*/()]/);
        let lastPart = parts[parts.length - 1];

        if (lastPart.includes('.')) {
            return;
        }
    }

    display.value += value;
}

// Clear display
function clearDisplay() {
    display.value = "";
}

// Remove last character
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Show / Hide history
function toggleHistory() {
    document.getElementById("historyPanel").classList.toggle("hidden");
}

// Clear history
function clearHistory() {
    historyList.innerHTML = "";
    localStorage.removeItem("calcHistory");
}

// Calculate expression
function calculate() {

    if (display.value.trim() === "") return;

    try {

        let originalExpression = display.value;

        // Remove ending operator
        let expression = display.value.replace(/[+\-*/.]$/, '');

        // Convert scientific functions
        expression = expression.replace(/sin\(/g, "Math.sin(Math.PI/180*");
        expression = expression.replace(/cos\(/g, "Math.cos(Math.PI/180*");
        expression = expression.replace(/tan\(/g, "Math.tan(Math.PI/180*");
        expression = expression.replace(/sqrt\(/g, "Math.sqrt(");

        // Evaluate
        let result = eval(expression);

        // Round decimals
        if (typeof result === "number") {
            result = parseFloat(result.toFixed(10));
        }

        display.value = result;

        saveHistory(originalExpression, result);

    } catch (error) {

        display.value = "Error";

        setTimeout(() => {
            display.value = "";
        }, 1200);
    }
}

// Save history
function saveHistory(expression, result) {

    let item = document.createElement("li");

    item.innerHTML = `${expression} = ${result}`;

    historyList.prepend(item);

    localStorage.setItem("calcHistory", historyList.innerHTML);
}

// Load history when page opens
window.onload = function () {

    historyList.innerHTML =
        localStorage.getItem("calcHistory") || "";
};

// Keyboard support
document.addEventListener("keydown", function (e) {

    // Numbers and operators
    if ((e.key >= "0" && e.key <= "9") ||
        "+-*/().".includes(e.key)) {

        addValue(e.key);
    }

    // Enter key
    else if (e.key === "Enter") {
        calculate();
    }

    // Backspace
    else if (e.key === "Backspace") {
        backspace();
    }

    // Escape key
    else if (e.key === "Escape") {
        clearDisplay();
    }
});
