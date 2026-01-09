# Firestore Security Rules for Test Database

## Recommended Test Database Rules

For the **test database** (`maintenance-tracker-test`), you can use more permissive rules during development, but still follow security best practices.

### Firestore Rules (Test Database)

Go to Firebase Console → Firestore Database → Rules, and use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for testing
    // ⚠️ WARNING: These rules are permissive for development only
    // Do NOT use these rules in production!
    
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Storage Rules (Test Database)

Go to Firebase Console → Storage → Rules, and use:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to all files for testing
    // ⚠️ WARNING: These rules are permissive for development only
    // Do NOT use these rules in production!
    
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## Important Notes

⚠️ **These rules are for TEST/DEVELOPMENT ONLY**

- ✅ Safe to use in test database
- ✅ Allows easy testing without authentication
- ❌ **NEVER use these rules in production**
- ❌ **NEVER commit these rules to production database**

## Production Rules

For your **production database** (`maintenance-tracker-760ce`), use the secure rules from `FIRESTORE_RULES.md` and `STORAGE_RULES.md`.

## Setting Up Rules

1. **For Test Database:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `maintenance-tracker-test`
   - Go to Firestore Database → Rules
   - Paste the test rules above
   - Click "Publish"
   - Repeat for Storage → Rules

2. **For Production Database:**
   - Select project: `maintenance-tracker-760ce`
   - Use the secure rules from the existing documentation
   - These should already be set up

## Verification

After setting up rules:

1. Test database should allow all operations (for development)
2. Production database should have secure rules (restricted access)
3. Both databases should be functional for their respective purposes


