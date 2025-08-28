# Chat App Backend

Express + Socket.IO backend powering the real‑time chat application.

## Tech Stack

- Node.js / Express (ES Modules)
- MongoDB + Mongoose
- Socket.IO (real‑time presence & messaging)
- Cloudinary (image uploads for profile pics & message images)
- JWT auth (http header `token`)
- bcryptjs (password hashing)

## Folder Structure

```text
Backend/
	server.js               # App & Socket.IO bootstrap
	lib/
		database.js           # Mongo connection
		utils.js              # JWT helper
		cloudinary.js         # Cloudinary config
	middlewares/
		auth.js               # protectRoute middleware
	models/
		user.models.js
		message.models.js
	controllers/
		user.controllers.js   # signup / login / profile / auth check
		message.controllers.js# users list, send, list, mark seen
	routes/
		user.routes.js        # /api/auth/*
		message.routes.js     # /api/messages/*
	Readme.md
```

## Environment Variables

Create a `.env` file in `Backend/` with:

```bash
PORT=8080                   # or any free port
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster/<db>?retryWrites=true&w=majority
JWT_SECRET=super_secret_string
CLOUDINARY_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CORS=http://localhost:5173   # Frontend origin (Vite dev server)
```

## Install & Run

```bash
# From Backend folder
npm install

# Development (auto‑reload)
npm run server
# Production style
npm start
```

Server health check: GET `http://localhost:8080/api/status` should return `Server is running`.

## Auth Flow

1. Client hits `POST /api/auth/signup` or `POST /api/auth/login` → receives `{ token, user }`.
2. Frontend stores token & sets `axios.defaults.headers.common['token']=<token>`.
3. Subsequent protected requests include `token` header (NOT `Authorization`).
4. `GET /api/auth/check` validates token and returns fresh user payload.

## REST Endpoints

| Method | Path                           | Protected | Description                            |
|--------|--------------------------------|-----------|----------------------------------------|
| GET    | /api/status                    | No        | Health check                           |
| POST   | /api/auth/signup               | No        | Create account                         |
| POST   | /api/auth/login                | No        | Login                                  |
| GET    | /api/auth/check                | Yes       | Validate token & return user           |
| PUT    | /api/auth/update-profile       | Yes       | Update name / bio / profile pic        |
| GET    | /api/messages/users            | Yes       | Users list (query: includeSelf=true)   |
| GET    | /api/messages/:id              | Yes       | Conversation with user :id             |
| POST   | /api/messages/send/:id         | Yes       | Send text / image to user :id          |
| PUT    | /api/messages/mark/:messageId  | Yes       | Mark single message seen               |

### Query Options

`GET /api/messages/users?includeSelf=true` → include the authenticated user in the sidebar list.

## Socket.IO Events

| Direction  | Event          | Payload              | Notes                             |
|------------|----------------|----------------------|-----------------------------------|
| client→srv | (connection)   | query: { userId }    | Registers user socket             |
| srv→client | getOnlineUsers | string[] (userIds)   | Broadcast online presence         |
| srv→client | newMessage     | Message document     | Emitted to receiver on send       |

Presence derives from active sockets (`userSocketMap`). Disconnect cleans map & re‑emits list.

## Message Model (simplified)

```json
{
	"text": "String",
	"image": "String",          // Cloudinary URL if sent
	"senderId": "ObjectId(User)",
	"receiverId": "ObjectId(User)",
	"seen": "Boolean",
	"createdAt": "Date",
	"updatedAt": "Date"
}
```

## Common Issues & Tips

| Issue              | Cause                      | Fix                                                     |
|--------------------|----------------------------|---------------------------------------------------------|
| 401 Unauthorized   | Missing `token` header     | Set axios default header after login/signup             |
| Empty users list   | Not authenticated yet      | Ensure `/api/auth/check` succeeded first                |
| Images not upload  | Cloudinary creds missing   | Double‑check `.env` values                              |
| CORS error         | Origin mismatch            | Set `CORS` env to exact frontend URL                    |

## Production Notes

- Serve frontend from a separate host/domain and set accurate `CORS`.
- Use HTTPS & secure JWT secret.
- Add indexes for frequent queries (e.g., compound index on `senderId, receiverId, createdAt`).
- Consider pagination + soft deletion (archiving) for large conversations.

## License

ISC (adjust as needed).

---
Backend documentation last updated: 2025-08-08.
