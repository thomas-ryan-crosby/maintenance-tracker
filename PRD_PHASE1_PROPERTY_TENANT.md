# Phase 1 PRD: Enhanced Property Profiles & Basic Tenant Management

**Version:** 1.0  
**Date:** 2024  
**Status:** Ready for Development  
**Priority:** Critical

---

## 1. Executive Summary

This document details the requirements for Phase 1 of the Property Management Platform expansion, focusing on enhanced property profiles and basic tenant management. This phase establishes the foundation for all future features by creating comprehensive property and tenant data models.

---

## 2. Objectives

### 2.1 Primary Goals
- Enhance property management with detailed property profiles
- Implement unit/space management for multi-unit properties
- Create a tenant database with flexible contact management
- Establish tenant-property associations
- Support multiple contacts per tenant with role classifications

### 2.2 Success Criteria
- All properties have detailed profiles with essential information
- Unit inventory can be managed for multi-unit properties
- Tenant records can be created and linked to properties/units
- Multiple contacts can be added to tenants with appropriate classifications
- Data model supports future lease and financial features

---

## 3. Enhanced Property Management

### 3.1 Property Profiles

#### 3.1.1 Property Information Fields

**Required Fields:**
- Property Name (existing)
- Property Address (existing)
- Property Type (existing: commercial, hoa, residential)
- Property Description (existing)

**New Required Fields:**
- Square Footage (number)
- Year Built (number)
- Number of Units/Spaces (number)
- Property Status (dropdown: Active, Inactive, Under Development)

**New Optional Fields:**
- Lot Size (number, acres or square feet)
- Number of Floors/Stories (number)
- Parking Spaces (number)
- Property Tax ID/Assessor Parcel Number (text)
- Property Owner Name (text)
- Property Owner Contact (text)

**Commercial-Specific Fields (shown only for commercial properties):**
- Building Number (existing in tickets, now at property level)
- Number of Buildings (number)
- Total Leasable Square Footage (number)
- Common Area Square Footage (number)

**Residential-Specific Fields (shown only for residential properties):**
- Number of Bedrooms (number, for single-family)
- Number of Bathrooms (number, for single-family)
- Property Subtype (dropdown: Single-Family, Multi-Family, Apartment Complex, Condo)

#### 3.1.2 Property Hierarchy

**Structure:**
- Portfolio (optional top level - for future)
- Property (current level)
- Building (for commercial/multi-building properties)
- Unit/Space (for multi-unit properties)

**Building Management:**
- Buildings can be added to properties
- Each building has:
  - Building Name/Number (text, required)
  - Building Address (text, optional - defaults to property address)
  - Number of Floors (number, optional)
  - Number of Units (number, optional)

#### 3.1.3 Property Status Tracking
- Active: Property is operational and being managed
- Inactive: Property is not currently being managed
- Under Development: Property is being developed/renovated

### 3.2 Unit/Space Management

#### 3.2.1 Unit Inventory

**Unit Fields:**
- Unit Number/Identifier (text, required) - e.g., "101", "Suite A", "Unit 1A"
- Unit Type (dropdown: Apartment, Office, Retail, Storage, Parking, Other)
- Square Footage (number, optional)
- Number of Bedrooms (number, for residential units)
- Number of Bathrooms (number, for residential units)
- Unit Status (dropdown: Occupied, Vacant, Maintenance, Reserved, Not Available)
- Building Association (dropdown, if property has multiple buildings)
- Floor Number (number, optional)
- Monthly Rent/Base Rate (number, optional - for quick reference)

**Unit Status Definitions:**
- **Occupied:** Currently leased/occupied by a tenant
- **Vacant:** Available for lease
- **Maintenance:** Under maintenance/repair, not available
- **Reserved:** Reserved for a specific tenant (lease pending)
- **Not Available:** Not available for lease (owner use, etc.)

#### 3.2.2 Unit History
- Track unit status changes over time
- Display current and past tenants
- Maintenance history (linked to work orders)

---

## 4. Basic Tenant Management

### 4.1 Tenant Database

#### 4.1.1 Tenant Information

**Required Fields:**
- Tenant Name (text) - Company name for commercial, individual name for residential
- Tenant Type (dropdown: Commercial, Residential)
- Tenant Status (dropdown: Active, Past, Prospect)
- At least one contact must be added (with at least one contact classification)

**Optional Fields:**
- Mailing Address (text) - if different from property address
- Tax ID/EIN (text) - for commercial tenants
- Notes (textarea) - general notes about the tenant

**Commercial Tenant Specific Fields:**
- Business Type/Industry (text)
- Number of Employees (number)
- Website (url)

**Residential Tenant Specific Fields:**
- Date of Birth (date, optional)

#### 4.1.2 Tenant Status

**Status Definitions:**
- **Active:** Currently has an active lease/occupancy
- **Past:** Previously occupied but no longer active
- **Prospect:** Potential tenant (lead/applicant)

#### 4.1.3 Tenant Contact Management

**Multiple Contacts Support:**
- Tenants can have unlimited contacts
- Each contact can have multiple classifications
- Contact classifications (checkboxes - multiple can be selected):
  - **Primary Contact:** Main point of contact
  - **Secondary Contact:** Backup/alternate contact
  - **Leasing Contact:** Contact for leasing-related matters
  - **Billing Contact:** Contact for billing and payment matters

**Contact Information (per contact):**
- Contact Name (text, required)
- Contact Email (email, optional)
- Contact Phone (text, optional)
- Contact Title/Position (text, optional) - e.g., "Property Manager", "Accounts Payable"
- Contact Classifications (checkboxes, at least one required)
- Contact Notes (textarea, optional) - notes specific to this contact

**Contact Management Features:**
- Add multiple contacts to a tenant
- Edit contact information
- Remove contacts
- View all contacts with their classifications
- Filter contacts by classification
- Contact history (future: communication log)

### 4.2 Tenant-Property Association

#### 4.2.1 Occupancy Linking
- Link tenant to specific property
- Link tenant to specific unit/space (if property has units)
- Support multiple tenants per unit (roommates, co-tenants)
- Support tenant with multiple units (commercial expansion)

#### 4.2.2 Occupancy History
- Track move-in dates
- Track move-out dates
- Display current occupancy
- Display past occupancies
- Occupancy timeline view

#### 4.2.3 Occupancy Details
- Move-in Date (date)
- Move-out Date (date, optional if active)
- Occupancy Status (Active, Past, Pending)
- Notes (textarea) - occupancy-specific notes

---

## 6. User Interface Requirements

### 6.1 Property Management UI

#### 6.1.1 Property List/View
- Enhanced property cards showing key information
- Property status indicators
- Quick actions (edit, view units, view tenants)
- Filter by property type, status
- Search functionality

#### 6.1.2 Property Detail View
- Comprehensive property information display
- Building list (if applicable)
- Unit list (if applicable)
- Associated tenants
- Property history/timeline

#### 6.1.3 Property Form
- Enhanced property creation/edit form
- Conditional fields based on property type
- Building management section
- Unit management section
- Form validation

### 6.2 Unit Management UI

#### 6.2.1 Unit List View
- Grid/list view of units
- Filter by status, building, type
- Quick status update
- Unit details modal/card

#### 6.2.2 Unit Detail View
- Complete unit information
- Current tenant information
- Unit history
- Associated work orders
- Quick actions

#### 6.2.3 Unit Form
- Unit creation/edit form
- Status management
- Feature selection
- Building association

### 6.3 Tenant Management UI

#### 6.3.1 Tenant List View
- Tenant directory/list
- Filter by status, type, property
- Search by name, email, phone
- Quick actions (edit, view property, view history)

#### 6.3.2 Tenant Detail View
- Complete tenant profile
- Contact information
- Current occupancies
- Occupancy history
- Associated work orders
- Notes and communication history

#### 6.3.3 Tenant Form
- Tenant creation/edit form
- Conditional fields based on tenant type
- Multiple contact management section
- Add/remove contacts
- Contact classification selection (checkboxes)
- Property/unit association
- Status management

---

## 7. Data Model

### 7.1 Property Schema (Enhanced)

```javascript
{
  id: string,
  name: string,
  address: string,
  propertyType: 'commercial' | 'hoa' | 'residential',
  description: string,
  squareFootage: number,
  yearBuilt: number,
  numberOfUnits: number,
  status: 'Active' | 'Inactive' | 'Under Development',
  lotSize: number | null,
  numberOfFloors: number | null,
  parkingSpaces: number | null,
  taxId: string | null,
  ownerName: string | null,
  ownerContact: string | null,
  // Commercial specific
  buildingNumber: string | null,
  numberOfBuildings: number | null,
  totalLeasableSqFt: number | null,
  commonAreaSqFt: number | null,
  // Residential specific
  numberOfBedrooms: number | null,
  numberOfBathrooms: number | null,
  propertySubtype: string | null,
  createdAt: timestamp,
  updatedAt: timestamp,
  organizationId: string
}
```

### 7.2 Building Schema

```javascript
{
  id: string,
  propertyId: string,
  buildingName: string,
  buildingAddress: string | null,
  numberOfFloors: number | null,
  numberOfUnits: number | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7.3 Unit Schema

```javascript
{
  id: string,
  propertyId: string,
  buildingId: string | null,
  unitNumber: string,
  unitType: 'Apartment' | 'Office' | 'Retail' | 'Storage' | 'Parking' | 'Other',
  squareFootage: number | null,
  numberOfBedrooms: number | null,
  numberOfBathrooms: number | null,
  floorNumber: number | null,
  status: 'Occupied' | 'Vacant' | 'Maintenance' | 'Reserved' | 'Not Available',
  monthlyRent: number | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7.4 Tenant Schema

```javascript
{
  id: string,
  tenantName: string,
  tenantType: 'Commercial' | 'Residential',
  status: 'Active' | 'Past' | 'Prospect',
  mailingAddress: string | null,
  taxId: string | null, // Commercial
  notes: string | null,
  // Commercial specific
  businessType: string | null,
  numberOfEmployees: number | null,
  website: string | null,
  // Residential specific
  dateOfBirth: timestamp | null,
  createdAt: timestamp,
  updatedAt: timestamp,
  organizationId: string
}
```

### 7.4.1 Tenant Contact Schema

```javascript
{
  id: string,
  tenantId: string,
  contactName: string,
  contactEmail: string | null,
  contactPhone: string | null,
  contactTitle: string | null,
  classifications: string[], // Array of: 'Primary', 'Secondary', 'Leasing', 'Billing'
  notes: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7.5 Occupancy Schema

```javascript
{
  id: string,
  tenantId: string,
  propertyId: string,
  unitId: string | null, // null if property has no units
  moveInDate: timestamp,
  moveOutDate: timestamp | null,
  status: 'Active' | 'Past' | 'Pending',
  notes: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```


---

## 8. Functional Requirements

### 8.1 Property Management

**FR-P1.1: Create Enhanced Property**
- User can create a property with all required fields
- Property type determines which fields are shown
- Form validates required fields
- Property is saved to database with organization association

**FR-P1.2: Edit Property**
- User can edit existing property information
- All fields are editable (based on permissions)
- Changes are saved and timestamped
- Property history is maintained

**FR-P1.3: View Property Details**
- User can view complete property information
- Property displays associated buildings (if any)
- Property displays associated units (if any)
- Property displays associated tenants
- Property displays work order summary

**FR-P1.4: Manage Buildings**
- User can add buildings to a property
- User can edit building information
- User can delete buildings (with validation)
- Building list displays on property detail view

**FR-P1.5: Manage Units**
- User can add units to a property
- User can edit unit information
- User can update unit status
- User can delete units (with validation)
- Unit list displays on property detail view
- Units can be filtered by status, building, type

### 8.2 Tenant Management

**FR-T1.1: Create Tenant**
- User can create a tenant record
- Tenant type determines which fields are shown
- Form validates required fields (at least one contact required)
- Tenant is saved to database with organization association

**FR-T1.2: Edit Tenant**
- User can edit existing tenant information
- All fields are editable
- Changes are saved and timestamped
- Tenant history is maintained

**FR-T1.3: View Tenant Details**
- User can view complete tenant profile
- Tenant displays all contacts with classifications
- Tenant displays current occupancies
- Tenant displays occupancy history
- Tenant displays associated work orders
- Tenant displays notes

**FR-T1.4: Manage Tenant Contacts**
- User can add multiple contacts to a tenant
- User can assign multiple classifications to each contact
- User can edit contact information
- User can remove contacts
- Contacts can be filtered by classification
- At least one contact must have "Primary Contact" classification

**FR-T1.5: Link Tenant to Property/Unit**
- User can create occupancy record
- User can link tenant to property
- User can link tenant to specific unit (if applicable)
- Multiple tenants can be linked to same unit
- Occupancy status is tracked

**FR-T1.6: Manage Occupancy**
- User can set move-in date
- User can set move-out date
- System updates unit status based on occupancy
- Occupancy history is maintained

---

## 9. Technical Requirements

### 9.1 Database
- Firestore collections: `properties`, `buildings`, `units`, `tenants`, `tenantContacts`, `occupancies`
- Proper indexing for queries
- Data validation rules
- Organization-level data isolation (for future use)

### 9.2 Security
- Data validation at form and database level
- Secure API endpoints
- Input sanitization

### 9.4 Performance
- Efficient queries with proper indexes
- Pagination for large lists
- Lazy loading where appropriate
- Optimistic UI updates

---

## 10. User Stories

### 10.1 Property Management

**US-P1:** As a property manager, I want to create a detailed property profile so that I have all property information in one place.

**US-P2:** As a property manager, I want to add buildings to a property so that I can manage multi-building properties.

**US-P3:** As a property manager, I want to create and manage units so that I can track individual spaces within a property.

**US-P4:** As a property manager, I want to update unit status so that I know which units are available for lease.

**US-P5:** As a property manager, I want to view all units for a property so that I can see the complete unit inventory.

### 10.2 Tenant Management

**US-T1:** As a property manager, I want to create tenant records so that I have contact information for all tenants.

**US-T2:** As a property manager, I want to add multiple contacts to a tenant so that I can reach the right person for different matters (leasing, billing, etc.).

**US-T3:** As a property manager, I want to assign contact classifications so that I know which contact to use for primary, secondary, leasing, or billing purposes.

**US-T4:** As a property manager, I want to link tenants to properties/units so that I know who occupies which space.

**US-T5:** As a property manager, I want to view tenant occupancy history so that I can see past and current occupancies.

**US-T6:** As a property manager, I want to search for tenants so that I can quickly find tenant information.

**US-T7:** As a property manager, I want to update tenant status so that I can track active, past, and prospect tenants.

---

## 11. Acceptance Criteria

### 11.1 Property Management
- ✅ Property can be created with all required fields
- ✅ Property type determines visible fields
- ✅ Buildings can be added to properties
- ✅ Units can be added to properties
- ✅ Unit status can be updated
- ✅ Property detail view shows all associated data

### 11.2 Tenant Management
- ✅ Tenant can be created with all required fields
- ✅ Tenant type determines visible fields
- ✅ Tenant can be linked to property/unit
- ✅ Occupancy history is tracked
- ✅ Tenant detail view shows all associated data

### 11.3 Tenant Contact Management
- ✅ Multiple contacts can be added to tenants
- ✅ Contact classifications can be assigned (multiple per contact)
- ✅ At least one primary contact is required
- ✅ Contacts can be filtered by classification

---

## 12. Out of Scope (Phase 1)

- Property photos and documents (marked not necessary)
- Property-specific settings and configurations (marked not necessary)
- Unit features/amenities (not necessary)
- User Management & Permissions (internal tool - not needed)
- Advanced search and filtering
- Bulk import/export
- Tenant portal features
- Communication history
- Document management
- Financial features
- Lease management

---

## 13. Implementation Notes

### 13.1 Data Migration
- Existing properties need to be enhanced with new fields
- Default values for new required fields
- Backward compatibility with existing data

### 13.2 UI/UX Considerations
- Maintain consistency with existing design
- Responsive design for mobile access
- Clear navigation between related entities
- Intuitive forms with helpful validation messages

### 13.3 Testing Requirements
- Unit tests for data models
- Integration tests for CRUD operations
- User acceptance testing
- Permission testing

---

## 14. Success Metrics

- 100% of properties have enhanced profiles
- All multi-unit properties have unit inventory
- 90% of tenants have records in system
- 100% of tenants have at least one contact with primary classification
- 100% of active occupancies are linked
- Multiple contacts can be added and classified appropriately

---

## 15. Next Steps

1. **Technical Design:** Create detailed technical specifications
2. **Database Schema:** Finalize Firestore collections and indexes
3. **UI Mockups:** Create wireframes for new interfaces
4. **Development:** Begin implementation
5. **Testing:** User acceptance testing
6. **Deployment:** Roll out Phase 1 features

---

**Note:** This PRD focuses on the core features needed for property profiles and tenant management. Additional features can be added in future iterations based on user feedback and priorities.

