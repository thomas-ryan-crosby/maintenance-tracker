/**
 * TENANT IMPORT SCRIPT - Browser Version
 * 
 * This script imports tenants, contacts, and occupancies from the JSON file
 * into Firestore. It automatically finds property and building IDs.
 * 
 * INSTRUCTIONS:
 * 1. Open your app in the browser (make sure you're on the test database)
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. The script will automatically:
 *    - Find "Sanctuary Office Park" property
 *    - Find or create buildings 1-5
 *    - Import all tenants, contacts, and occupancies
 * 
 * IMPORTANT: This will create real data in your database!
 */

async function importTenantsFromJSON() {
    console.log('=== TENANT IMPORT SCRIPT ===');
    console.log('Starting import process...\n');

    // Load JSON data
    let importData;
    try {
        const response = await fetch('./sanctuary_office_park_tenants_import.json');
        if (!response.ok) {
            throw new Error('Could not load JSON file. Make sure sanctuary_office_park_tenants_import.json is in the same directory.');
        }
        importData = await response.json();
        console.log(`✓ Loaded JSON file with ${importData.tenants.length} tenants\n`);
    } catch (error) {
        console.error('Error loading JSON:', error);
        alert('Error loading JSON file. Please check the console for details.');
        return;
    }

    // Step 1: Find or get property ID
    console.log('Step 1: Finding "Sanctuary Office Park" property...');
    let propertyId;
    try {
        const propertiesSnapshot = await db.collection('properties')
            .where('name', '==', 'Sanctuary Office Park')
            .get();

        if (propertiesSnapshot.empty) {
            console.error('❌ Property "Sanctuary Office Park" not found!');
            console.log('Please create the property first in the Properties page.');
            alert('Property "Sanctuary Office Park" not found. Please create it first.');
            return;
        }

        propertyId = propertiesSnapshot.docs[0].id;
        console.log(`✓ Found property: ${propertyId}\n`);
    } catch (error) {
        console.error('Error finding property:', error);
        alert('Error finding property: ' + error.message);
        return;
    }

    // Step 2: Find or create buildings
    console.log('Step 2: Finding or creating buildings...');
    const buildingIds = {};
    const buildingNames = {
        '1': 'Building 1',
        '2': 'Building 2',
        '3': 'Building 3',
        '4': 'Building 4',
        '5': 'Building 5'
    };

    try {
        // Get all existing buildings for this property
        const buildingsSnapshot = await db.collection('buildings')
            .where('propertyId', '==', propertyId)
            .get();

        const existingBuildings = {};
        buildingsSnapshot.forEach(doc => {
            const building = doc.data();
            // Try to match by name or number
            for (const [num, name] of Object.entries(buildingNames)) {
                if (building.buildingName === name || 
                    building.buildingName === `Building #${num}` ||
                    building.buildingName?.includes(num)) {
                    existingBuildings[num] = doc.id;
                }
            }
        });

        // Find or create each building
        for (const [num, name] of Object.entries(buildingNames)) {
            if (existingBuildings[num]) {
                buildingIds[num] = existingBuildings[num];
                console.log(`✓ Found Building ${num}: ${existingBuildings[num]}`);
            } else {
                // Create building
                const buildingDoc = {
                    propertyId: propertyId,
                    buildingName: name,
                    buildingAddress: null,
                    numberOfFloors: null,
                    numberOfUnits: null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                const buildingRef = await db.collection('buildings').add(buildingDoc);
                buildingIds[num] = buildingRef.id;
                console.log(`✓ Created Building ${num}: ${buildingRef.id}`);
            }
        }
        console.log('');
    } catch (error) {
        console.error('Error with buildings:', error);
        alert('Error finding/creating buildings: ' + error.message);
        return;
    }

    // Step 3: Import tenants
    console.log('Step 3: Importing tenants, contacts, and occupancies...\n');
    const { tenants } = importData;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < tenants.length; i++) {
        const tenantData = tenants[i];
        console.log(`[${i + 1}/${tenants.length}] Processing: ${tenantData.tenantName}`);

        try {
            // Create tenant
            const tenantDoc = {
                tenantName: tenantData.tenantName,
                tenantType: tenantData.tenantType || 'Commercial',
                status: tenantData.status || 'Active',
                mailingAddress: tenantData.mailingAddress || null,
                notes: tenantData.notes || null,
                taxId: tenantData.taxId || null,
                businessType: tenantData.businessType || null,
                numberOfEmployees: tenantData.numberOfEmployees || null,
                website: tenantData.website || null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const tenantRef = await db.collection('tenants').add(tenantDoc);
            console.log(`  ✓ Created tenant: ${tenantRef.id}`);

            // Create contacts
            for (const contact of tenantData.contacts || []) {
                // Skip contacts with no name or "TBD"
                if (!contact.contactName || contact.contactName.trim() === '' || contact.contactName === 'TBD') {
                    continue;
                }

                const contactDoc = {
                    tenantId: tenantRef.id,
                    contactName: contact.contactName,
                    contactEmail: contact.contactEmail || null,
                    contactPhone: contact.contactPhone || null,
                    contactTitle: contact.contactTitle || null,
                    classifications: contact.classifications || ['Secondary'],
                    notes: contact.notes || null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                await db.collection('tenantContacts').add(contactDoc);
                console.log(`    ✓ Created contact: ${contact.contactName}`);
            }

            // Create occupancies
            for (const occupancy of tenantData.occupancies || []) {
                const buildingNumber = occupancy.buildingNumber;
                if (!buildingNumber || !buildingIds[buildingNumber]) {
                    console.warn(`    ⚠ Skipping occupancy - Building ${buildingNumber} not found`);
                    continue;
                }

                const buildingId = buildingIds[buildingNumber];
                let unitId = null;

                // Find or create unit
                if (occupancy.unitNumber) {
                    const unitsSnapshot = await db.collection('units')
                        .where('propertyId', '==', propertyId)
                        .where('buildingId', '==', buildingId)
                        .where('unitNumber', '==', occupancy.unitNumber)
                        .get();

                    if (!unitsSnapshot.empty) {
                        unitId = unitsSnapshot.docs[0].id;
                    } else {
                        // Create unit
                        const unitDoc = {
                            propertyId: propertyId,
                            buildingId: buildingId,
                            unitNumber: occupancy.unitNumber,
                            unitType: 'Office',
                            unitStatus: 'Occupied',
                            unitSquareFootage: null,
                            unitFloorNumber: null,
                            unitNumberOfBedrooms: null,
                            unitNumberOfBathrooms: null,
                            unitMonthlyRent: null,
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
                    propertyId: propertyId,
                    unitId: unitId,
                    moveInDate: occupancy.moveInDate
                        ? firebase.firestore.Timestamp.fromDate(new Date(occupancy.moveInDate))
                        : null,
                    moveOutDate: occupancy.moveOutDate
                        ? firebase.firestore.Timestamp.fromDate(new Date(occupancy.moveOutDate))
                        : null,
                    status: occupancy.status || 'Active',
                    notes: occupancy.notes || null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                await db.collection('occupancies').add(occupancyDoc);
                console.log(`    ✓ Created occupancy: ${occupancy.unitNumber || 'Property Level'}`);
            }

            successCount++;
        } catch (error) {
            console.error(`  ✗ Error processing tenant ${tenantData.tenantName}:`, error);
            errorCount++;
        }
    }

    // Summary
    console.log('\n=== IMPORT COMPLETE ===');
    console.log(`✓ Successfully imported: ${successCount} tenants`);
    if (errorCount > 0) {
        console.log(`✗ Errors: ${errorCount} tenants`);
    }
    console.log('\nRefresh the page to see the imported data!');
    
    alert(`Import complete!\n\nSuccessfully imported: ${successCount} tenants\nErrors: ${errorCount}`);
}

// Make function available globally
window.importTenantsFromJSON = importTenantsFromJSON;

console.log('Import function ready!');
console.log('Run: importTenantsFromJSON()');
console.log('Or click the button in the UI if available.');

