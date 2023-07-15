let num1 = 0;
let num2 = 0;
let operator_key = "";
let last_operator = "";
let operator_pressed = false;

function operate(num1, num2, operator)
{
    let res = 0;
    if (operator === "add") res = num1 + num2;
    if (operator === "subtract") res = num1 - num2;
    if (operator === "divide") res = num1 / num2;
    if (operator === "multiply") res = num1 * num2;

    return res;
}

function addNumeric(e, display) 
{
    const number = e.target.innerText;
    const displayPrimary = display.querySelector(".primary-text");
    if (!displayPrimary.textContent) {
        if (number === ".") return;
        displayPrimary.textContent = number;
    }
    else {
        if (number === "." && displayPrimary.textContent.includes(".")) return;
        displayPrimary.textContent += number;
    }
}

function addOperator(e, display)
{
    const operator = e.target.innerText;
    const displayPrimary = display.querySelector(".primary-text");
    const displaySecondary = display.querySelector(".secondary-text");

    // Add number
    if (!operator_pressed) {
        if (!displaySecondary.textContent) { // No prior calculated result
            // Parse display content into num1 
            if (displayPrimary.textContent.includes(".")) num1 = parseFloat(displayPrimary.textContent);
            else num1 = parseInt(displayPrimary.textContent);

            // Update display
            displaySecondary.textContent = `${num1} ${operator}`;
            operator_key = e.target.dataset.action;
            operator_pressed = true;
        }
        else {
            // Update display only as previous result already num1
            displaySecondary.textContent += ` ${operator}`;
            operator_key = e.target.dataset.action;
            operator_pressed = true;
        }
    }
    else {
        // Do previous operation first before updating operator
        if (displayPrimary.textContent.includes(".")) num2 = parseFloat(displayPrimary.textContent);
        else num2 = parseInt(displayPrimary.textContent);
        last_operator = operator_key;
        operator_key = e.target.dataset.action;
        let res = operate(num1, num2, last_operator);

        // Refresh display
        displaySecondary.textContent = `${res} ${operator}`;

        // Reallocate numbers
        num1 = res;
    }
    displayPrimary.textContent = "";
}

function clearDisplay(e, display)
{
    const displayPrimary = display.querySelector(".primary-text");
    const displaySecondary = display.querySelector(".secondary-text");
    if (e.target.dataset.action == "clear") { // Full reset
        num1 = 0;
        num2 = 0;
        operator_key = "";
        last_operator = "";
        operator_pressed = false;
        displayPrimary.textContent = "";
        displaySecondary.textContent = "";
    }
    else if (e.target.dataset.action == "delete") { // Clear only recent input
        if (displayPrimary.textContent) {
            displayPrimary.textContent = "";
        }
        else {
            if (operator_pressed) {
                displaySecondary.textContent = `${num1}`;
                operator_key = "";
                operator_pressed = false;
            }
        }
    }
}

function getResult(display)
{
    const displayPrimary = display.querySelector(".primary-text");
    const displaySecondary = display.querySelector(".secondary-text");
    
    if (!operator_pressed) return;
    if (displayPrimary.textContent.includes(".")) num2 = parseFloat(displayPrimary.textContent);
    else num2 = parseInt(displayPrimary.textContent);
    let res = operate(num1, num2, operator_key);

    // Update display
    displaySecondary.textContent = res;
    displayPrimary.textContent = "";

    // Reallocate number
    num1 = res;
    operator_key = "";
    last_operator = "";
    operator_pressed = false;
}

const keys = document.querySelector(".sub-body");
const display = document.querySelector(".display");

keys.addEventListener('click', e => {
    if (e.target.matches("button")) {
        if (e.target.dataset.action) {
            if (e.target.dataset.action == "add" || e.target.dataset.action == "subtract" ||
                e.target.dataset.action == "divide" || e.target.dataset.action == "multiply") {
                    addOperator(e, display);
            }
            else if (e.target.dataset.action == "decimal") {
                addNumeric(e, display);
            }
            else if (e.target.dataset.action == "clear" || e.target.dataset.action == "delete") {
                clearDisplay(e, display);
            }
            else if (e.target.dataset.action == "calculate") {
                getResult(display);
            }
        }
        else {
            addNumeric(e, display);
        }
    }
});