/**
 * Validates if the input value is a valid number
 * @param {string} value - The value to validate
 * @param {HTMLElement} errorElement - The element to display error messages
 * @returns {boolean} True if valid, false otherwise
 */
export function validateNumberInput(value, errorElement) {
  if (value === "") {
    if (errorElement) errorElement.textContent = "";
    return true;
  }

  if (isNaN(parseFloat(value))) {
    if (errorElement) errorElement.textContent = "Please enter a valid number";
    return false;
  }

  if (errorElement) errorElement.textContent = "";
  return true;
}

/**
 * Checks if the conversion form is valid
 * @param {string} value - The input value
 * @param {string} fromUnit - The source unit
 * @param {string} toUnit - The target unit
 * @returns {boolean} True if the form is valid
 */
export function isFormValid(value, fromUnit, toUnit) {
  return (
    value !== "" &&
    !isNaN(parseFloat(value)) &&
    fromUnit &&
    toUnit &&
    fromUnit !== toUnit
  );
}
