# Markdown Journal Web App

A modern, cloud-native journaling application with a rich text editor interface backed by markdown files stored in AWS S3.

## Overview

This application will provide a Notion-like editing experience for personal journaling, with all entries stored as markdown files for portability and long-term accessibility. The app will combine a polished frontend with serverless backend infrastructure for scalable, cost-effective operation.

## Tech Stack

### Frontend
- **React JS** - UI framework
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Icon library
- **React Router** - Client-side routing and navigation
- **Rich Text Editor** - Custom markdown-aware editor with WYSIWYG formatting

### Backend
- **AWS SAM** - Infrastructure as Code and deployment
- **AWS Lambda** - Serverless compute for API handlers
- **Amazon API Gateway** - REST API interface
- **Amazon S3** - Markdown file storage
- **Amazon Cognito** - User authentication and authorization

## Features

### Rich Text Editing
- **Direct editing** with live formatting (Notion-style, not a separate preview)
- **Formatting toolbar** with options for:
  - Bold (`**text**`)
  - Italics (`*text*`)
  - Headers (H1-H6)
  - Unordered lists
  - Ordered lists
  - Blockquotes
  - Code blocks
  - Links
- **Markdown compatibility** - All entries stored as valid `.md` files
- **Auto-save** - Periodic background saves every 5 seconds

### Journal Management
- **Entry list** - Chronological view of all journal entries
- **Search** - Full-text search across all entries
- **Tags/Categories** - Organize entries with custom tags
- **Date-based organization** - Automatic date stamping and filtering
- **Date Backfill** - Add or modify dates for existing entries

### Data Portability
- **Markdown format** - All entries stored as `.md` files
- **Export** - Download individual entries or entire journal
- **Import** - Upload existing markdown files
- **S3 storage** - Direct access to raw files if needed
- **Multi-Select** - Select multiple entries for batch operations

## Implementation Plan

### Phase 1: Core Functionality (MVP)
**Goal**: Create a fully functional journaling app with cloud storage, authentication, and rich text editing

#### Infrastructure & Backend
- [ ] **AWS SAM Setup**
  - Define `template.yaml` with all resources tagged `Project: journal`
  - Create S3 bucket for markdown storage with proper security policies
  - Configure Cognito User Pool and App Client
  - Set up API Gateway with Cognito authorizer
  - Define IAM roles for Lambda functions

- [ ] **Lambda API Handlers**
  - `POST /entries` - Create new journal entry, save to S3 at `users/{userId}/{entryId}.md`
  - `GET /entries` - List all entries for authenticated user (metadata only, not full content)
  - `GET /entries/{id}` - Get specific entry with full markdown content
  - `PUT /entries/{id}` - Update existing entry (auto-save endpoint)
  - `DELETE /entries/{id}` - Delete entry from S3
  - Implement user authorization checks using Cognito JWT claims
  - Add error handling and validation

- [ ] **S3 Integration**
  - Create shared S3 utility layer (`src/layers/common/s3Client.js`)
  - Implement functions: saveEntry, getEntry, listEntries, deleteEntry
  - Store metadata (title, date, preview) in S3 object metadata for fast listing
  - Use `{userId}/{entryId}.md` naming convention

#### Frontend - Authentication
- [ ] **Custom Auth Pages with Amplify**
  - Install and configure AWS Amplify SDK
  - Create `Login.jsx` with email/password form
  - Create `Signup.jsx` with email/password/confirmation flow
  - Create `ForgotPassword.jsx` for password reset
  - Implement `ProtectedRoute.jsx` wrapper component
  - Store JWT in memory/localStorage and handle refresh tokens
  - Create `services/auth.js` with login, signup, logout, getCurrentUser functions

#### Frontend - Core UI
- [ ] **Project Setup**
  - Initialize React app with Vite
  - Install dependencies: React Router, Tailwind CSS, Lucide React, TipTap, AWS Amplify
  - Configure environment variables (`.env` file)
  - Set up routing: `/login`, `/signup`, `/`, `/entry/:id`

- [ ] **TipTap Rich Text Editor**
  - Install TipTap and required extensions (StarterKit, Link, etc.)
  - Create `MarkdownEditor.jsx` with TipTap integration
  - Create `FormattingToolbar.jsx` with buttons for:
    - Bold, Italic, Headers (H1-H6)
    - Bullet list, Ordered list
    - Blockquote, Code block
    - Link insert/edit
  - Configure TipTap to output markdown-compatible HTML
  - Implement markdown import/export utilities

- [ ] **Journal Entry Management**
  - Create `EntryList.jsx` - Display all entries in chronological order
  - Create `EntryCard.jsx` - Show entry preview (title, date, excerpt)
  - Create `EditorPage.jsx` - Full-screen editor view for entry
  - Create `Home.jsx` - Main page with entry list
  - Implement entry creation (new button → create entry → navigate to editor)
  - Implement entry deletion with confirmation dialog

- [ ] **Auto-Save Functionality**
  - Create `hooks/useAutoSave.js`
  - Implement debounced save (triggers 5 seconds after user stops typing)
  - Show save status indicator (saving... / saved / error)
  - Handle conflicts and errors gracefully

- [ ] **API Client**
  - Create `services/api.js` with Axios or Fetch
  - Implement functions: createEntry, getEntries, getEntry, updateEntry, deleteEntry
  - Add Authorization header with Cognito JWT
  - Handle 401 unauthorized (redirect to login)
  - Add error handling and retry logic

#### Testing & Deployment
- [ ] **Backend Deployment**
  - Run `sam build` and test locally with `sam local start-api`
  - Deploy to AWS: `sam deploy --guided`
  - Verify all endpoints work with authentication
  - Test S3 storage structure

- [ ] **Frontend Deployment**
  - Build production bundle: `npm run build`
  - Deploy to AWS Amplify Hosting or S3 + CloudFront
  - Configure custom domain (optional)
  - Test end-to-end: signup → login → create entry → edit → auto-save → list view

#### Phase 1 Deliverables
✅ Users can sign up and log in with email/password
✅ Users can create, edit, and delete journal entries
✅ Rich text editor with markdown formatting (bold, italic, headers, lists, links, quotes, code)
✅ Entries auto-save every 5 seconds
✅ Entries stored as markdown files in S3 (`users/{userId}/{entryId}.md`)
✅ Entry list view showing all user's entries chronologically
✅ Full AWS cloud infrastructure deployed and operational

---

### Phase 2: Enhanced Features
**Goal**: Add advanced organization, search, and data portability features

#### Search Functionality
- [ ] **Backend Search**
  - Create Lambda handler: `GET /search?q={query}`
  - Implement full-text search across user's entries (scan S3 objects)
  - Return matching entries with highlighted excerpts
  - Consider adding DynamoDB for faster search (store entry metadata)

- [ ] **Frontend Search**
  - Create `SearchBar.jsx` component
  - Add search input to navigation
  - Create search results page
  - Highlight matching text in results
  - Add keyboard shortcuts (Cmd/Ctrl + K)

#### Tags & Categories
- [ ] **Tagging System**
  - Update markdown files to include frontmatter with tags:
    ```yaml
    ---
    tags: [personal, work, ideas]
    date: 2025-01-13
    ---
    ```
  - Update Lambda handlers to parse and store frontmatter
  - Create tag management UI in editor
  - Add tag filtering to entry list
  - Create tag cloud or sidebar with all tags

#### Export & Import
- [ ] **Export Functionality**
  - Create Lambda handler: `GET /export` (returns zip of all entries)
  - Add "Export Journal" button to settings
  - Support exporting individual entries as `.md` files
  - Include metadata in exports (frontmatter)

- [ ] **Import Functionality**
  - Create Lambda handler: `POST /import` (accepts markdown files or zip)
  - Add "Import" button with file upload
  - Parse frontmatter from imported files
  - Handle duplicate entry names
  - Show import progress and results

#### Additional Enhancements
- [ ] **Date Management**
  - Add date picker to editor (backfill or change entry date)
  - Calendar view of entries (optional)
  - Filter entries by date range

- [ ] **Multi-Select Operations**
  - Add checkboxes to entry cards
  - Bulk delete selected entries
  - Bulk export selected entries
  - Bulk tag editing

- [ ] **Settings Page**
  - User profile management
  - Change password
  - Export/import controls
  - Auto-save interval configuration
  - Dark mode toggle (optional)

- [ ] **UI Polish**
  - Loading states and skeletons
  - Empty states (no entries yet)
  - Error boundaries
  - Responsive design improvements
  - Keyboard shortcuts documentation

#### Phase 2 Deliverables
✅ Full-text search across all journal entries
✅ Tag-based organization and filtering
✅ Export entire journal or individual entries
✅ Import markdown files from other sources
✅ Date backfill and management
✅ Multi-select bulk operations
✅ Polished, production-ready user experience

## Architecture

### Frontend Architecture
```
src/
├── components/
│   ├── Editor/
│   │   ├── MarkdownEditor.jsx      # Main editor component
│   │   ├── FormattingToolbar.jsx   # Formatting controls
│   │   └── EditorUtils.js          # Markdown parsing/formatting
│   ├── Journal/
│   │   ├── EntryList.jsx           # List of journal entries
│   │   ├── EntryCard.jsx           # Individual entry preview
│   │   └── SearchBar.jsx           # Search interface
│   ├── Navigation/
│   │   ├── Navbar.jsx              # Top navigation
│   │   └── Sidebar.jsx             # Side navigation
│   └── Auth/
│       ├── Login.jsx
│       └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx                    # Landing/entry list page
│   ├── EditorPage.jsx              # Full editor view
│   └── Settings.jsx                # User preferences
├── services/
│   ├── api.js                      # API client for backend
│   └── auth.js                     # Cognito authentication
├── hooks/
│   ├── useAutoSave.js              # Auto-save functionality
│   └── useJournalEntries.js        # Entry state management
└── utils/
    ├── markdown.js                 # Markdown utilities
    └── dateFormat.js               # Date formatting helpers
```

### Backend Architecture (AWS SAM)
```
template.yaml                       # SAM infrastructure definition
src/
├── handlers/
│   ├── entries/
│   │   ├── create.js              # POST /entries
│   │   ├── get.js                 # GET /entries/{id}
│   │   ├── list.js                # GET /entries
│   │   ├── update.js              # PUT /entries/{id}
│   │   └── delete.js              # DELETE /entries/{id}
│   ├── search/
│   │   └── search.js              # GET /search?q={query}
│   └── export/
│       └── export.js              # GET /export (download all)
└── layers/
    └── common/
        ├── s3Client.js            # S3 interaction utilities
        └── auth.js                # Authorization helpers
```

### Data Flow
1. User edits text in React editor component
2. Editor converts formatting to markdown syntax in real-time
3. Auto-save triggers PUT request to API Gateway
4. Lambda function receives update, validates user authorization
5. Entry saved to S3 as `{userId}/{entryId}.md`
6. Response confirms save, UI updates accordingly

### S3 Storage Structure
```
bucket-name/
└── users/
    └── {userId}/
        ├── 2025-01-13-morning-thoughts.md
        ├── 2025-01-12-weekend-plans.md
        └── 2025-01-10-work-reflection.md
```

## API Endpoints

| Method | Endpoint            | Description                                   |
| ------ | ------------------- | --------------------------------------------- |
| GET    | `/entries`          | List all entries for authenticated user       |
| GET    | `/entries/{id}`     | Get specific entry with full markdown content |
| POST   | `/entries`          | Create new journal entry                      |
| PUT    | `/entries/{id}`     | Update existing entry                         |
| DELETE | `/entries/{id}`     | Delete entry                                  |
| GET    | `/search?q={query}` | Search entries by text content or tags        |
| GET    | `/export`           | Export all entries as zip file                |

## Authentication Flow

1. User signs up/logs in via Cognito-hosted UI
2. Cognito returns JWT access token
3. Frontend stores token in localStorage
4. All API requests include `Authorization: Bearer {token}` header
5. API Gateway validates token with Cognito
6. Lambda functions receive validated user claims

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured with appropriate credentials
- SAM CLI installed
- AWS account with S3, Lambda, API Gateway, Cognito permissions

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Build SAM application
sam build

# Deploy to AWS (first time)
sam deploy --guided

# Deploy updates
sam deploy
```

### Environment Variables
Create `.env` file in frontend root:
```
VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_REGION=us-east-1
```

## Deployment

### Frontend
AWS Amplify Hosting
  - Connect GitHub repository
  - Automatic builds on push
  - Global CDN distribution

### Backend
- Deploy via SAM CLI
- API Gateway automatically created
- Lambda functions deployed from template.yaml
- S3 bucket for journal entries created automatically

## Future Enhancements

### Phase 1: UI
- [ ] UI with stubbed out backend integration

### Phase 2: Backend
- [ ] Define backend architecture
- [ ] Deploy backend to AWS
- [ ] Connect environtment variables to frontend
- [ ] Connect UI to backend

### Stretch Goals
- [ ] This day in history
- [ ] Calendar view of entries
- [ ] Rich media support (images, attachments)
- [ ] Daily prompts and writing templates
- [ ] Journal prompt chatbot
- [ ] Mobile app
- [ ] Version history for entries

## Cost Estimation

### Monthly costs (estimated for moderate use):
- **S3**: ~$0.10 (100MB storage, minimal requests)
- **Lambda**: ~$0.20 (1GB-seconds, within free tier for small usage)
- **API Gateway**: ~$0.35 (1M requests/month within free tier initially)
- **Cognito**: Free tier (50,000 MAUs)
- **Amplify Hosting**: ~$0.15/GB bandwidth (or free tier)

**Total**: ~$1-2/month for personal use, scales economically

## Security Considerations

- All API endpoints require authentication
- User can only access their own entries