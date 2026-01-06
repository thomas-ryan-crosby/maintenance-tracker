# Product Requirements Document: Maintenance Tracker System

## 1. Overview

### 1.1 Purpose
This document outlines the requirements for a simple, user-friendly maintenance tracker system designed for HOA (Homeowners Association) and Property Management use. The system will enable users to create, track, and manage maintenance tickets with minimal complexity.

### 1.2 Goals
- Provide an extremely simple interface for creating maintenance tickets
- Support multiple properties/HOAs in a single deployment
- Track work allocation and completion status
- Maintain a historical repository of completed work
- Deploy easily via GitHub Pages
- Store all data securely in Firebase

### 1.3 Target Users
- Property managers
- HOA board members
- Maintenance staff
- Property owners/residents (if applicable)

---

## 2. Product Scope

### 2.1 In Scope
- Single-button ticket creation
- Multi-property management (create, select, view properties)
- Ticket management (view, update, complete)
- Time allocation tracking
- Completion status tracking
- Personnel tracking (requested by, managed by, completed by)
- Completed work repository/history (per property)
- Firebase database integration
- GitHub Pages deployment

### 2.2 Out of Scope (Initial Release)
- User authentication/authorization (can be added later)
- Email notifications
- File attachments
- Property-level permissions/access control
- Reporting/analytics dashboard
- Mobile app

---

## 3. Functional Requirements

### 3.1 Property Management
**FR-1: Create Property**
- **Priority:** High
- **Description:** Users must be able to create and manage multiple properties
- **Acceptance Criteria:**
  - A "Manage Properties" or "Add Property" option is available
  - Property creation form includes:
    - Property Name (text input, required)
    - Property Address (text input, optional)
    - Property Description (text input, optional)
  - New properties are saved to Firebase
  - User receives visual confirmation of property creation
  - Properties can be edited or deleted (with confirmation)

**FR-2: Select Active Property**
- **Priority:** High
- **Description:** Users must be able to select which property they are working with
- **Acceptance Criteria:**
  - Property selector is visible on the main interface (dropdown or list)
  - Selected property is clearly displayed
  - All tickets and views are filtered to show only the selected property
  - Property selection persists during the session (can use localStorage)
  - Default property can be set if only one property exists

### 3.2 Ticket Creation
**FR-3: Create Maintenance Ticket**
- **Priority:** High
- **Description:** Users must be able to create a new maintenance ticket with a single action
- **Acceptance Criteria:**
  - A prominent "Create New Ticket" button is visible on the main interface
  - Clicking the button opens a simple form with required fields:
    - Property (auto-selected based on current selection, can be changed)
    - Work Description (text input, required)
    - Time Allocated (number input in hours, required)
    - Requested By (text input, required) - name of person who requested the work
    - Managed By (text input, required) - name of person managing the ticket
    - Completion Status (default: "Not Started" or "In Progress")
  - Form submission saves the ticket to Firebase with property association
  - User receives visual confirmation of successful ticket creation
  - Form can be cancelled/closed without saving

### 3.3 Ticket Management
**FR-4: View Active Tickets**
- **Priority:** High
- **Description:** Users must be able to view all active (incomplete) maintenance tickets for the selected property
- **Acceptance Criteria:**
  - Active tickets are displayed in a list or card view
  - Only tickets for the currently selected property are shown
  - Each ticket shows:
    - Property name (if viewing across properties)
    - Work description
    - Time allocated
    - Requested by (name)
    - Managed by (name)
    - Current status
    - Date created
  - Tickets are sorted by creation date (newest first) or status
  - Option to view all properties' tickets or filter by property

**FR-5: Update Ticket Status**
- **Priority:** High
- **Description:** Users must be able to mark tickets as completed
- **Acceptance Criteria:**
  - Each active ticket has a "Mark as Complete" button/action
  - When marking as complete, user is prompted to enter "Completed By" (name of person who completed the work)
  - "Completed By" field is required when marking ticket as complete
  - Upon completion, ticket moves from active list to completed repository
  - Completion date is automatically recorded
  - User receives confirmation of status change
  - Ticket remains associated with its property

**FR-6: Edit Ticket Details**
- **Priority:** Medium
- **Description:** Users must be able to edit ticket information before completion
- **Acceptance Criteria:**
  - Active tickets have an "Edit" option
  - Editable fields: Property (can be changed), Work description, Time allocated, Requested by, Managed by, Status
  - "Completed by" field is only editable after ticket is marked as complete
  - Changes are saved to Firebase
  - Edit history is not required for initial release

### 3.4 Completed Work Repository
**FR-7: View Completed Work**
- **Priority:** High
- **Description:** Users must be able to view all completed maintenance tickets for the selected property
- **Acceptance Criteria:**
  - Separate view/section for completed tickets
  - Only completed tickets for the currently selected property are shown by default
  - Each completed ticket displays:
    - Property name (if viewing across properties)
    - Work description
    - Time allocated
    - Requested by (name)
    - Managed by (name)
    - Completed by (name)
    - Date completed
    - Date created
  - Completed tickets are sorted by completion date (newest first)
  - Option to view all properties' completed tickets or filter by property
  - Search/filter functionality is optional for initial release

**FR-8: Archive Completed Tickets**
- **Priority:** Low
- **Description:** Completed tickets remain in the repository indefinitely
- **Acceptance Criteria:**
  - Completed tickets are not deleted automatically
  - Historical data is preserved for reference
  - Completed tickets maintain their property association

---

## 4. Technical Requirements

### 4.1 Technology Stack
- **Frontend:** HTML, CSS, JavaScript (vanilla or lightweight framework)
- **Backend/Database:** Firebase Realtime Database or Firestore
- **Hosting:** GitHub Pages
- **Version Control:** Git/GitHub

### 4.2 Data Model

#### Property Schema
```javascript
{
  id: string (auto-generated),
  name: string (required),
  address: string (optional),
  description: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Ticket Schema
```javascript
{
  id: string (auto-generated),
  propertyId: string (required, references Property.id),
  workDescription: string (required),
  timeAllocated: number (required, in hours),
  requestedBy: string (required, name of person who requested the work),
  managedBy: string (required, name of person managing the ticket),
  completedBy: string (nullable, name of person who completed the work),
  status: string (enum: "Not Started", "In Progress", "Completed"),
  dateCreated: timestamp,
  dateCompleted: timestamp (nullable),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4.3 Firebase Configuration
- **Database Structure:**
  ```
  /properties
    /{propertyId}
      - name
      - address
      - description
      - createdAt
      - updatedAt
  
  /tickets
    /{ticketId}
      - propertyId
      - workDescription
      - timeAllocated
      - requestedBy
      - managedBy
      - completedBy
      - status
      - dateCreated
      - dateCompleted
      - createdAt
      - updatedAt
  ```
- **Security Rules:** (To be defined based on authentication requirements)
  - Initial: Read/write access for all (can be restricted later)
  - Future: Property-level access control can be added

### 4.4 GitHub Pages Deployment
- **Requirements:**
  - Static site deployment
  - Firebase configuration included (API keys can be public for initial release)
  - No server-side code required
  - Responsive design for mobile/tablet viewing

---

## 5. User Interface Requirements

### 5.1 Design Principles
- **Simplicity:** Minimal clicks to complete actions
- **Clarity:** Clear visual hierarchy and status indicators
- **Accessibility:** Basic accessibility standards (WCAG 2.1 Level A minimum)
- **Responsiveness:** Works on desktop, tablet, and mobile devices

### 5.2 Key Screens/Views

#### 5.2.1 Main Dashboard
- **Elements:**
  - Property selector (dropdown or prominent selection area)
  - Current property indicator/display
  - "Manage Properties" button/link
  - Large, prominent "Create New Ticket" button
  - Section for "Active Tickets" (incomplete, filtered by selected property)
  - Section for "Completed Tickets" (with link/view toggle, filtered by selected property)
  - Simple navigation between views
  - Option to view "All Properties" or filter by specific property

#### 5.2.2 Property Management View
- **Elements:**
  - List of all properties
  - "Add New Property" button
  - Each property card shows:
    - Property name
    - Address (if provided)
    - Description (if provided)
    - "Edit" button
    - "Delete" button (with confirmation)
  - Property creation/edit form:
    - Property Name input (required)
    - Address input (optional)
    - Description text area (optional)
    - "Save" and "Cancel" buttons

#### 5.2.3 Ticket Creation Form
- **Elements:**
  - Property selector (pre-filled with currently selected property, can be changed)
  - Work Description text area (required)
  - Time Allocated number input (required)
  - Requested By text input (required) - name of person requesting the work
  - Managed By text input (required) - name of person managing the ticket
  - Status dropdown/selector (default: "Not Started")
  - "Save" and "Cancel" buttons
  - Form validation messages

#### 5.2.4 Active Tickets View
- **Elements:**
  - Property filter indicator (showing selected property or "All Properties")
  - List/card view of active tickets
  - Each ticket card shows:
    - Property name (if viewing all properties)
    - Work description (truncated if long)
    - Time allocated badge
    - Requested by (name badge or label)
    - Managed by (name badge or label)
    - Status badge
    - Date created
    - "Mark as Complete" button
    - "Edit" button
  - Empty state message if no active tickets
  - Option to filter by property if viewing all properties

#### 5.2.5 Completed Tickets View
- **Elements:**
  - Property filter indicator (showing selected property or "All Properties")
  - List/card view of completed tickets
  - Each ticket card shows:
    - Property name (if viewing all properties)
    - Work description
    - Time allocated
    - Requested by (name)
    - Managed by (name)
    - Completed by (name, highlighted or emphasized)
    - Date completed
    - Date created
  - Empty state message if no completed tickets
  - Option to filter by property if viewing all properties

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time: < 3 seconds on standard broadband
- Firebase operations: < 2 seconds for read/write operations
- Smooth transitions and feedback for user actions

### 6.2 Usability
- **Learnability:** New users should understand the system within 30 seconds
- **Efficiency:** Create a ticket in 3 clicks or less
- **Error Prevention:** Form validation prevents invalid submissions

### 6.3 Reliability
- Data persistence: 99.9% uptime (Firebase SLA)
- No data loss during normal operations
- Graceful error handling for network failures

### 6.4 Security
- Firebase security rules to be implemented (even if permissive initially)
- No sensitive data collection in initial release
- HTTPS only (GitHub Pages default)

---

## 7. User Stories

### Story 1: Manage Multiple Properties
**As a** property manager  
**I want to** create and manage multiple properties  
**So that** I can track maintenance for different properties/HOAs in one system

**Acceptance Criteria:**
- I can create a new property with a name and optional details
- I can see a list of all my properties
- I can select which property I'm currently working with
- I can edit or delete properties
- The selected property persists during my session

### Story 2: Create a Maintenance Ticket
**As a** property manager  
**I want to** quickly create a maintenance ticket for a specific property  
**So that** I can track work that needs to be done

**Acceptance Criteria:**
- I can select which property the ticket is for
- I can click a button to start creating a ticket
- I can enter what work needs to be done
- I can specify how much time is allocated
- I can enter who requested the work
- I can enter who is managing the ticket
- The ticket is saved and appears in my active tickets list for that property

### Story 3: Complete a Maintenance Ticket
**As a** property manager  
**I want to** mark a ticket as completed  
**So that** I can track finished work and move it to the completed repository

**Acceptance Criteria:**
- I can see all active tickets for the selected property (or all properties)
- I can click a button to mark a ticket as complete
- I am prompted to enter who completed the work
- The ticket moves from active to completed
- The completion date is recorded
- The person who completed the work is recorded
- The ticket remains associated with its property

### Story 4: View Completed Work History
**As a** property manager  
**I want to** view all completed maintenance work for a property  
**So that** I can reference past work and track maintenance history

**Acceptance Criteria:**
- I can access a completed work repository
- I can filter completed tickets by property
- I can see all previously completed tickets for the selected property
- I can see when work was completed and how much time was allocated
- I can see who requested the work, who managed it, and who completed it
- I can view completed work across all properties if needed

---

## 8. Success Metrics

### 8.1 User Engagement
- Number of tickets created per week/month
- Average time to create a ticket
- Percentage of tickets marked as completed

### 8.2 System Performance
- Average page load time
- Firebase operation success rate
- Error rate

### 8.3 User Satisfaction
- User feedback (qualitative)
- Ease of use rating (if feedback mechanism added)

---

## 9. Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
- Property creation and management
- Property selection/switch functionality
- Basic ticket creation form (with property association and personnel tracking)
- Active tickets list (filtered by property, showing personnel info)
- Mark ticket as complete (with completed by tracking)
- Completed tickets repository (filtered by property, showing all personnel info)
- Firebase integration
- GitHub Pages deployment

### Phase 2: Enhancements (Future)
- Ticket editing
- Status updates (Not Started → In Progress → Completed)
- Search/filter functionality
- Basic authentication
- Improved UI/UX polish

### Phase 3: Advanced Features (Future)
- User roles and permissions
- Email notifications
- File attachments
- Reporting and analytics
- Export functionality

---

## 10. Assumptions and Constraints

### 10.1 Assumptions
- Users have basic internet connectivity
- Users are familiar with web browsers
- Firebase free tier is sufficient for initial usage
- No authentication required for initial release (can be added later)
- Multiple properties/HOAs can be managed in a single deployment
- Users will manage multiple properties and need to switch between them

### 10.2 Constraints
- GitHub Pages only supports static sites (no server-side code)
- Firebase free tier limitations (if applicable)
- Browser compatibility (modern browsers: Chrome, Firefox, Safari, Edge)
- No offline functionality in initial release

---

## 11. Open Questions / Future Considerations

1. **Authentication:** Should there be user accounts, or is open access acceptable?
2. **Property Permissions:** Should different users have access to different properties?
3. **Notifications:** Should users receive email/SMS notifications?
4. **Reporting:** What kind of reports would be useful (time tracking, completion rates, per-property analytics)?
5. **Data Export:** Should users be able to export ticket data (per property or all properties)?
6. **Mobile App:** Is a native mobile app needed, or is responsive web sufficient?
7. **Property Templates:** Should there be common maintenance tasks that can be templated per property type?

---

## 12. Appendix

### 12.1 Glossary
- **Property:** A physical property, HOA, or managed location that requires maintenance tracking
- **Ticket:** A maintenance request/work item associated with a specific property
- **Active Ticket:** A ticket that has not been marked as completed
- **Completed Repository:** Collection of all completed maintenance tickets (can be filtered by property)
- **Time Allocated:** Estimated or planned hours for completing the work
- **Property Selection:** The currently active property that determines which tickets are displayed
- **Requested By:** The name of the person who requested the maintenance work
- **Managed By:** The name of the person responsible for managing/overseeing the ticket
- **Completed By:** The name of the person who completed the maintenance work

### 12.2 References
- Firebase Documentation: https://firebase.google.com/docs
- GitHub Pages Documentation: https://docs.github.com/pages
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

**Document Version:** 1.2  
**Last Updated:** [Current Date]  
**Author:** Product Team  
**Status:** Draft - Ready for Review  
**Changes in v1.1:** Added multi-property support throughout the document  
**Changes in v1.2:** Added personnel tracking (requested by, managed by, completed by) to tickets

