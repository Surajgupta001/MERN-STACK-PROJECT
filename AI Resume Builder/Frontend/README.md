## AI Resume Builder – Frontend

An AI‑powered resume creation web app. Users can create, edit, enhance and publish resumes using modular sections (personal info, professional summary, experience, education, projects, skills) with selectable templates and accent colors. AI endpoints assist in generating polished professional summaries and action‑oriented experience descriptions. Resumes can be made public for sharing and printed/downloaded via the browser.

### Key Features

1. Interactive resume builder with live preview
2. Multiple templates with dynamic accent color theming
3. AI enhancement for professional summary and job descriptions
4. Image upload with optional background removal (handled server side)
5. Public/private resume visibility toggle + share link
6. PDF printing via native browser print (Ctrl+P)
7. Upload existing PDF to extract text (pdf to text) and start a new resume
8. Toast feedback, loading states, and guarded multi‑step navigation

### Tech Stack (Frontend)

- React + Vite
- React Router
- Redux Toolkit (auth state)
- Axios (API calls)
- Tailwind CSS for utility styling
- Lucide React icons
- react-hot-toast for notifications
- pdfToText (react-pdftotext) for PDF extraction

### Project Structure (Frontend)

```
src/
	app/               # Redux slices & store
	components/        # Reusable UI + forms (ExperienceForm, ProfessionalSummaryForm, ColorPicker, TemplateSelector, ResumePreview, etc.)
	components/home/   # Landing page sections (Hero, Testimonial, Footer)
	pages/             # Route pages (Home, Layout, Dashboard, ResumeBuilder, Preview)
	configs/           # API client (axios instance)
	index.jsx          # App bootstrap
```

### Data Flow / Core Concepts

- Resume state lives in `ResumeBuilder` and is passed into section forms which mutate slices of the resume.
- Saving uses `FormData` (resumeData JSON + optional image + optional removeBackground flag) to match backend controller expectations.
- Accent color normalized to lowercase to ensure consistent template styling.
- AI enhancement calls POST endpoints and sanitizes bullet/number prefixes from model output.

### Authentication

- JWT token stored in `localStorage` after login/signup.
- Token attached manually in headers (e.g., `{ Authorization: token }`). Backend middleware accepts raw token or `Bearer <token>`.
- On app load (`App.jsx`), `getUserData` hydrates user + token into Redux.

### Environment Variables

Create `.env` file at project root (Frontend) with:

```
VITE_BASE_URL=http://localhost:5000
```

Adjust for production (e.g., hosted API origin).

### Installing & Running (Windows PowerShell)

```powershell
# From repository root
cd "AI Resume Builder/Frontend"
npm install
npm run dev
```

App will start on the Vite default port (e.g., http://localhost:5173). Backend should run separately (typically on port 5000).

### Core API Endpoints (Consumed by Frontend)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/v1/users/signup | Register user (backend) |
| POST | /api/v1/users/login | Authenticate, returns JWT |
| GET  | /api/v1/users/data | Fetch authenticated user profile |
| GET  | /api/v1/users/resumes | List resumes for current user |
| POST | /api/v1/resumes/create | Create empty resume with title |
| GET  | /api/v1/resumes/get/:id | Fetch single resume for editing |
| PUT  | /api/v1/resumes/update | Update resume (FormData; resumeId + resumeData) |
| DELETE | /api/v1/resumes/delete/:id | Delete a resume |
| GET  | /api/v1/resumes/public/:id | Public read-only resume preview |
| POST | /api/v1/ai/enhance-pro-sum | AI enhance professional summary |
| POST | /api/v1/ai/enhance-job-desc | AI enhance job description |
| POST | /api/v1/ai/upload-resume | Upload PDF text -> create new resume |

### AI Enhancement Flow

1. User enters raw text (summary or job description).
2. Component constructs a prompt and POSTs to the AI endpoint with token.
3. Response `{ success, data }` returns improved text.
4. Client sanitizes bullet prefixes via regex: `^\s*(?:[-*•‣▪◦]+|\d+[.)]|[A-Za-z]\))\s+` across lines.
5. Updated field persisted in local state; user saves full resume to backend.

### Background Removal (Image)

- When user toggles remove background in personal info form, the frontend includes `removeBackground='true'` and raw file in `FormData`.
- Backend uses ImageKit + e-bgremove transformation; updated image URL saved to resume.

### Printing / Download

- Browser print (Ctrl+P) triggered by Download button within preview panel.
- Templates styled to be print-friendly (avoid interactive controls, set layout).

### Public Sharing

- Visibility toggle (`Public` / `Private`) updates `public` flag server-side.
- When public, Share button builds `/view/:resumeId` URL for others; preview route uses public fetch endpoint.

### Error Handling & UX

- `toast.promise` for save operations (loading/success/error states).
- Individual toasts for AI enhancement success/failure.
- Disabled buttons during async operations (isSaving, isGenerating, generatingIndex).

### Common Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on API calls | Wrong `VITE_BASE_URL` | Set to backend origin & restart dev server |
| Auth denied | Missing/expired token | Re-login; ensure localStorage token exists |
| Image not updating | Not re-saved after selecting image | Click "Save Changes" after selecting file |
| AI enhancement empty | Backend error or rate limit | Retry; check backend logs; ensure AI key configured |
| Bullets remain | Regex not applied | Verify component code; re-trigger enhancement |

### Extending

- Add new template: create component under `components/templates`, register in `TemplateSelector`, ensure it accepts `data` + `accentColor`.
- Centralize Authorization: optionally implement axios interceptor (currently manual headers).
- Add AI retry/backoff or streaming responses for longer enhancements.
- Implement diff preview (before/after) prior to applying AI changes.

### Windows Development Notes

- Use PowerShell paths with quotes if spaces: `cd "AI Resume Builder/Frontend"`.
- If port conflicts: `npm run dev -- --port=5174`.

### License / Attribution

Internal project; icons via Lucide, styling via Tailwind. Ensure compliance with upstream licenses when distributing.

---
