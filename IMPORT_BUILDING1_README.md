# Building #1 Tenant Import Script

This script imports tenants, contacts, units, and occupancies from the CSV file for Building #1 only. It reconciles existing data and only creates/updates what's needed.

## Quick Start

### Option 1: Using Browser Console (Recommended)

1. Open your app in the browser (make sure you're logged in)
2. Open browser console (F12)
3. Copy the entire contents of `import_building1_tenants.js`
4. Paste it into the console and press Enter
5. Load your CSV file:
   ```javascript
   // Option A: Use file input helper
   createCSVFileInput(); // This will open a file picker
   
   // Option B: Paste CSV content directly
   CSV_CONTENT = `...paste your CSV content here...`;
   ```
6. Run the import (dry run first):
   ```javascript
   // Dry run (no data will be imported)
   CONFIG.performImport = false;
   await importBuilding1Tenants();
   
   // Review the output, then run for real:
   CONFIG.performImport = true;
   await importBuilding1Tenants();
   ```

### Option 2: Using HTML Page

1. Open `import_building1.html` in your browser
2. Click "Load CSV File" and select your CSV file
3. Review the configuration
4. Click "Run Dry Run" to preview what will be imported
5. If everything looks good, click "Run Import" to perform the actual import

## What the Script Does

1. **Finds Property**: Looks for "Sanctuary Office Park" property
2. **Finds/Creates Building**: Finds or creates Building #1
3. **Parses CSV**: Extracts tenant data from Building #1 section
4. **Reconciles Data**:
   - Matches existing tenants by name (case-insensitive)
   - Matches existing units by unit number
   - Matches existing contacts by name + email
5. **Imports Data**:
   - Creates/updates tenants
   - Creates/updates contacts (regular and brokers)
   - Creates/updates units (suites)
   - Creates/updates occupancies

## CSV Structure Expected

The script expects:
- Row 6: "Building #1" header
- Row 7+: Tenant data with columns:
  - Column 0: Company Name
  - Column 4: Suite Number
  - Column 18-20: Contact #1 (Name, Phone, Email)
  - Column 21-23: Contact #2 (Name, Phone, Email)
  - Column 30-32: Agent Contact #1 (Broker - Name, Phone, Email)
  - Column 33-35: Agent Contact #2 (Broker - Name, Phone, Email)
  - Column 36-38: Contact #3 (Name, Phone, Email)
  - Column 39-41: Contact #4 (Name, Phone, Email)
  - Column 42-44: Contact #5 (Name, Phone, Email)

## Configuration

You can modify these settings before running:

```javascript
CONFIG.propertyName = 'Sanctuary Office Park'; // Property to find
CONFIG.buildingNumber = '1'; // Building number
CONFIG.performImport = false; // Set to true to actually import
CONFIG.updateExisting = true; // Update existing records if found
```

## Reconciliation Logic

- **Tenants**: Matched by `tenantName` (case-insensitive)
- **Units**: Matched by `unitNumber` within the same building
- **Contacts**: Matched by `contactName` + `contactEmail` (case-insensitive)
- **Occupancies**: Matched by `tenantId` + `unitId`

## Notes

- The script handles multiple suite numbers (e.g., "302 + 303" creates two units)
- Agent contacts are automatically marked as "Tenant Representative" (brokers)
- Regular contacts are marked as "Primary" (Contact #1) or "Secondary" (Contact #2+)
- The script skips empty rows and summary rows
- Dates are parsed and converted to Firestore timestamps

## Troubleshooting

**CSV not loading:**
- Make sure you've loaded the CSV content into `CSV_CONTENT` variable
- Or use `createCSVFileInput()` to select the file

**Property not found:**
- Make sure "Sanctuary Office Park" property exists in your database
- Check the property name spelling

**Building not found:**
- The script will create Building #1 if it doesn't exist (if `performImport` is true)

**Import errors:**
- Check the console for detailed error messages
- Make sure you have proper permissions in Firestore
- Verify the CSV structure matches expected format
