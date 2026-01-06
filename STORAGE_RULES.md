# Firebase Storage Security Rules

## Current Rules (Test Mode)

The rules you have are the default test mode rules. They work for now but:

✅ **Pros:**
- Allow the app to function immediately
- Good for testing and development
- No authentication required

⚠️ **Cons:**
- Allow **anyone** to read/write to your Storage bucket
- Expire on February 5, 2026
- Not secure for production

## Recommended Rules for Your App

Since your app doesn't have authentication yet, here are two options:

### Option 1: Open Access (For Development/Testing)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to tickets folder
    match /tickets/{allPaths=**} {
      allow read, write: if true;
    }
    
    // Deny access to everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Pros:** More restrictive (only tickets folder), no expiration  
**Cons:** Still allows public access

### Option 2: Remove Expiration (Extend Test Mode)

If you want to keep the current open access but remove the expiration:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**Pros:** Simple, no expiration  
**Cons:** Allows public access to entire bucket

## Future: Production Rules (When You Add Authentication)

Once you add user authentication, use rules like:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tickets/{ticketId}/{fileName} {
      // Allow read if user is authenticated
      allow read: if request.auth != null;
      
      // Allow write if user is authenticated
      allow write: if request.auth != null
                   && request.resource.size < 20 * 1024 * 1024  // 20MB limit (Firebase supports up to 32MB for web)
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Recommendation

For now, use **Option 1** - it's more secure than your current rules because it:
- Only allows access to the `tickets/` folder
- Has no expiration date
- Still works without authentication

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **maintenancetracker-760ce**
3. Click **Storage** in the left sidebar
4. Click the **Rules** tab
5. Paste the rules you want
6. Click **Publish**

## Important Notes

- **Firebase Storage API keys are safe to expose** - security comes from rules, not hiding keys
- **Test your rules** after updating to make sure uploads still work
- **Monitor usage** in Firebase Console to watch for unexpected access

