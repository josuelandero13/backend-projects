import { UnitConverterApp } from "./converts/unitConvert.js";

// Global function for toast close button
window.hideToast = function () {
  document.getElementById("error-toast").classList.add("hidden");
};

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    const app = new UnitConverterApp();

    window.app = app;
  } catch (error) {
    const errorToast = document.getElementById("error-toast");
    const errorMessage = document.getElementById("error-message");

    console.error("Failed to initialize:", error);

    if (errorToast && errorMessage) {
      errorMessage.textContent =
        "Failed to initialize the application. Please refresh the page.";
      errorToast.classList.remove("hidden");
    }
  }
});
