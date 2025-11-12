# AI Resume Builder – Backend

Node/Express + MongoDB API powering an AI‑assisted resume creation platform. Provides endpoints for user auth, CRUD operations on resumes, AI text enhancement (professional summary & job descriptions), PDF resume ingestion (text extraction happens client‑side, structured parsing here via AI), and optional image background removal using ImageKit transformations.

## Highlights

1. Modular REST API under `/api/v1/*` versioning
2. JWT auth (7‑day expiry) via custom middleware `protect`
3. Resume CRUD with public visibility toggle & template/accent metadata
4. AI integration (OpenAI style client -> Gemini) for enhancement & structured extraction
5. Image upload with configurable pre‑transform + background removal (`e-bgremove`)
6. Strict JSON parsing for multipart `resumeData` payloads in update route
7. Defensive error handling & consistent response schema `{ success, message?, data?/resume? }`

### Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js (ES Modules) |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcrypt |
| File Upload | Multer (disk storage) |
| Image Processing | ImageKit transformations (face focus, optional bg remove) |
| AI | OpenAI SDK pointed to Gemini base URL (chat.completions) |
| Env | dotenv (`dotenv/config`) |
| CORS | cors |

### Directory Structure (Backend)

```
Backend/
	server.js               # App bootstrap & route mounting
	config/
		database.js           # Mongo connection (async)
		ai.js                 # OpenAI client configured with GEMINI vars
		imageKit.js           # ImageKit client (background removal support)
		multer.js             # Multer setup (disk storage placeholder)
	controllers/
		UserControllers.js    # Auth & user data endpoints
		ResumeControllers.js  # Resume CRUD/business logic
		AiControllers.js      # AI enhancement & resume upload extraction
	middlewares/
		authMiddlewares.js    # JWT protect middleware
	models/
		User.js               # User schema + password compare method
		Resume.js             # Resume schema (nested sections)
	routes/
		userRoutes.js         # /api/v1/users/*
		resumeRoutes.js       # /api/v1/resumes/*
		aiRoutes.js           # /api/v1/ai/*
```

### Environment Variables (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_resume_builder
JWT_SECRET=replace_with_strong_secret

# AI (Gemini via OpenAI client)
GEMINI_API_KEY=your_api_key
GEMINI_BASE_URL=https://api.gemini.example/v1   # adjust to actual base
GEMINI_AI_MODEL=gemini-1

# ImageKit
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

> Ensure MongoDB is running locally or point `MONGODB_URI` to a managed cluster.

### Installation & Run (Windows PowerShell)

```powershell
cd "AI Resume Builder/Backend"
npm install
npm run start    # or: node server.js
```

Server listens on `PORT` (default 5000). Health check: `GET http://localhost:5000/` returns plain text.

### Authentication Flow

1. User registers (`POST /api/v1/users/register`) -> receives JWT.
2. Client stores token (localStorage) and sends it in `Authorization` header (raw token accepted).
3. Middleware verifies token (`jwt.verify`), sets `req.userId` for downstream controllers.
4. Protected endpoints require valid token; invalid or missing -> 401 with message.

### Data Models (Summary)

`User`:
```jsonc
{
	"name": "String",
	"email": "String(unique)",
	"password": "String(hash)"
}
```

`Resume` (selected fields):
```jsonc
{
	"userId": "ObjectId(User)",
	"title": "String",
	"public": "Boolean",
	"template": "classic|minimal|...",
	"accent_color": "#hex",
	"professional_summary": "String",
	"skills": ["String"],
	"personal_info": {
		"image": "String(URL)",
		"full_name": "String",
		"profession": "String",
		"email": "String",
		"phone": "String",
		"location": "String",
		"linkedin": "String",
		"website": "String"
	},
	"experience": [{ "company": "String", "position": "String", "start_date": "String", "end_date": "String", "description": "String", "is_current": Boolean }],
	"project": [{ "name": "String", "type": "String", "description": "String" }],
	"education": [{ "institution": "String", "degree": "String", "field": "String", "graduation_date": "String", "gpa": "String" }]
}
```

### API Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | None | Health check |
| POST | /api/v1/users/register | None | Register new user |
| POST | /api/v1/users/login | None | Login existing user |
| GET | /api/v1/users/data | JWT | Get authenticated user profile |
| GET | /api/v1/users/resumes | JWT | List resumes for user |
| POST | /api/v1/resumes/create | JWT | Create a new empty resume |
| GET | /api/v1/resumes/get/:resumeId | JWT | Fetch a resume (owner only) |
| GET | /api/v1/resumes/public/:resumeId | None | Public resume view |
| PUT | /api/v1/resumes/update | JWT + (multipart) | Update resume sections / image |
| DELETE | /api/v1/resumes/delete/:resumeId | JWT | Delete a resume |
| POST | /api/v1/ai/enhance-pro-sum | JWT | Enhance professional summary |
| POST | /api/v1/ai/enhance-job-desc | JWT | Enhance job description |
| POST | /api/v1/ai/upload-resume | JWT | Create resume from raw PDF text (structured extraction) |

### Resume Update Payload

`PUT /api/v1/resumes/update` expects either JSON or multipart/form-data:

Multipart fields:
```
resumeId=... (String)
resumeData={"template":"classic", ...} (JSON string)
removeBackground=true (optional)
image=<file> (optional)
```

### Image Processing

- Multer stores uploaded file temporarily (disk).
- ImageKit upload uses pre transformation: `w-300,h-400,fo-face,z-0.75` plus `e-bgremove` if `removeBackground` set.
- Result URL stored in `resume.personal_info.image`.

### AI Integration Details

- Uses chat completion format; system prompt defines transformation intent.
- Enhancement endpoints return `{ success, data: <string> }` only (no extra metadata).
- Upload resume endpoint requests JSON response format (`response_format: json_object`) then persists parsed object.

### Error & Response Conventions

| Scenario | Code | Body Example |
|----------|------|--------------|
| Validation fail | 400 | `{ "success": false, "message": "Resume not found" }` |
| Auth missing/invalid | 401 | `{ "success": false, "message": "Invalid token, authorization denied" }` |
| Not found | 404 | `{ "success": false, "message": "Resume not found" }` |
| Success (fetch) | 200 | `{ "success": true, "resume": { ... } }` |
| Created | 201 | `{ "success": true, "resume": { ... } }` |

### Security Considerations

- JWT secret must be strong; avoid committing `.env`.
- Sanitize AI prompts (current implementation passes user text directly—consider length & content filters for production).
- Validate uploaded image MIME type and size (multer storage currently minimal; extend storage + fileFilter).
- Rate limit AI endpoints to prevent abuse / cost spikes.

### Performance Notes

- Single resume update performs one ImageKit upload if image present; consider offloading to queue for heavy transformations.
- AI calls are network bound; add caching for identical enhancement requests (hash of input text) if needed.

### Future Improvements

1. Add refresh token / short‑lived access token rotation
2. Implement axios interceptor on frontend (simplify header logic) & accept Bearer format consistently
3. Add indexing (e.g., `userId` compound indexes for resume queries)
4. Add soft delete / audit logs
5. Improve validation with a schema layer (Zod / Joi)
6. Implement rate limiting (express-rate-limit) and helmet for hardening
7. Expand AI: skill extraction, gap analysis, quantification suggestions
8. Add pagination for large resume lists

### Quick Test (cURL Examples)

```bash
curl -X POST http://localhost:5000/api/v1/users/register \
	-H 'Content-Type: application/json' \
	-d '{"name":"Test","email":"test@example.com","password":"Passw0rd!"}'

curl -X POST http://localhost:5000/api/v1/users/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"test@example.com","password":"Passw0rd!"}'
```

### Troubleshooting

| Issue | Cause | Remedy |
|-------|-------|--------|
| `MongoNetworkError` | Mongo not running | Start local Mongo or update URI |
| 401 on protected route | Missing/invalid JWT | Re-auth; verify `JWT_SECRET` matches issuer |
| 400 `Invalid resumeData JSON` | Bad JSON string in multipart | Ensure JSON.stringify before append |
| AI 400 error | Bad model or API key | Verify `GEMINI_API_KEY`, `GEMINI_AI_MODEL` |
| Image upload fail | Missing ImageKit key | Set `IMAGEKIT_PRIVATE_KEY` |

---
