/**
 * ONE-TIME IMPORT SCRIPT
 * 
 * This script imports tenants, contacts, and occupancies from the JSON file
 * into Firestore. It should be run ONCE after reviewing the JSON file.
 * 
 * IMPORTANT:
 * 1. Review sanctuary_office_park_tenants_import.json before running
 * 2. Update the propertyId below to match your "Sanctuary Office Park" property ID
 * 3. This script will create tenants, contacts, and occupancies
 * 4. Run this in a Node.js environment with Firebase Admin SDK or in browser console
 * 
 * Usage (Browser Console):
 * 1. Open the app in browser
 * 2. Open browser console
 * 3. Copy and paste this entire script
 * 4. Review the output before proceeding
 * 
 * Usage (Node.js with Firebase Admin):
 * node import_tenants_from_json.js
 */

// CONFIGURATION - UPDATE THESE VALUES
const CONFIG = {
    // Property ID for "Sanctuary Office Park" - GET THIS FROM YOUR DATABASE
    propertyId: 'YOUR_PROPERTY_ID_HERE',
    
    // Building IDs mapping (building number -> building ID)
    // You'll need to get these from your database or create them
    buildingIds: {
        '1': 'YOUR_BUILDING_1_ID_HERE',
        '2': 'YOUR_BUILDING_2_ID_HERE',
        '3': 'YOUR_BUILDING_3_ID_HERE',
        '4': 'YOUR_BUILDING_4_ID_HERE',
        '5': 'YOUR_BUILDING_5_ID_HERE'
    },
    
    // Set to true to actually perform the import (false = dry run)
    performImport: false,
    
    // JSON file path (for Node.js) or load it manually in browser
    jsonFilePath: './sanctuary_office_park_tenants_import.json'
};

// Browser version - loads JSON from file input or fetch
async function importTenantsBrowser() {
    console.log('=== TENANT IMPORT SCRIPT ===');
    console.log('This will import tenants, contacts, and occupancies from JSON');
    console.log('CONFIG:', CONFIG);
    
    if (CONFIG.propertyId === 'YOUR_PROPERTY_ID_HERE') {
        console.error('ERROR: Please update CONFIG.propertyId with your actual property ID');
        return;
    }
    
    // Load JSON file
    let importData;
    try {
        // In browser, you'll need to load the JSON file manually
        // Option 1: Use fetch if JSON is served
        const response = await fetch(CONFIG.jsonFilePath);
        importData = await response.json();
        
        // Option 2: Or paste the JSON directly into a variable
        // importData = { ... paste JSON here ... };
    } catch (error) {
        console.error('Error loading JSON file:', error);
        console.log('Please load the JSON data manually into the importData variable');
        return;
    }
    
    const { tenants } = importData;
    console.log(`\nFound ${tenants.length} tenants to import`);
    
    if (!CONFIG.performImport) {
        console.log('\n=== DRY RUN MODE ===');
        console.log('Set CONFIG.performImport = true to perform actual import');
    }
    
    // Process each tenant
    for (let i = 0; i < tenants.length; i++) {
        const tenantData = tenants[i];
        console.log(`\n[${i + 1}/${tenants.length}] Processing: ${tenantData.tenantName}`);
        
        try {
            // 1. Create tenant
            const tenantDoc = {
                tenantName: tenantData.tenantName,
                tenantType: tenantData.tenantType,
                status: tenantData.status,
                mailingAddress: tenantData.mailingAddress,
                notes: tenantData.notes,
                taxId: tenantData.taxId,
                businessType: tenantData.businessType,
                numberOfEmployees: tenantData.numberOfEmployees,
                website: tenantData.website,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            if (CONFIG.performImport) {
                const tenantRef = await db.collection('tenants').add(tenantDoc);
                console.log(`  ✓ Created tenant: ${tenantRef.id}`);
                
                // 2. Create contacts
                for (const contact of tenantData.contacts || []) {
                    const contactDoc = {
                        tenantId: tenantRef.id,
                        contactName: contact.contactName,
                        contactEmail: contact.contactEmail,
                        contactPhone: contact.contactPhone,
                        contactTitle: contact.contactTitle,
                        classifications: contact.classifications,
                        notes: contact.notes,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    await db.collection('tenantContacts').add(contactDoc);
                    console.log(`    ✓ Created contact: ${contact.contactName}`);
                }
                
                // 3. Create occupancies
                for (const occupancy of tenantData.occupancies || []) {
                    const buildingId = CONFIG.buildingIds[occupancy.buildingNumber];
                    if (!buildingId) {
                        console.warn(`    ⚠ Skipping occupancy - Building ${occupancy.buildingNumber} ID not found`);
                        continue;
                    }
                    
                    // Find or create unit
                    let unitId = null;
                    if (occupancy.unitNumber) {
                        // Try to find existing unit
                        const unitsSnapshot = await db.collection('units')
                            .where('propertyId', '==', CONFIG.propertyId)
                            .where('buildingId', '==', buildingId)
                            .where('unitNumber', '==', occupancy.unitNumber)
                            .get();
                        
                        if (!unitsSnapshot.empty) {
                            unitId = unitsSnapshot.docs[0].id;
                        } else {
                            // Create unit if it doesn't exist
                            const unitDoc = {
                                propertyId: CONFIG.propertyId,
                                buildingId: buildingId,
                                unitNumber: occupancy.unitNumber,
                                unitType: 'Office',
                                unitStatus: 'Occupied',
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                            };
                            const unitRef = await db.collection('units').add(unitDoc);
                            unitId = unitRef.id;
                            console.log(`    ✓ Created unit: ${occupancy.unitNumber} (${unitId})`);
                        }
                    }
                    
                    // Create occupancy
                    const occupancyDoc = {
                        tenantId: tenantRef.id,
                        propertyId: CONFIG.propertyId,
                        unitId: unitId,
                        moveInDate: occupancy.moveInDate 
                            ? firebase.firestore.Timestamp.fromDate(new Date(occupancy.moveInDate))
                            : null,
                        moveOutDate: occupancy.moveOutDate
                            ? firebase.firestore.Timestamp.fromDate(new Date(occupancy.moveOutDate))
                            : null,
                        status: occupancy.status,
                        notes: occupancy.notes,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    await db.collection('occupancies').add(occupancyDoc);
                    console.log(`    ✓ Created occupancy: ${occupancy.unitNumber || 'Property Level'}`);
                }
            } else {
                console.log(`  [DRY RUN] Would create tenant with ${tenantData.contacts?.length || 0} contacts and ${tenantData.occupancies?.length || 0} occupancies`);
            }
        } catch (error) {
            console.error(`  ✗ Error processing tenant ${tenantData.tenantName}:`, error);
        }
    }
    
    console.log('\n=== IMPORT COMPLETE ===');
    if (!CONFIG.performImport) {
        console.log('This was a dry run. Set CONFIG.performImport = true to perform actual import.');
    }
}

// Node.js version (requires Firebase Admin SDK)
async function importTenantsNode() {
    const admin = require('firebase-admin');
    const fs = require('fs');
    
    // Initialize Firebase Admin (you'll need service account key)
    // admin.initializeApp({
    //     credential: admin.credential.cert('./path/to/serviceAccountKey.json')
    // });
    
    const db = admin.firestore();
    const importData = JSON.parse(fs.readFileSync(CONFIG.jsonFilePath, 'utf8'));
    
    // Similar logic as browser version but using admin SDK
    // ... (implementation similar to browser version)
}

// Run import
if (typeof window !== 'undefined') {
    // Browser environment
    window.importTenants = importTenantsBrowser;
    console.log('Import function available as: window.importTenants()');
    console.log('Make sure to update CONFIG values before running!');
} else {
    // Node.js environment
    importTenantsNode().catch(console.error);
}

