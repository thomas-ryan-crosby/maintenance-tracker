# Firebase Storage Rules for Test Database

## Recommended Test Database Storage Rules

For the **test database** (`maintenance-tracker-test`), use permissive rules for development.

### Storage Rules (Test Database)

Go to Firebase Console → Storage → Rules, and use:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to all files for testing
    // ⚠️ WARNING: These rules are permissive for development only
    
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## Important Notes

⚠️ **These rules are for TEST/DEVELOPMENT ONLY**

- ✅ Safe to use in test database
- ✅ Allows easy testing of file uploads
- ❌ **NEVER use these rules in production**

## Production Storage Rules

For your **production database**, use the secure rules from `STORAGE_RULES.md` which restrict access to the `tickets/` folder.


