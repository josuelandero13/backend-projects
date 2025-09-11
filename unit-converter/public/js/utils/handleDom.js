// Cache DOM elements
const elements = {
  valueInput: document.getElementById("value-input"),
  fromUnit: document.getElementById("from-unit"),
  toUnit: document.getElementById("to-unit"),
  convertBtn: document.getElementById("convert-btn"),
  resetBtn: document.getElementById("reset-btn"),
  resultElement: document.getElementById("conversion-result"),
  errorElement: document.getElementById("value-error"),
  loadingElement: document.getElementById("loading"),
  toastElement: document.getElementById("error-toast"),
  toastMessage: document.getElementById("toast-message"),
  tabs: () => document.querySelectorAll(".tab"),
};

/**
 * DOM manipulation utilities
 */
const domUtils = {
  showElement: (element) => element?.classList?.remove("hidden"),
  hideElement: (element) => element?.classList?.add("hidden"),
  clearElement: (element) => {
    if (element) element.textContent = "";
  },
  isNumeric: (value) => !isNaN(parseFloat(value)) && isFinite(value),
};

/**
 * Updates the unit dropdowns with the provided units
 * @param {Array} units - Array of unit strings
 */
function populateUnitSelects(units) {
  const options = units
    .map((unit) => `<option value="${unit}">${unit}</option>`)
    .join("");

  const selectHTML = '<option value="">Select unit...</option>' + options;
  [elements.fromUnit, elements.toUnit].forEach((select) => {
    select.innerHTML = selectHTML;
  });
}

/**
 * Updates the active tab in the UI
 * @param {string} activeCategory - The category to activate
 */
function updateActiveTab(activeCategory) {
  elements.tabs().forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === activeCategory);
  });
}

/**
 * Updates the convert button state based on form validity
 * @param {boolean} isValid - Whether the form is valid
 */
function updateConvertButton(isValid) {
  elements.convertBtn.disabled = !isValid;
}

/**
 * Displays the conversion result
 * @param {Object} data - Conversion result data
 */
function displayResult(data) {
  const { value, fromUnit, toUnit, convertedValue } = data;

  elements.resultElement.innerHTML = `
    <div class="result-text">
      <p>
        The equivalent of: ${value} ${fromUnit} in ${toUnit} is: ${convertedValue}
      </p>
    </div>
  `;
}

/**
 * Resets the form to its initial state
 */
function resetForm() {
  elements.valueInput.value = "";
  elements.fromUnit.selectedIndex = 0;
  elements.toUnit.selectedIndex = 0;
  elements.resultElement.innerHTML =
    "<p>Select units and enter a value to convert</p>";
  clearErrors();
}

/**
 * Clears all error messages
 */
function clearErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    domUtils.clearElement(el);
  });
}

/**
 * Shows an error message in the UI
 * @param {string} message - The error message to display
 */
function showError(message) {
  if (!elements.toastElement || !elements.toastMessage) return;

  elements.toastMessage.textContent = message;
  domUtils.showElement(elements.toastElement);

  setTimeout(() => {
    domUtils.hideElement(elements.toastElement);
  }, 5000);
}

/**
 * Toggles the loading state
 * @param {boolean} show - Whether to show or hide the loading state
 */
function toggleLoading(show) {
  if (show) {
    domUtils.showElement(elements.loadingElement);
  } else {
    domUtils.hideElement(elements.loadingElement);
  }
}

// Export public methods
export const handleDom = {
  elements,
  domUtils,
  populateUnitSelects,
  updateActiveTab,
  updateConvertButton,
  displayResult,
  resetForm,
  clearErrors,
  showError,
  toggleLoading,
};
