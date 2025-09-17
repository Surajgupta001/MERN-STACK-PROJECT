# Car Rental Booking Platform — Backend

Node/Express + MongoDB backend for the Car Rental Booking Platform. Provides authentication, car listing management (owners), bookings (users/owners), and availability checks.

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT auth (HTTP `Authorization: Bearer <token>`)

## Getting Started

1. Install dependencies

```powershell
cd "c:\Programming\MERN STACK PROJECT\Car Rental Booking Platform\Backend"
npm install
```

1. Create `.env`

```ini
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-strong-secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your_id>
```

1. Run the server

```powershell
# Dev (if nodemon configured in package.json)
npm run dev
# Or standard
npm start
```

Server listens on `http://localhost:<PORT>`.

## Project Structure

```text
Backend/
  server.js            # App entry, routes mounting
  config/
    database.js        # Mongoose connection
    imageKit.js        # ImageKit client config
  middleware/
    auth.js            # JWT auth (expects Bearer token)
    multer.js          # Memory storage for uploads
  controllers/
    user.controllers.js
    owner.controllers.js
    booking.controllers.js
  models/
    user.models.js
    car.models.js
    booking.models.js
  routes/
    user.routes.js
    owner.routes.js
    booking.routes.js
```

## Authentication

- Register: returns JWT
- Login: returns JWT
- Protected routes use `Authorization: Bearer <token>` header

## Core Models

- `User`: name, email, password (hashed), role ('user' | 'owner')
- `Car`: owner, brand, model, image, year, category, seating_capacity, fuel_type, transmission, pricePerDay, location, description, isAvailable
- `Booking`: car, user, owner, pickupDate, returnDate, status ('pending'|'confirmed'|'cancelled'), price

## Key Endpoints (summary)

Auth & Users (prefix may be `/api/users`):

- `POST /register` — register user
- `POST /login` — login user
- `GET /data` — get user from token (protected)
- `GET /cars` — list available cars

Owners (prefix `/api/owners`, protected):

- `POST /add-car` — multipart form: `image` (file), `carData` (JSON string)
- `GET /cars` — current owner cars
- `PATCH /toggle-car/:id` — toggle availability
- `DELETE /delete-car/:id` — delete car
- `GET /dashboard` — summary data
- `POST /update-image` — update owner profile image

Bookings (prefix `/api/bookings`):

- `POST /check-availability` — body: `{ location, pickupDate, returnDate }`
- `POST /create` — body: `{ car, pickupDate, returnDate }` (protected)
- `GET /user` — current user bookings (protected)
- `GET /owner` — owner bookings (protected)
- `POST /change-status` — body: `{ bookingId, status }` (protected, owner only)

## Availability Rules

Overlapping bookings are detected by date overlap: a booking conflicts if
`existing.pickupDate <= req.returnDate` AND `existing.returnDate >= req.pickupDate`.

## Common Pitfalls

- Ensure frontend sends `Authorization: Bearer <token>`; raw token will fail.
- In availability/search flows, frontend should send `location`, `pickupDate`, `returnDate`.
- Price uses `car.pricePerDay * #days` (rounded up by full days).

## Deployment Notes

- Set env vars in the hosting platform (.env equivalent)
- Ensure MongoDB network access is allowed from the host
- Configure CORS properly on `server.js` if using separate frontend origin

## License

Private project for educational/demo purposes.
