let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

// Add values
function addValue(value) {
    display.value += value;
}

// Clear display
function clearDisplay() {
    display.value = "";
}

// Backspace
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

// Main calculator
function calculate() {

    if (display.value.trim() === "") return;

    try {

        let originalExpression = display.value;
        let expression = display.value;

        // Replace scientific functions with JavaScript Math functions
        expression = expression.replace(/sin\(/g, "Math.sin(Math.PI/180*");
        expression = expression.replace(/cos\(/g, "Math.cos(Math.PI/180*");
        expression = expression.replace(/tan\(/g, "Math.tan(Math.PI/180*");
        expression = expression.replace(/sqrt\(/g, "Math.sqrt(");

        // Evaluate expression
        let result = eval(expression);

        // Round long decimals
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

// Load history after refresh
window.onload = function () {
    historyList.innerHTML = localStorage.getItem("calcHistory") || "";
};

// Keyboard support
document.addEventListener("keydown", function (e) {

    if ((e.key >= "0" && e.key <= "9") || "+-*/().".includes(e.key)) {
        addValue(e.key);
    }

    else if (e.key === "Enter") {
        calculate();
    }

    else if (e.key === "Backspace") {
        backspace();
    }

    else if (e.key === "Escape") {
        clearDisplay();
    }
});