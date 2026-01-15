# Shared Code

This directory contains models used by the frontend. The backend maintains its own copy in the Lambda layer.

## Directory Structure

```
shared/
└── models/
    ├── Entry.js        # Entry class (ES6 module)
    ├── index.js        # Barrel export
    └── USAGE.md        # Complete usage guide
```

## Architecture

### Frontend
The frontend imports directly from this shared directory:

```javascript
import { Entry } from '../../../shared/models/Entry';
```

### Backend (Lambda)
The backend has its own copy of the Entry class in the Lambda layer:

```
backend/src/layers/common/
├── Entry.js        # Entry class (copy)
├── s3Client.js     # S3 utilities
├── auth.js         # Auth utilities
├── index.js        # Barrel export
└── package.json    # ES module config
```

Lambda functions import from the layer at `/opt/nodejs/`:
```javascript
import { Entry } from '/opt/nodejs/Entry.js';
import { saveEntry, getEntry } from '/opt/nodejs/s3Client.js';
import { getUserId } from '/opt/nodejs/auth.js';
```

## Keeping Models in Sync

When modifying the Entry class, update both locations:
1. `shared/models/Entry.js` (frontend)
2. `backend/src/layers/common/Entry.js` (backend)

## ES6 Modules

Both frontend and backend use ES6 modules (`import/export`):

- **Backend**: Lambda layer has `"type": "module"` in package.json
- **Frontend**: Vite natively supports ES6 modules
