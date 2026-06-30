-- Sample Equipment Data for Dashboard Testing
-- Insert this data into your equipment_db database

-- First, let's insert some vendors
INSERT INTO vendor (vendor_id, vendor_name, contact_person, contact_email, contact_phone, address, city, state, country, postal_code, created_at, updated_at)
VALUES 
('VEN-001', 'TechEquip Solutions', 'John Smith', 'john@techequip.com', '+1-555-0101', '123 Tech St', 'New York', 'NY', 'USA', '10001', NOW(), NOW()),
('VEN-002', 'Industrial Systems Inc', 'Sarah Johnson', 'sarah@indsys.com', '+1-555-0102', '456 Industry Ave', 'Chicago', 'IL', 'USA', '60601', NOW(), NOW()),
('VEN-003', 'AutoMech Corp', 'Mike Davis', 'mike@automech.com', '+1-555-0103', '789 Auto Blvd', 'Detroit', 'MI', 'USA', '48201', NOW(), NOW());

-- Insert sample equipment with different categories
INSERT INTO equipment (equipment_id, equipment_name, category, installation_date, equipment_status, model, weight_kg, power_kw, capacity, vendor_id, vendor_name, contact_email, created_at, updated_at)
VALUES 
-- Electrical Equipment
('EQ-001', 'Main Power Transformer', 'Electrical', '2023-01-15', 'Operational', 'TX-5000', 2500.0, 500.0, '500 kW', 'VEN-001', 'TechEquip Solutions', 'john@techequip.com', NOW(), NOW()),
('EQ-002', 'Backup Generator', 'Electrical', '2023-02-20', 'Operational', 'GEN-3000', 1800.0, 300.0, '300 kW', 'VEN-001', 'TechEquip Solutions', 'john@techequip.com', NOW(), NOW()),
('EQ-003', 'Distribution Panel A', 'Electrical', '2023-03-10', 'Operational', 'DP-200', 150.0, 200.0, '200 kW', 'VEN-001', 'TechEquip Solutions', 'john@techequip.com', NOW(), NOW()),

-- Instrumentation Equipment
('EQ-004', 'Pressure Sensor PS-101', 'Instrumentation', '2023-01-25', 'Operational', 'PS-101', 5.0, 0.5, '0-100 bar', 'VEN-002', 'Industrial Systems Inc', 'sarah@indsys.com', NOW(), NOW()),
('EQ-005', 'Temperature Transmitter', 'Instrumentation', '2023-02-15', 'Operational', 'TT-202', 3.0, 0.3, '0-500°C', 'VEN-002', 'Industrial Systems Inc', 'sarah@indsys.com', NOW(), NOW()),
('EQ-006', 'Flow Meter FM-303', 'Instrumentation', '2023-03-20', 'Maintenance', 'FM-303', 8.0, 0.8, '0-1000 L/min', 'VEN-002', 'Industrial Systems Inc', 'sarah@indsys.com', NOW(), NOW()),

-- Automation Equipment
('EQ-007', 'PLC Controller', 'Automation', '2023-01-30', 'Operational', 'PLC-7000', 12.0, 2.0, '500 I/O points', 'VEN-003', 'AutoMech Corp', 'mike@automech.com', NOW(), NOW()),
('EQ-008', 'SCADA System', 'Automation', '2023-02-25', 'Operational', 'SCADA-X', 25.0, 5.0, '1000 tags', 'VEN-003', 'AutoMech Corp', 'mike@automech.com', NOW(), NOW()),

-- Mechanical Equipment
('EQ-009', 'Centrifugal Pump P-101', 'Mechanical', '2023-01-20', 'Operational', 'CP-500', 450.0, 75.0, '500 m³/h', 'VEN-002', 'Industrial Systems Inc', 'sarah@indsys.com', NOW(), NOW()),
('EQ-010', 'Conveyor Belt CB-201', 'Mechanical', '2023-02-10', 'Operational', 'CB-2000', 800.0, 50.0, '2000 kg/h', 'VEN-002', 'Industrial Systems Inc', 'sarah@indsys.com', NOW(), NOW()),
('EQ-011', 'Hydraulic Press', 'Mechanical', '2023-03-15', 'Operational', 'HP-1000', 3500.0, 100.0, '1000 tons', 'VEN-003', 'AutoMech Corp', 'mike@automech.com', NOW(), NOW()),
('EQ-012', 'Air Compressor', 'Mechanical', '2023-04-01', 'Maintenance', 'AC-750', 650.0, 75.0, '750 CFM', 'VEN-003', 'AutoMech Corp', 'mike@automech.com', NOW(), NOW()),

-- Heating & Cooling Equipment
('EQ-013', 'Industrial Chiller', 'Heating & Cooling', '2023-02-05', 'Operational', 'CH-2000', 1200.0, 150.0, '200 kW cooling', 'VEN-001', 'TechEquip Solutions', 'john@techequip.com', NOW(), NOW()),
('EQ-014', 'HVAC Unit HV-301', 'Heating & Cooling', '2023-03-01', 'Operational', 'HV-301', 500.0, 80.0, '80 kW', 'VEN-001', 'TechEquip Solutions', 'john@techequip.com', NOW(), NOW()),

-- Safety & Utilization Equipment
('EQ-015', 'Fire Suppression System', 'Safety & Utilization', '2023-01-10', 'Operational', 'FSS-500', 200.0, 10.0, '500 m² coverage', 'VEN-002', 'Industrial Systems Inc', 'sarah@indsys.com', NOW(), NOW()),
('EQ-016', 'Emergency Lighting', 'Safety & Utilization', '2023-02-01', 'Operational', 'EL-100', 50.0, 5.0, '100 fixtures', 'VEN-001', 'TechEquip Solutions', 'john@techequip.com', NOW(), NOW()),

-- Some decommissioned equipment
('EQ-017', 'Old Pump P-001', 'Mechanical', '2020-01-15', 'Decommissioned', 'OP-100', 300.0, 40.0, '200 m³/h', 'VEN-002', 'Industrial Systems Inc', 'sarah@indsys.com', NOW(), NOW()),
('EQ-018', 'Legacy Control Panel', 'Electrical', '2019-06-20', 'Decommissioned', 'LCP-50', 80.0, 50.0, '50 kW', 'VEN-001', 'TechEquip Solutions', 'john@techequip.com', NOW(), NOW());

-- Summary of inserted data:
-- Electrical: 3 Operational, 1 Decommissioned = 4 total
-- Instrumentation: 2 Operational, 1 Maintenance = 3 total
-- Automation: 2 Operational = 2 total
-- Mechanical: 3 Operational, 1 Maintenance, 1 Decommissioned = 5 total
-- Heating & Cooling: 2 Operational = 2 total
-- Safety & Utilization: 2 Operational = 2 total
-- TOTAL: 18 equipment items
