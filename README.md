# Google Calendar Application [Technical Documentation]
---

## 1. Overview
This application is a Single Page Application (SPA) built with React. It allows users to log in using their Google account and manage their Google Calendar events. The app uses the Google OAuth2.0 protocol for secure user authentication and the Google Calendar API to retrieve event details.

### Core Features:
- User authentication via Google OAuth2.
- Fetching and displaying Google Calendar events.
- Filtering events by date.
- Viewing event details.
- Logout functionality.

---

## 2. Technologies Used
- **React**: For building the UI components.
- **Material-UI (MUI)**: For styling and UI components.
- **@react-oauth/google**: For handling Google OAuth2 authentication.
- **React Router DOM**: For client-side routing.
- **Fetch API**: For making HTTP requests to the backend.

---

## 3. Project Setup Instructions
Follow the steps below to set up and run the application:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sonugupta2001/sso-google-calendar-frontend
   cd sso-google-calendar-frontend
   ```

2. **Install Dependencies**:
   Ensure you have Node.js installed. Then, run:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   GOOGLE_CLIENT_ID=<your-google-client-id>
   ```

4. **Run the Application**:
   Start the development server:
   ```bash
   npm start
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 4. Application Components

### Login Component
- **Purpose**: Handles user login using Google OAuth2.
- **Key Design**:
  - The component initializes the Google login process using specific OAuth2 scopes for calendar and user information.
  - It sends the authorization code received from Google to the backend, which exchanges it for an access token.
  - The application stores the code in `localStorage` for session persistence.

### Dashboard Component
- **Purpose**: Displays the user's Google Calendar events.
- **Key Design**:
  - Utilizes a state management approach to fetch and store user profile and event data.
  - Provides a date filter to dynamically display relevant events.
  - Uses a tabular layout (e.g., DataGrid) to show event details in an organized manner.
  - Includes a logout mechanism that clears session data and redirects the user to the login page.

### App Component
- **Purpose**: Acts as the root component and sets up routing for the application.
- **Key Design**:
  - Integrates the Google OAuth client ID using a provider component.
  - Configures routes to enable seamless navigation between the login and dashboard pages.

---

## 5. API Integration
- **Endpoints**:
  1. `POST /api/login`: Handles the exchange of the authorization code for an access token.
  2. `GET /api/getEvents`: Retrieves the user's Google Calendar events.
  3. `GET /api/logout`: Ends the user's session and clears any active tokens.

The frontend communicates with these endpoints using the Fetch API, ensuring secure and efficient data exchange.

---

## 6. Styling
The application employs Material-UI (MUI) for its styling, ensuring consistency and responsiveness across devices. The design leverages:
- **Predefined Themes**: For cohesive color schemes and typography.
- **Custom Styles**: Defined inline or through MUI's `sx` prop to enhance specific components, such as buttons and cards.
- **Data Presentation**: Uses components like tables and grids to display data in a user-friendly format.
