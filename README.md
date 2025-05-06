# Event Ease - Event Planner Search Platform

Event Ease is a web application that helps users find event planners for various occasions such as weddings, birthdays, corporate events, and social gatherings.

## Features

- Search for event planners by event type and budget
- View detailed information about each event planner
- Contact event planners directly
- Responsive design for mobile and desktop
>📷 Video Link [https://drive.google.com/file/d/1nwRjhOnBhMzcFZpFvlVQPOktOsvBRWcC/view?usp=drive_link]

## Technologies Used

- HTML5 & CSS3
- JavaScript (ES6+)
- Node.js & Express.js

## How to Run the Project

### Prerequisites

- Node.js and npm installed on your system

### Installation Steps

1. Clone or download this repository to your local machine

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   Or for development with auto-reload:
   ```
   npm run dev
   ```

4. Open your web browser and navigate to:
   ```
   http://localhost:3000/index3.html
   ```

## Project Structure

- `index3.html` - Main HTML file for the application
- `styles.css` - CSS styling for the application
- `script3.js` - Client-side JavaScript for handling user interactions
- `server.js` - Node.js/Express server providing API endpoints
- `package.json` - Project dependencies and scripts

## API Endpoints

- GET `/api/event-types` - Returns a list of all event types
- GET `/api/event-planners` - Returns a list of all event planners
- GET `/api/search-planners?event_type={type}&location={location}` - Returns filtered event planners

## Contact

For any questions or feedback, please contact:
- Email: info@eventease.com
- Phone: +91 98765 43210 
