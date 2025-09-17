# Car Rental Booking Platform — Frontend

React + Vite frontend for the Car Rental Booking Platform. Implements browsing, searching by location/date, booking flow, and owner dashboards.

## Tech Stack

- React, Vite
- React Router
- Tailwind CSS
- Axios
- react-hot-toast

## Getting Started

1. Install dependencies

```powershell
cd "c:\Programming\MERN STACK PROJECT\Car Rental Booking Platform\Frontend"
npm install
```

1. Environment variables

Create a `.env` file at the project root (next to `package.json`).

```ini
# Base URL of the backend server
VITE_BASE_URL=http://localhost:5000

# Currency symbol for UI
VITE_CURRENCY=$
```

1. Run the dev server

```powershell
npm run dev
```

Access the app at the URL shown by Vite (default <http://localhost:5173>).

## Project Structure

```text
Frontend/
  src/
    main.jsx
    App.jsx
    context/
      AppContext.jsx     # Axios baseURL, auth token, global state
    pages/
      Car.jsx            # Available cars list / search results
      CarDetails.jsx     # Car detail + booking form
      owner/
        Dashboard.jsx
        ManageCars.jsx
        ManageBookings.jsx
    components/
      Navbar.jsx
      FeaturedSection.jsx
      CarCard.jsx
  public/
  vite.config.js
  index.html
```

## Key Features

- Browse and search cars by location and date
- Create bookings (requires login)
- Owner dashboard to manage cars and bookings
- Image uploads (owners) via ImageKit (handled by backend)

## Important Behaviors

- Auth header: Frontend sets `Authorization: Bearer <token>` automatically after login.
- Availability search: Sends `{ location, pickupDate, returnDate }` to `/api/bookings/check-availability`.
- Create booking: Sends `{ car, pickupDate, returnDate }` to `/api/bookings/create`.
- Owner status changes: Sends `{ bookingId, status }` to `/api/bookings/change-status`.

## Troubleshooting

- Empty search results while cars show in list:
  - Ensure URL has all three params: `pickupLocation` (or `location`), `pickupDate` (or `pickupdate`), and `returnDate` (or `returndate`).
  - When search params exist, the page shows only API results; local filtering does not override them.
- 401 Unauthorized on protected calls:
  - Confirm token exists in localStorage and that headers include `Authorization: Bearer <token>`.
  - If backend expects Bearer, raw tokens will fail.
- Date validation:
  - Return date must be after pickup date; invalid inputs are blocked with a toast.

## Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## License

Private project for educational/demo purposes.
