# Entry Class Usage Guide

The `Entry` class is shared between frontend and backend, providing a consistent object-oriented interface for journal entries.

## Location

**Shared**: `/shared/models/Entry.js`

Both frontend and backend import from this single source of truth.

## Importing

### Backend (Lambda)
```javascript
import { Entry } from '/opt/nodejs/index.js';
// or
import { Entry } from '../../../../../shared/models/Entry.js';
```

### Frontend (React)
```javascript
import { Entry } from '../../../shared/models/Entry';
// or
import { Entry } from '../../../shared/models';
```

---

## Creating Entries

```javascript
// Create a new entry
const entry = new Entry({
  title: 'My Thoughts',
  content: '# Hello World\n\nToday was great!',
  date: new Date().toISOString()
});

console.log(entry.isNew()); // true (no id yet)
console.log(entry.title); // 'My Thoughts'
```

---

## Backend Usage

### Lambda Handlers

```javascript
// In create.js
import { Entry } from '/opt/nodejs/index.js';
import { saveEntry } from '/opt/nodejs/index.js';
import { getUserId } from '/opt/nodejs/index.js';

export const handler = async (event) => {
  const userId = getUserId(event);
  const { title, content, date } = JSON.parse(event.body);

  // Create Entry instance
  const entry = new Entry({
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    title,
    content,
    date
  });

  // Generate preview and validate
  entry.generatePreview();
  const validation = entry.validate();

  if (!validation.isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: validation.errors })
    };
  }

  // Save to S3
  await saveEntry(entry);

  return {
    statusCode: 201,
    body: JSON.stringify(entry.toJSON())
  };
};
```

### Loading from S3

```javascript
// In list.js - from S3 list response
import { Entry } from '/opt/nodejs/index.js';

const s3Objects = await listS3Objects(userId);
const entries = s3Objects.map(obj => Entry.fromS3Object(obj, userId));

// Sort by date descending
entries.sort((a, b) => new Date(b.date) - new Date(a.date));

// Return metadata only (no content)
return entries.map(e => e.toMetadata());
```

### S3 Client Integration

```javascript
// Updated s3Client.js - now accepts Entry instances
import { Entry } from '../../../../../shared/models/Entry.js';

export async function saveEntry(entry) {
  const key = `users/${entry.userId}/${entry.id}.md`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: entry.content,
    ContentType: 'text/markdown',
    Metadata: entry.toS3Metadata()
  });

  return await s3Client.send(command);
}

export async function getEntry(userId, entryId) {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `users/${userId}/${entryId}.md`
    })
  );

  const content = await response.Body.transformToString();
  return Entry.fromS3WithContent({ ...response, Body: content }, userId, entryId);
}
```

---

## Frontend Usage

### React Components

```javascript
import { useState, useEffect } from 'react';
import { Entry } from '../../../shared/models/Entry';
import { api } from '../services/api';

function EditorPage() {
  const [entry, setEntry] = useState(new Entry());

  // Load existing entry
  useEffect(() => {
    if (entryId && entryId !== 'new') {
      api.getEntry(entryId).then(loadedEntry => {
        setEntry(loadedEntry); // Entry instance
      });
    }
  }, [entryId]);

  // Update title (immutable pattern)
  const handleTitleChange = (newTitle) => {
    const updated = entry.clone();
    updated.title = newTitle;
    updated.touch();
    setEntry(updated);
  };

  // Save entry
  const handleSave = async () => {
    const validation = entry.validate();
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    if (entry.isNew()) {
      const created = await api.createEntry(entry);
      setEntry(created);
    } else {
      await api.updateEntry(entry);
    }
  };

  return (
    <div>
      <input
        value={entry.title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <div>{entry.getFormattedDate()} • {entry.getWordCount()} words</div>
      <button onClick={handleSave}>
        {entry.isNew() ? 'Create' : 'Save'}
      </button>
    </div>
  );
}
```

### Entry Lists

```javascript
import { Entry } from '../../../shared/models/Entry';
import { api } from '../services/api';

function EntryList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    api.getEntries().then(loadedEntries => {
      setEntries(loadedEntries); // Array of Entry instances
    });
  }, []);

  return (
    <div>
      {entries.map(entry => (
        <div key={entry.id}>
          <h3>{entry.title}</h3>
          <p>{entry.getRelativeTime()}</p>
          <p>{entry.preview}</p>
        </div>
      ))}
    </div>
  );
}
```

### API Integration

```javascript
// src/services/api.js
import { Entry } from '../../../shared/models/Entry';

export const api = {
  // Returns array of Entry instances
  async getEntries() {
    const response = await apiClient.get('/entries');
    return response.data.map(data => Entry.fromAPI(data));
  },

  // Returns Entry instance
  async getEntry(id) {
    const response = await apiClient.get(`/entries/${id}`);
    return Entry.fromAPI(response.data);
  },

  // Accepts Entry instance
  async createEntry(entry) {
    const response = await apiClient.post('/entries', entry.toJSON());
    return Entry.fromAPI(response.data);
  },

  // Accepts Entry instance
  async updateEntry(entry) {
    const response = await apiClient.put(`/entries/${entry.id}`, entry.toJSON());
    return Entry.fromAPI(response.data);
  }
};
```

---

## API Reference

### Constructor
```javascript
new Entry(data?: Partial<Entry>)
```

### Static Factory Methods
- `Entry.fromS3Object(s3Object, userId)` - Create from S3 metadata (backend)
- `Entry.fromS3WithContent(s3Response, userId, entryId)` - Create from S3 with content (backend)
- `Entry.fromAPI(apiData)` - Create from API response (frontend/backend)

### Instance Methods

**Content & Metadata**
- `generatePreview(maxLength?: number): string` - Generate preview from content
- `getWordCount(): number` - Count words in content
- `touch(): Entry` - Update timestamp
- `validate(): { isValid: boolean, errors: string[] }` - Validate entry

**Serialization**
- `toJSON(): object` - Full entry as plain object
- `toS3Metadata(): object` - S3 metadata object (backend)
- `toMetadata(): object` - Metadata only (no content)

**Display Helpers**
- `getFormattedDate(): string` - Format date as "January 14, 2026"
- `getRelativeTime(): string` - Format as "2 hours ago" (frontend)
- `isNew(): boolean` - Check if entry has no ID yet
- `clone(): Entry` - Create a copy (useful for React)
- `update(updates: Partial<Entry>): Entry` - Update multiple fields

---

## Examples

### Validation
```javascript
const entry = new Entry({
  userId: 'user-123',
  title: 'A'.repeat(300), // Too long!
  content: 'Hello'
});

const validation = entry.validate();
console.log(validation.isValid); // false
console.log(validation.errors); // ['title must be 200 characters or less']
```

### Preview Generation
```javascript
const entry = new Entry({
  content: '# My Day\n\nToday was **amazing**!'
});

entry.generatePreview(50);
console.log(entry.preview); // "My Day Today was amazing!"
```

### Cloning for Immutable Updates
```javascript
const entry = new Entry({ title: 'Original' });
const updated = entry.clone();
updated.title = 'Modified';

console.log(entry.title);   // 'Original' (unchanged)
console.log(updated.title); // 'Modified'
```

### Auto-Save Pattern
```javascript
function useAutoSave(entry, saveFunction, delay = 5000) {
  const [status, setStatus] = useState('saved');
  const timeoutRef = useRef(null);
  const previousEntry = useRef(entry);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Compare serialized entries
    if (JSON.stringify(entry.toJSON()) ===
        JSON.stringify(previousEntry.current.toJSON())) {
      return;
    }

    setStatus('pending');
    timeoutRef.current = setTimeout(async () => {
      setStatus('saving');
      try {
        await saveFunction(entry);
        setStatus('saved');
        previousEntry.current = entry.clone();
      } catch (error) {
        setStatus('error');
      }
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [entry, saveFunction, delay]);

  return status;
}
```
