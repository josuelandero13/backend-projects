import { getUnits, convertUnits } from "../services/apiService.js";
import { handleDom } from "../utils/handleDom.js";
import { validateNumberInput, isFormValid } from "../utils/validation.js";

export class UnitConverterApp {
  constructor() {
    this.currentCategory = "length";
    this.units = {};
    this.initializeApp();
  }

  // Initialize the application
  async initializeApp() {
    this.setupEventListeners();
    await this.loadUnits(this.currentCategory);
    this.updateUI();
  }

  // Set up all event listeners
  setupEventListeners() {
    const { elements } = handleDom;

    // Tab switching
    elements.tabs().forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.handleTabClick(e.target.dataset.category);
      });
    });

    // Button events
    elements.convertBtn.addEventListener("click", () => this.convert());
    elements.resetBtn.addEventListener("click", () => this.reset());

    // Input events
    elements.valueInput.addEventListener("input", () =>
      this.handleInputChange(),
    );
    elements.fromUnit.addEventListener("change", () => this.updateUI());
    elements.toUnit.addEventListener("change", () => this.updateUI());
  }

  // Handle tab click events
  async handleTabClick(category) {
    this.currentCategory = category;
    handleDom.updateActiveTab(category);

    if (!this.units[category]) {
      await this.loadUnits(category);
    } else {
      handleDom.populateUnitSelects(this.units[category]);
    }

    this.reset();
  }

  // Load units for a specific category
  async loadUnits(category) {
    try {
      handleDom.toggleLoading(true);
      const units = await getUnits(category);
      this.units[category] = units;
      handleDom.populateUnitSelects(units);
    } catch (error) {
      handleDom.showError(error.message || "Error loading units");
    } finally {
      handleDom.toggleLoading(false);
    }
  }

  // Handle input validation and UI updates
  handleInputChange() {
    const { elements } = handleDom;
    const isValid = validateNumberInput(
      elements.valueInput.value.trim(),
      elements.errorElement,
    );

    this.updateUI();

    return isValid;
  }

  // Update UI elements based on current state
  updateUI() {
    const { elements } = handleDom;
    const value = elements.valueInput.value.trim();
    const fromUnit = elements.fromUnit.value;
    const toUnit = elements.toUnit.value;

    const isValid = isFormValid(value, fromUnit, toUnit);
    handleDom.updateConvertButton(isValid);
  }

  // Perform the unit conversion
  async convert() {
    if (!this.handleInputChange()) return;

    const { elements } = handleDom;
    const conversionData = {
      value: parseFloat(elements.valueInput.value),
      fromUnit: elements.fromUnit.value,
      toUnit: elements.toUnit.value,
      category: this.currentCategory,
    };

    try {
      handleDom.toggleLoading(true);
      const result = await convertUnits(conversionData);
      handleDom.displayResult(result);
    } catch (error) {
      handleDom.showError(error.message || "Error during conversion");
    } finally {
      handleDom.toggleLoading(false);
    }
  }

  // Reset the form
  reset() {
    handleDom.resetForm();
    this.updateUI();
  }
}
