# Shared Code

This directory contains code shared between the frontend and backend.

## Directory Structure

```
shared/
└── models/
    ├── Entry.js        # Entry class (ES6 module)
    ├── index.js        # Barrel export
    └── USAGE.md        # Complete usage guide
```

## Why Shared?

Instead of maintaining duplicate Entry classes in both backend and frontend, we have a single source of truth that both import from. This ensures consistency and reduces maintenance burden.

## How It Works

### Backend (Lambda)
The backend Lambda layer's `nodejs/index.js` re-exports the shared Entry class:

```javascript
// backend/src/layers/common/nodejs/index.js
export { Entry } from '../../../../../shared/models/Entry.js';
```

Lambda functions import from `/opt/nodejs/`:
```javascript
import { Entry } from '/opt/nodejs/index.js';
```

### Frontend (React)
Frontend imports directly from the shared directory:

```javascript
import { Entry } from '../../../shared/models/Entry';
```

## ES6 Modules

Both backend and frontend use ES6 modules (`import/export`):

- **Backend**: Lambda layer has `"type": "module"` in package.json
- **Frontend**: Vite natively supports ES6 modules
- **Shared**: All code uses `export` syntax

## Adding New Shared Models

1. Create the model in `shared/models/YourModel.js`
2. Export it in `shared/models/index.js`
3. Update backend layer's `nodejs/index.js` to re-export it
4. Import from `/opt/nodejs/` (backend) or `../../../shared/models/` (frontend)

## Benefits

✅ Single source of truth
✅ No code duplication
✅ Consistent behavior across frontend/backend
✅ Easier to add new shared models
✅ Type-safe (can add TypeScript later)
