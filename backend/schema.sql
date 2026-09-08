CREATE DATABASE IF NOT EXISTS bus_depot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bus_depot;

CREATE TABLE depots (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, name VARCHAR(120) NOT NULL, address VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE employees (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, employee_id VARCHAR(32) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE, phone VARCHAR(20) NOT NULL, designation VARCHAR(50) NOT NULL,
  joining_date DATE NOT NULL, license_number VARCHAR(80) NULL, status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  depot_id BIGINT UNSIGNED NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_employee_depot FOREIGN KEY (depot_id) REFERENCES depots(id)
);
CREATE TABLE users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, employee_id BIGINT UNSIGNED NOT NULL UNIQUE, email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL, role ENUM('ADMIN','DEPOT_MANAGER','DRIVER','CONDUCTOR','MECHANIC') NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE, failed_login_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0, locked_until DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);
CREATE TABLE buses (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, registration_number VARCHAR(32) NOT NULL UNIQUE, model VARCHAR(100) NOT NULL,
  seating_capacity SMALLINT UNSIGNED NOT NULL, fuel_type VARCHAR(30) NOT NULL, status ENUM('AVAILABLE','ASSIGNED','UNDER_MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
  depot_id BIGINT UNSIGNED NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bus_depot FOREIGN KEY (depot_id) REFERENCES depots(id)
);
CREATE TABLE routes (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, route_code VARCHAR(32) NOT NULL UNIQUE, route_name VARCHAR(150) NOT NULL,
  start_point VARCHAR(100) NOT NULL, end_point VARCHAR(100) NOT NULL, stops JSON NULL, depot_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_route_depot FOREIGN KEY (depot_id) REFERENCES depots(id)
);
CREATE TABLE maintenance (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, bus_id BIGINT UNSIGNED NOT NULL, maintenance_type VARCHAR(100) NOT NULL, due_date DATE NOT NULL,
  status ENUM('PENDING','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'PENDING', parts_used TEXT NULL, cost DECIMAL(12,2) NOT NULL DEFAULT 0, remarks TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_maintenance_bus_status (bus_id,status), CONSTRAINT fk_maintenance_bus FOREIGN KEY (bus_id) REFERENCES buses(id)
);
CREATE TABLE duties (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, employee_id BIGINT UNSIGNED NOT NULL, bus_id BIGINT UNSIGNED NOT NULL, route_id BIGINT UNSIGNED NOT NULL,
  duty_date DATE NOT NULL, shift ENUM('MORNING','AFTERNOON','NIGHT') NOT NULL, start_time TIME NOT NULL, end_time TIME NOT NULL,
  status ENUM('ASSIGNED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'ASSIGNED', created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_duty_employee_date (employee_id,duty_date), INDEX idx_duty_bus_date (bus_id,duty_date),
  CONSTRAINT fk_duty_employee FOREIGN KEY (employee_id) REFERENCES employees(id), CONSTRAINT fk_duty_bus FOREIGN KEY (bus_id) REFERENCES buses(id),
  CONSTRAINT fk_duty_route FOREIGN KEY (route_id) REFERENCES routes(id), CONSTRAINT fk_duty_creator FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE TABLE attendance (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, employee_id BIGINT UNSIGNED NOT NULL, duty_id BIGINT UNSIGNED NOT NULL, attendance_date DATE NOT NULL,
  status ENUM('PRESENT','ABSENT','HALF_DAY') NOT NULL, marked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attendance_employee_date (employee_id,attendance_date), CONSTRAINT fk_att_employee FOREIGN KEY (employee_id) REFERENCES employees(id), CONSTRAINT fk_att_duty FOREIGN KEY (duty_id) REFERENCES duties(id)
);
CREATE TABLE leaves (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, employee_id BIGINT UNSIGNED NOT NULL, leave_type ENUM('CASUAL','SICK','EARNED') NOT NULL,
  start_date DATE NOT NULL, end_date DATE NOT NULL, reason TEXT NOT NULL, status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  approved_by BIGINT UNSIGNED NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_leave_employee_date (employee_id,start_date,end_date,status), CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees(id), CONSTRAINT fk_leave_approver FOREIGN KEY (approved_by) REFERENCES users(id)
);
CREATE TABLE leave_balances (employee_id BIGINT UNSIGNED PRIMARY KEY, casual_days DECIMAL(4,1) NOT NULL DEFAULT 12, sick_days DECIMAL(4,1) NOT NULL DEFAULT 10, earned_days DECIMAL(4,1) NOT NULL DEFAULT 15, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT fk_balance_employee FOREIGN KEY (employee_id) REFERENCES employees(id));
CREATE TABLE notifications (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL, type VARCHAR(40) NOT NULL, title VARCHAR(160) NOT NULL, message TEXT NOT NULL, is_read BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX idx_notification_user_read (user_id,is_read), CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id));
CREATE TABLE reports (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, report_type VARCHAR(40) NOT NULL, generated_by BIGINT UNSIGNED NOT NULL, filters JSON NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_report_user FOREIGN KEY (generated_by) REFERENCES users(id));
CREATE TABLE audit_logs (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, user_id BIGINT UNSIGNED NULL, action VARCHAR(80) NOT NULL, description TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX idx_audit_user_time (user_id,created_at), CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL);

INSERT INTO depots (name,address) VALUES ('Central Bus Depot, Pune','Pune, Maharashtra');
INSERT INTO employees (employee_id,name,email,phone,designation,joining_date,license_number,depot_id) VALUES
('MGR-001','Priya Sharma','manager@busworkforce.demo','9000000001','DEPOT_MANAGER','2023-01-01',NULL,1),
('DRV-001','Arjun Patil','driver1@busworkforce.demo','9000000002','DRIVER','2023-02-01','MH142023001',1),
('DRV-002','Rahul More','driver2@busworkforce.demo','9000000003','DRIVER','2023-03-01','MH142023002',1),
('CON-001','Neha Joshi','conductor1@busworkforce.demo','9000000004','CONDUCTOR','2023-04-01',NULL,1),
('CON-002','Sonal Kale','conductor2@busworkforce.demo','9000000005','CONDUCTOR','2023-05-01',NULL,1);
-- All seeded accounts use the documented demo password: password
INSERT INTO users (employee_id,email,password_hash,role) SELECT id,email,'$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',designation FROM employees;
INSERT INTO leave_balances (employee_id) SELECT id FROM employees;
INSERT INTO buses (registration_number,model,seating_capacity,fuel_type,depot_id) VALUES ('MH12AB1234','Tata Starbus',40,'Diesel',1),('MH12CD5678','Ashok Leyland',45,'CNG',1),('MH12EF9012','Tata Ultra',38,'Diesel',1);
INSERT INTO routes (route_code,route_name,start_point,end_point,stops,depot_id) VALUES ('R101','Depot–Hinjewadi','Central Depot','Hinjewadi','["Shivajinagar","FC Road"]',1),('R202','Depot–Katraj','Central Depot','Katraj','["Swargate","Bibwewadi"]',1);
