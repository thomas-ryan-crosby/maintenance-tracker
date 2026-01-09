# Test Database Setup Guide

## Getting Client-Side Configuration

The file you provided (`maintenance-tracker-test-firebase-adminsdk-*.json`) is a **service account key** for server-side/admin operations. For the web app, we need the **client-side configuration**.

### Steps to Get Client Configuration:

1. **Go to Firebase Console:**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Select project: **maintenance-tracker-test**

2. **Get Web App Configuration:**
   - Click the gear icon (⚙️) → Project Settings
   - Scroll down to "Your apps" section
   - If you don't have a web app yet:
     - Click the web icon (`</>`)
     - Register app (name it "Maintenance Tracker Test")
     - Copy the configuration
   - If you already have a web app:
     - Click on it to see the configuration
     - Copy the `firebaseConfig` object

3. **Update `firebase-config.test.js`:**
   - Open `firebase-config.test.js`
   - Replace the placeholder values with your actual config:
     ```javascript
     const firebaseConfig = {
         apiKey: "YOUR_ACTUAL_API_KEY",
         authDomain: "maintenance-tracker-test.firebaseapp.com",
         projectId: "maintenance-tracker-test",
         storageBucket: "maintenance-tracker-test.firebasestorage.app",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID"
     };
     ```

## Setting Up Firestore Database

1. **Enable Firestore:**
   - In Firebase Console → `maintenance-tracker-test` project
   - Go to "Firestore Database"
   - Click "Create Database"
   - Choose "Start in test mode" (for development)
   - Select your preferred location (same as production if possible)

2. **Set Firestore Rules:**
   - Go to Firestore Database → Rules
   - Use the rules from `FIRESTORE_RULES_TEST.md`
   - Click "Publish"

## Setting Up Storage

1. **Enable Storage:**
   - In Firebase Console → `maintenance-tracker-test` project
   - Go to "Storage"
   - Click "Get Started"
   - Choose "Start in test mode" (for development)
   - Use the same location as Firestore

2. **Set Storage Rules:**
   - Go to Storage → Rules
   - Use the rules from `STORAGE_RULES_TEST.md`
   - Click "Publish"

## Verification Checklist

- [ ] Client-side config copied to `firebase-config.test.js`
- [ ] Firestore Database created and enabled
- [ ] Firestore Rules set (test mode)
- [ ] Storage enabled
- [ ] Storage Rules set (test mode)
- [ ] Test locally: `http://localhost:8000` should connect to test database
- [ ] Check browser console for: `🔥 Firebase initialized with TEST/DEVELOPMENT database`

## Service Account Key (What You Provided)

The service account key you provided is for:
- Server-side operations
- Admin SDK operations
- Automated scripts
- Backend services

**You don't need it for the web app**, but keep it secure if you plan to use it for:
- Data migration scripts
- Backup operations
- Admin tools

## Next Steps

1. Get the client-side config from Firebase Console
2. Update `firebase-config.test.js` with the real values
3. Set up Firestore and Storage rules as described above
4. Test locally to verify connection


