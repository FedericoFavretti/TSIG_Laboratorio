# Public Transport Information Tool

This project is a public transport information tool designed to provide real-time information to end users while allowing administrators to manage routes, stops, and schedules. The application features a map interface with filtering options and notifications about changes in the transport network.

## Features

- **Admin Dashboard**: Administrators can update route, stop, and schedule information.
- **Real-Time Information**: Users receive live updates on transport services.
- **Map Integration**: Displays transport routes and stops with filtering options.
- **Notifications**: Users are notified of changes in the transport network.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd public-transport-frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build, run:
```
npm run build
```
The build artifacts will be stored in the `build` directory.

## Folder Structure

- `src/`: Contains all the source code for the application.
  - `components/`: Reusable components for the application.
  - `pages/`: Page components for routing.
  - `services/`: API and WebSocket services for data handling.
  - `types/`: TypeScript types and interfaces.
- `public/`: Static files, including the main HTML file.
- `package.json`: Project metadata and dependencies.
- `tsconfig.json`: TypeScript configuration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.