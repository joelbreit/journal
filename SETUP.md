# Journal App - Setup Guide

Quick start guide for setting up the development environment.

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- AWS CLI configured with credentials
- AWS SAM CLI installed

## Project Structure

```
journal/
├── frontend/          # React + Vite application
├── backend/           # AWS SAM serverless backend
├── CLAUDE.md          # Claude Code guidance
├── README.md          # Project documentation
└── SETUP.md          # This file
```

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Dependencies are already installed. If you need to reinstall:
```bash
npm install
```

3. Copy environment example:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Lambda layer dependencies:
```bash
cd src/layers/common/nodejs
npm install
cd ../../../../
```

3. Copy SAM config example:
```bash
cp samconfig.toml.example samconfig.toml
# Edit samconfig.toml with your AWS settings
```

4. Build the application:
```bash
sam build
```

5. Deploy to AWS:
```bash
sam deploy --guided
```

6. After deployment, copy the outputs to frontend/.env:
   - `ApiEndpoint` → `VITE_API_URL`
   - `UserPoolId` → `VITE_COGNITO_USER_POOL_ID`
   - `UserPoolClientId` → `VITE_COGNITO_CLIENT_ID`
   - `Region` → `VITE_REGION`

## Current Status

### ✅ Completed
- Project structure created
- Frontend scaffolded with React + Vite
- Dependencies installed (React Router, Tailwind, Lucide, TipTap, AWS Amplify, Axios)
- Tailwind CSS configured
- Backend SAM template created with all resources tagged `Project: journal`
- Lambda handler stubs created
- S3 and auth utility stubs created

### 🚧 Next Steps (Phase 1)
- Implement Lambda handlers (create, list, get, update, delete)
- Implement S3 client utilities
- Implement auth utilities
- Create React components:
  - Authentication pages (Login, Signup, ForgotPassword)
  - TipTap editor with formatting toolbar
  - Entry list and card components
  - API service layer
  - Auto-save hook
- Test end-to-end flow

## Development Workflow

1. **Start frontend dev server**: `cd frontend && npm run dev`
2. **Build backend**: `cd backend && sam build`
3. **Test locally**: `sam local start-api` (in backend directory)
4. **Deploy**: `sam deploy` (in backend directory)

## Useful Commands

### Frontend
```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

### Backend
```bash
sam build           # Build application
sam deploy          # Deploy to AWS
sam local start-api # Test locally
sam logs            # View CloudWatch logs
sam delete          # Delete stack
```

## Environment Variables

Frontend requires these variables in `.env`:
- `VITE_API_URL` - API Gateway endpoint
- `VITE_COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID` - Cognito App Client ID
- `VITE_REGION` - AWS Region

## Getting Help

- See `README.md` for full project documentation
- See `CLAUDE.md` for architecture guidance
- See `backend/README.md` for backend-specific details
- Refer to Phase 1 checklist in `README.md` for implementation order
