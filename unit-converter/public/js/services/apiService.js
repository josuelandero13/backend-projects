// API Configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api",
  ENDPOINTS: {
    UNITS: "/units",
    CONVERT: "/convert_units",
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
};

/**
 * Handles API requests with error handling
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} The parsed JSON response
 */
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Fetches units for a specific category
 * @param {string} category - The unit category (e.g., 'length', 'weight')
 * @returns {Promise<Array>} Array of available units
 */
export async function getUnits(category) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNITS}?category=${category}`;
  const response = await fetchWithErrorHandling(url);

  return response.units || [];
}

/**
 * Converts a value from one unit to another
 * @param {Object} params - Conversion parameters
 * @param {number} params.value - The value to convert
 * @param {string} params.fromUnit - The source unit
 * @param {string} params.toUnit - The target unit
 * @param {string} params.category - The unit category
 * @returns {Promise<Object>} Conversion result
 */
export async function convertUnits({ value, fromUnit, toUnit, category }) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONVERT}`;
  const response = await fetchWithErrorHandling(url, {
    method: "POST",
    body: JSON.stringify({
      value: parseFloat(value),
      fromUnit,
      toUnit,
      category,
    }),
  });

  return response;
}
