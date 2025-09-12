# Unit Converter

A RESTful API for converting between different units of measurement. This API provides endpoints to get available units and perform unit conversions across different measurement categories.

## Features

- Convert between different units of measurement
- Support for multiple unit categories (length, weight, temperature, etc.)
- Simple and intuitive REST API
- TypeScript implementation for type safety
- Built with Node.js and native HTTP module

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) (v14 or later) and [pnpm](https://pnpm.io/) installed.

2. Clone the repository:

   ```bash
   git clone <repository-url>
   cd unit-converter
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

### Starting the Server and UI

To start the development server with hot-reload and serve the frontend UI:

1. First, ensure all dependencies are installed:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. The server will start on `http://localhost:3000` by default.

4. To access the web interface, you have the following options:
   - Open your browser and navigate to:
     ```
     http://localhost:3000
     ```
   - Alternatively, you can use the Live Server extension in VSCode:
     1. Install the "Live Server" extension from the VSCode marketplace
     2. Right-click on the `index.html` file in your project
     3. Select "Open with Live Server"

   The UI will automatically connect to the backend server running on the same port.

5. For development with hot-reload (if using a frontend framework with hot-reload support), you might need to run the frontend development server separately. Check the frontend documentation for specific instructions.

### Troubleshooting

- If you encounter CORS issues, ensure both the backend server and frontend are running on the same domain or configure CORS properly in the backend.
- Make sure the backend server is running before accessing the frontend.
- Check the browser's developer console (F12) for any errors if the UI doesn't load correctly.

### Available Endpoints

#### 1. Get Available Units

Returns a list of available units for a specific category.

**Endpoint:** `GET /api/units?category=<category>`

**Parameters:**

- `category` (required): The category of units to retrieve (e.g., 'length', 'weight', 'temperature')

**Example Request:**

```
GET /api/units?category=length
```

**Example Response:**

```json
{
  "category": "length",
  "units": ["meter", "kilometer", "mile", "foot", "inch"]
}
```

#### 2. Convert Units

Converts a value from one unit to another within the same category.

**Endpoint:** `POST /api/convert_units`

**Request Body:**

```json
{
  "value": 10,
  "fromUnit": "meter",
  "toUnit": "foot",
  "category": "length"
}
```

**Response:**

```json
{
  "value": 10,
  "fromUnit": "meter",
  "toUnit": "foot",
  "convertedValue": 32.8084,
  "timestamp": "2025-09-11T21:49:50.000Z"
}
```

## Available Unit Categories

The API supports the following unit categories:

- Length (meter, kilometer, mile, foot, inch, etc.)
- Weight (gram, kilogram, pound, ounce, etc.)
- Temperature (celsius, fahrenheit, kelvin)
- Volume (liter, milliliter, gallon, quart, pint, etc.)
- Time (second, minute, hour, day, etc.)

## Development

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── core/            # Core conversion logic
│   ├── converters/  # Unit converters
│   └── types/       # TypeScript type definitions
├── main.ts         # Core conversion functions
└── server.ts       # HTTP server setup
```

### Building for Production

To build the project for production:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

### Running Tests

To run the test suite:

```bash
pnpm test
```

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
