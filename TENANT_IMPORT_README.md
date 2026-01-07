# Tenant Import from CSV

This directory contains scripts and data for importing tenant information from the Sanctuary Office Park CSV file into Firestore.

## Files

1. **`parse_tenant_csv.py`** - Python script that parses the CSV file and generates a JSON file
2. **`sanctuary_office_park_tenants_import.json`** - Generated JSON file containing all tenant data (REVIEW THIS BEFORE IMPORTING)
3. **`import_tenants_from_json.js`** - JavaScript import script (for browser console or Node.js)

## Process

### Step 1: Generate JSON File

The JSON file has already been generated. If you need to regenerate it:

```bash
python parse_tenant_csv.py
```

This will create/update `sanctuary_office_park_tenants_import.json`.

### Step 2: Review JSON File

**IMPORTANT:** Review the JSON file before importing to ensure:
- All tenant names are correct
- Contact information is accurate
- Building numbers are assigned correctly (some may be null if they appear before building headers)
- Dates are parsed correctly
- Suite/unit numbers are correct

### Step 3: Prepare for Import

Before importing, you need to:

1. **Get Property ID**: Find the Firestore document ID for "Sanctuary Office Park" property
2. **Get Building IDs**: Find or create building documents and get their IDs for Buildings 1-5
3. **Update Import Script**: Edit `import_tenants_from_json.js` and update:
   - `CONFIG.propertyId` - Your Sanctuary Office Park property ID
   - `CONFIG.buildingIds` - Map building numbers (1-5) to building document IDs

### Step 4: Import Data

#### Option A: Browser Console (Recommended for Testing)

1. Open your app in the browser
2. Open browser console (F12)
3. Copy the contents of `import_tenants_from_json.js`
4. Update the CONFIG values
5. Set `CONFIG.performImport = false` for a dry run first
6. Paste and run the script
7. Review the output
8. Set `CONFIG.performImport = true` and run again to perform actual import

#### Option B: Node.js with Firebase Admin

1. Install Firebase Admin SDK: `npm install firebase-admin`
2. Update the script to initialize Firebase Admin with your service account
3. Run: `node import_tenants_from_json.js`

## Data Mapping

### CSV Fields → Database Schema

| CSV Field | Database Field | Notes |
|-----------|---------------|-------|
| Company Name | `tenantName` | Direct mapping |
| Common Name | `notes` | Added to notes field |
| Suite # | `unitNumber` | Parsed (can be multiple) |
| Rentable SF | `notes` | Added to occupancy notes |
| RENT | `notes` | Added to occupancy notes |
| Initial Date Occupied | `moveInDate` | Parsed to ISO date |
| STATUS | `status` | "Occupied" → "Active" |
| Contact #1 | `contacts[0]` | Primary contact |
| Contact #2 | `contacts[1]` | Secondary contact |
| Agent Contact #1, #2 | `contacts[]` | Leasing contacts |
| Contact #3, #4, #5 | `contacts[]` | Additional contacts |
| Notes | `notes` | Combined with other info |
| Lease Expiration | `notes` | Added to notes |
| Insurance Info | `notes` | Added to notes |

### Contact Classifications

- **Contact #1** → Primary
- **Contact #2** → Secondary
- **Agent Contacts** → Leasing
- **Contact #3-5** → Secondary

## Notes

- Some building numbers may be `null` if tenants appear before building headers in CSV
- Dates are parsed automatically but may need manual correction for unusual formats
- Units will be created automatically if they don't exist
- The script creates tenants, contacts, and occupancies in separate collections

## Troubleshooting

### Building Numbers are Null
- Some tenants in the CSV appear before their building header
- You may need to manually update building numbers in the JSON or after import

### Dates Not Parsing
- Check the date format in the CSV
- Update the `parse_date()` function in `parse_tenant_csv.py` to handle additional formats

### Import Errors
- Check that property ID and building IDs are correct
- Ensure Firestore security rules allow writes
- Check browser console for specific error messages

## Safety

- The import script includes a dry-run mode (`CONFIG.performImport = false`)
- Always review the JSON file before importing
- Consider importing a small subset first to test
- Backup your database before importing

