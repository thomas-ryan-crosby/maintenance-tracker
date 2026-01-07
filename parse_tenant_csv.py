#!/usr/bin/env python3
"""
Parse Sanctuary Office Park tenant CSV and generate JSON for database import.
This script creates a JSON file that can be reviewed before importing into Firestore.
"""

import csv
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional

def clean_phone(phone: str) -> Optional[str]:
    """Clean and format phone number."""
    if not phone or phone.strip() in ['-', 'TBD', '']:
        return None
    # Remove common formatting
    phone = re.sub(r'[^\d]', '', phone)
    if len(phone) == 10:
        return f"({phone[:3]}) {phone[3:6]}-{phone[6:]}"
    elif len(phone) == 11 and phone[0] == '1':
        return f"+1 ({phone[1:4]}) {phone[4:7]}-{phone[7:]}"
    return phone.strip()

def clean_email(email: str) -> Optional[str]:
    """Clean email address."""
    if not email or email.strip() in ['-', 'TBD', '']:
        return None
    email = email.strip().lower()
    if '@' in email:
        return email
    return None

def parse_date(date_str: str) -> Optional[str]:
    """Parse date string to ISO format."""
    if not date_str or date_str.strip() in ['-', 'TBD', 'N/A', 'MONTH TO MONTH', '']:
        return None
    
    date_str = date_str.strip()
    
    # Handle various date formats
    formats = [
        '%m/%d/%Y',
        '%m-%d-%Y',
        '%Y-%m-%d',
        '%m/%d/%y',
        '%m-%d-%y',
    ]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    return None

def parse_suite_numbers(suite_str: str) -> List[str]:
    """Parse suite numbers - can be single, multiple with +, or multi-line."""
    if not suite_str or suite_str.strip() in ['-', '']:
        return []
    
    # Handle multi-line (like "101 - 5,555\n102 - 1,400")
    if '\n' in suite_str:
        suites = []
        for line in suite_str.split('\n'):
            suite_part = line.split('-')[0].strip()
            if suite_part:
                suites.append(suite_part)
        return suites
    
    # Handle "302 + 303" format
    if '+' in suite_str:
        return [s.strip() for s in suite_str.split('+')]
    
    # Handle "302A 303" format
    if ' ' in suite_str and not any(c.isdigit() for c in suite_str.split()[1]):
        return [s.strip() for s in suite_str.split()]
    
    return [suite_str.strip()]

def clean_currency(value: str) -> Optional[float]:
    """Clean currency value."""
    if not value or value.strip() in ['-', 'TBD', '']:
        return None
    # Remove $ and commas
    cleaned = re.sub(r'[^\d.]', '', str(value))
    try:
        return float(cleaned)
    except ValueError:
        return None

def clean_number(value: str) -> Optional[int]:
    """Clean number value."""
    if not value or value.strip() in ['-', 'TBD', '']:
        return None
    # Remove commas
    cleaned = re.sub(r'[^\d]', '', str(value))
    try:
        return int(cleaned)
    except ValueError:
        return None

def determine_contact_classifications(contact_name: str, contact_index: int, is_agent: bool = False) -> List[str]:
    """Determine contact classifications based on position and context."""
    classifications = []
    
    if is_agent:
        classifications.append('Leasing')
    else:
        if contact_index == 0:
            classifications.append('Primary')
        elif contact_index == 1:
            classifications.append('Secondary')
        else:
            classifications.append('Secondary')
    
    # Check for billing indicators in name/email
    name_lower = contact_name.lower() if contact_name else ''
    if any(term in name_lower for term in ['cfo', 'accounting', 'finance', 'billing']):
        classifications.append('Billing')
    
    return classifications if classifications else ['Secondary']

def parse_csv_to_json(csv_file_path: str, output_json_path: str):
    """Parse CSV file and generate JSON for database import."""
    
    tenants_data = []
    current_building = None
    
    with open(csv_file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
    
    # Skip header rows (first 5 rows)
    data_rows = rows[5:]
    
    for row in data_rows:
        # Skip empty rows
        if not row or not row[0] or row[0].strip() == '':
            continue
        
        # Check for building header
        if 'Building #' in row[0]:
            # Extract building number (could be "Building #1" or "Building #2 Summary")
            building_match = re.search(r'Building #(\d+)', row[0])
            if building_match:
                current_building = building_match.group(1)
            continue
        
        # Skip summary rows
        if any(keyword in row[0] for keyword in ['Summary', 'Grand Summary', 'Rented Spaces', 'Vacant', 'Rent-able', 'Rented', 'Occupancy', 'VACANT', 'Janitorial', 'Annual']):
            continue
        
        company_name = row[0].strip() if len(row) > 0 else ''
        if not company_name or company_name == '-':
            continue
        
        common_name = row[1].strip() if len(row) > 1 and row[1] != '-' else None
        notes_field = row[3].strip() if len(row) > 3 and row[3] != '-' else None
        suite_number = row[4].strip() if len(row) > 4 and row[4] != '-' else None
        rentable_sf = clean_number(row[5]) if len(row) > 5 else None
        monthly_rent = clean_currency(row[6]) if len(row) > 6 else None
        price_per_sf = clean_currency(row[7]) if len(row) > 7 else None
        lease_commencement = row[8].strip() if len(row) > 8 and row[8] != '-' else None
        lease_expiration = row[9].strip() if len(row) > 9 and row[9] != '-' else None
        notice_days = clean_number(row[10]) if len(row) > 10 else None
        notice_date = row[11].strip() if len(row) > 11 and row[11] != '-' else None
        initial_date_occupied = row[13].strip() if len(row) > 13 and row[13] != '-' else None
        status = row[14].strip() if len(row) > 14 and row[14] != '-' else None
        office_number = row[15].strip() if len(row) > 15 and row[15] != '-' else None
        office_email = clean_email(row[16]) if len(row) > 16 else None
        fax = row[17].strip() if len(row) > 17 and row[17] != '-' else None
        
        # Contact #1
        contact1_name = row[18].strip() if len(row) > 18 and row[18] != '-' else None
        contact1_phone = clean_phone(row[19]) if len(row) > 19 else None
        contact1_email = clean_email(row[20]) if len(row) > 20 else None
        
        # Contact #2
        contact2_name = row[21].strip() if len(row) > 21 and row[21] != '-' else None
        contact2_phone = clean_phone(row[22]) if len(row) > 22 else None
        contact2_email = clean_email(row[23]) if len(row) > 23 else None
        
        # Additional fields
        rfr = row[24].strip() if len(row) > 24 and row[24] != '-' else None
        remaining_options = row[25].strip() if len(row) > 25 and row[25] != '-' else None
        escalations = row[26].strip() if len(row) > 26 and row[26] != '-' else None
        janitorial = clean_currency(row[27]) if len(row) > 27 else None
        insurance_valid_thru = row[28].strip() if len(row) > 28 and row[28] != '-' else None
        insurance_certificate_url = row[29].strip() if len(row) > 29 and row[29] != '-' else None
        has_insurance_cert = row[30].strip() if len(row) > 30 and row[30] != '-' else None
        
        # Agent Contact #1
        agent1_name = row[31].strip() if len(row) > 31 and row[31] != '-' else None
        agent1_phone = clean_phone(row[32]) if len(row) > 32 else None
        agent1_email = clean_email(row[33]) if len(row) > 33 else None
        
        # Agent Contact #2
        agent2_name = row[34].strip() if len(row) > 34 and row[34] != '-' else None
        agent2_phone = clean_phone(row[35]) if len(row) > 35 else None
        agent2_email = clean_email(row[36]) if len(row) > 36 else None
        
        # Contact #3, #4, #5
        contact3_name = row[37].strip() if len(row) > 37 and row[37] != '-' else None
        contact3_phone = clean_phone(row[38]) if len(row) > 38 else None
        contact3_email = clean_email(row[39]) if len(row) > 39 else None
        
        contact4_name = row[40].strip() if len(row) > 40 and row[40] != '-' else None
        contact4_phone = clean_phone(row[41]) if len(row) > 41 else None
        contact4_email = clean_email(row[42]) if len(row) > 42 else None
        
        contact5_name = row[43].strip() if len(row) > 43 and row[43] != '-' else None
        contact5_phone = clean_phone(row[44]) if len(row) > 44 else None
        contact5_email = clean_email(row[45]) if len(row) > 45 else None
        
        # Build tenant notes
        tenant_notes_parts = []
        if common_name and common_name != company_name:
            tenant_notes_parts.append(f"Common Name: {common_name}")
        if notes_field:
            tenant_notes_parts.append(f"Notes: {notes_field}")
        if lease_commencement and lease_commencement != 'N/A':
            tenant_notes_parts.append(f"Lease Commencement: {lease_commencement}")
        if lease_expiration and lease_expiration not in ['N/A', 'MONTH TO MONTH']:
            tenant_notes_parts.append(f"Lease Expiration: {lease_expiration}")
        if remaining_options:
            tenant_notes_parts.append(f"Remaining Options: {remaining_options}")
        if escalations:
            tenant_notes_parts.append(f"Escalations: {escalations}")
        if notice_days:
            tenant_notes_parts.append(f"Required Notice Days: {notice_days}")
        if insurance_valid_thru and insurance_valid_thru != 'TBD':
            tenant_notes_parts.append(f"Insurance Valid Through: {insurance_valid_thru}")
        if insurance_certificate_url:
            tenant_notes_parts.append(f"Insurance Certificate: {insurance_certificate_url}")
        
        tenant_notes = '\n'.join(tenant_notes_parts) if tenant_notes_parts else None
        
        # Determine tenant status
        tenant_status = 'Active' if status and 'Occupied' in status else 'Past'
        
        # Parse suite numbers
        suite_numbers = parse_suite_numbers(suite_number) if suite_number else []
        
        # Build contacts list
        contacts = []
        contact_index = 0
        
        # Contact #1
        if contact1_name:
            contacts.append({
                'contactName': contact1_name,
                'contactEmail': contact1_email,
                'contactPhone': contact1_phone,
                'contactTitle': None,  # Not in CSV
                'classifications': determine_contact_classifications(contact1_name, 0),
                'notes': None
            })
            contact_index += 1
        
        # Contact #2
        if contact2_name:
            contacts.append({
                'contactName': contact2_name,
                'contactEmail': contact2_email,
                'contactPhone': contact2_phone,
                'contactTitle': None,
                'classifications': determine_contact_classifications(contact2_name, 1),
                'notes': None
            })
            contact_index += 1
        
        # Agent Contact #1 (Leasing)
        if agent1_name:
            contacts.append({
                'contactName': agent1_name,
                'contactEmail': agent1_email,
                'contactPhone': agent1_phone,
                'contactTitle': 'Leasing Agent',
                'classifications': ['Leasing'],
                'notes': None
            })
        
        # Agent Contact #2 (Leasing)
        if agent2_name:
            contacts.append({
                'contactName': agent2_name,
                'contactEmail': agent2_email,
                'contactPhone': agent2_phone,
                'contactTitle': 'Leasing Agent',
                'classifications': ['Leasing'],
                'notes': None
            })
        
        # Contact #3, #4, #5
        for name, phone, email in [(contact3_name, contact3_phone, contact3_email),
                                    (contact4_name, contact4_phone, contact4_email),
                                    (contact5_name, contact5_phone, contact5_email)]:
            if name:
                contacts.append({
                    'contactName': name,
                    'contactEmail': email,
                    'contactPhone': phone,
                    'contactTitle': None,
                    'classifications': ['Secondary'],
                    'notes': None
                })
        
        # Create tenant object
        tenant = {
            'tenantName': company_name,
            'tenantType': 'Commercial',
            'status': tenant_status,
            'mailingAddress': None,  # Not in CSV
            'notes': tenant_notes,
            'taxId': None,  # Not in CSV
            'businessType': None,  # Could infer from name, but not explicit
            'numberOfEmployees': None,  # Not in CSV
            'website': None,  # Not in CSV
            'contacts': contacts,
            'occupancies': []
        }
        
        # Create occupancies for each suite
        move_in_date = parse_date(initial_date_occupied) if initial_date_occupied else None
        move_out_date = None  # Not in CSV, would need to check lease expiration
        
        # If no suites, create property-level occupancy
        if not suite_numbers:
            occupancy = {
                'propertyName': 'Sanctuary Office Park',  # Will need to match property ID
                'buildingNumber': current_building,
                'unitNumber': None,
                'moveInDate': move_in_date,
                'moveOutDate': move_out_date,
                'status': tenant_status,
                'notes': f"Rentable SF: {rentable_sf}, Monthly Rent: ${monthly_rent}, Price per SF: ${price_per_sf}" if rentable_sf or monthly_rent else None
            }
            tenant['occupancies'].append(occupancy)
        else:
            for suite in suite_numbers:
                occupancy = {
                    'propertyName': 'Sanctuary Office Park',
                    'buildingNumber': current_building,
                    'unitNumber': suite,
                    'moveInDate': move_in_date,
                    'moveOutDate': move_out_date,
                    'status': tenant_status,
                    'notes': f"Rentable SF: {rentable_sf}, Monthly Rent: ${monthly_rent}, Price per SF: ${price_per_sf}" if rentable_sf or monthly_rent else None
                }
                tenant['occupancies'].append(occupancy)
        
        tenants_data.append(tenant)
    
    # Create output structure
    output = {
        'metadata': {
            'sourceFile': csv_file_path,
            'generatedAt': datetime.now().isoformat(),
            'totalTenants': len(tenants_data),
            'note': 'This JSON file should be reviewed before importing into Firestore. Property IDs and Unit IDs will need to be resolved during import.'
        },
        'tenants': tenants_data
    }
    
    # Write JSON file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully parsed {len(tenants_data)} tenants")
    print(f"JSON file created: {output_json_path}")
    print(f"\nIMPORTANT: Review the JSON file before importing!")
    print(f"   - Property ID for 'Sanctuary Office Park' will need to be resolved")
    print(f"   - Building IDs will need to be resolved")
    print(f"   - Unit IDs will need to be resolved or created")
    print(f"   - Some dates may need manual correction")

if __name__ == '__main__':
    import sys
    
    csv_file = r'c:\Users\thoma\Downloads\Sanctuary Office Park_CONTROLLER_Source - Office Park Controller (2).csv'
    json_file = 'sanctuary_office_park_tenants_import.json'
    
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
    if len(sys.argv) > 2:
        json_file = sys.argv[2]
    
    parse_csv_to_json(csv_file, json_file)

