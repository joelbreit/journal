# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a markdown-based journaling web application with a Notion-like editing experience. The project uses:
- **Frontend**: React + Vite + Tailwind CSS + Lucide React icons + **TipTap** rich text editor
- **Backend**: AWS SAM (Lambda + API Gateway + S3 + Cognito)
- **Storage**: Markdown files stored in S3 at `{userId}/{entryId}.md`
- **Authentication**: Custom auth pages using AWS Amplify SDK (not Cognito Hosted UI)

## Development Commands

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
```

### Backend (AWS SAM)
```bash
cd backend
sam build            # Build SAM application
sam deploy --guided  # First-time deployment (interactive)
sam deploy           # Deploy updates
```

## AWS Resource Tagging

**All AWS resources must be tagged with `Project: journal`** for cost tracking and resource management.

In `template.yaml`, ensure all resources include:
```yaml
Tags:
  Project: journal
```

## Implementation Phases

### Phase 1: Core Functionality (Current Priority)
- Full AWS cloud infrastructure (SAM, S3, Cognito, Lambda, API Gateway)
- Custom authentication pages using AWS Amplify SDK
- TipTap rich text editor with direct WYSIWYG editing
- Entry CRUD operations (create, read, update, delete)
- Auto-save every 5 seconds
- Entry list view

**Phase 1 does NOT include**: search, tags, export/import, preview mode

### Phase 2: Enhanced Features (Future)
- Full-text search across entries
- Tags and categories (using markdown frontmatter)
- Export/import functionality
- Multi-select bulk operations
- Settings page

See README.md for detailed implementation checklist.

## Key Technical Decisions

### Editor Implementation
- **Use TipTap** for rich text editing (not custom contenteditable)
- **No preview mode** - editor provides direct WYSIWYG formatting like a text editor
- **Markdown storage** - entries saved as `.md` files with proper markdown syntax
- **Auto-save**: Triggers 5 seconds after user stops typing (debounced)

### Authentication
- **Custom auth pages** built with React + AWS Amplify SDK
- Components needed: Login.jsx, Signup.jsx, ForgotPassword.jsx
- **NOT using** Cognito Hosted UI (want full control over UX)
- JWT stored in localStorage, included in all API requests as Bearer token

### S3 Storage Strategy
- Store entry content as markdown files: `users/{userId}/{entryId}.md`
- Store metadata in S3 object metadata for fast listing (title, date, preview)
- In Phase 2, consider DynamoDB for search performance

## Architecture Key Points

### Data Flow
1. React editor converts formatting to markdown syntax in real-time
2. Auto-save triggers PUT request to API Gateway
3. Lambda validates user authorization via Cognito JWT
4. Entry saved to S3 as markdown file: `users/{userId}/{entryId}.md`

### Frontend Structure
- `components/Editor/` - TipTap rich text editor with markdown-aware WYSIWYG formatting
  - `MarkdownEditor.jsx` - Main TipTap editor component
  - `FormattingToolbar.jsx` - Toolbar with formatting buttons
- `components/Journal/` - Entry list and cards (search is Phase 2)
  - `EntryList.jsx` - Chronological list of all entries
  - `EntryCard.jsx` - Individual entry preview
- `components/Auth/` - Custom authentication pages
  - `Login.jsx`, `Signup.jsx`, `ForgotPassword.jsx`
  - `ProtectedRoute.jsx` - Route wrapper for auth
- `pages/` - Main application pages
  - `Home.jsx` - Landing page with entry list
  - `EditorPage.jsx` - Full-screen editor view
- `services/api.js` - API client for backend communication
- `services/auth.js` - Amplify authentication handling (login, signup, logout, getCurrentUser)
- `hooks/useAutoSave.js` - Auto-save functionality (5-second debounce)

### Backend Structure (AWS SAM)
- `template.yaml` - SAM infrastructure definition (all resources tagged `Project: journal`)
- `src/handlers/entries/` - CRUD operations for journal entries (Phase 1)
  - `create.js` - POST /entries
  - `list.js` - GET /entries (returns metadata only, not full content)
  - `get.js` - GET /entries/{id} (returns full markdown)
  - `update.js` - PUT /entries/{id} (auto-save endpoint)
  - `delete.js` - DELETE /entries/{id}
- `src/handlers/search/` - Full-text search across entries (Phase 2)
- `src/handlers/export/` - Download all entries as zip (Phase 2)
- `src/layers/common/` - Shared S3 and auth utilities
  - `s3Client.js` - saveEntry, getEntry, listEntries, deleteEntry
  - `auth.js` - Extract user claims from JWT

### API Endpoints

**Phase 1 Endpoints:**
- `POST /entries` - Create new entry
- `GET /entries` - List all entries for authenticated user (metadata only)
- `GET /entries/{id}` - Get specific entry with full markdown content
- `PUT /entries/{id}` - Update existing entry (used by auto-save)
- `DELETE /entries/{id}` - Delete entry

**Phase 2 Endpoints:**
- `GET /search?q={query}` - Full-text search across entries
- `GET /export` - Export all entries as zip file
- `POST /import` - Import markdown files

### Authentication
- Custom React auth pages using AWS Amplify SDK (Login, Signup, ForgotPassword)
- JWT access token stored in localStorage
- All API requests include `Authorization: Bearer {token}` header
- API Gateway validates token with Cognito before reaching Lambda
- User claims (userId) extracted from JWT in Lambda for authorization

### Environment Variables
Frontend requires `.env` file:
```
VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_REGION=us-east-1
```

## Security Requirements
- All API endpoints require authentication via Cognito
- S3 bucket must not be publicly accessible
- Users can only access their own entries (enforce in Lambda via Cognito user claims)
- Input sanitization required to prevent XSS attacks
- Rate limiting on API endpoints
