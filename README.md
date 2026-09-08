Smart Workforce and Operations Management System for Bus Depots

A responsive web application for managing bus depot workforce operations, including employee accounts, duty allocation, attendance, leave management, buses, routes, notifications, and reports.

Project Overview

The system is designed around three primary users for the current demonstration:

Depot Manager – manages employees, assigns duties, manages buses/routes, reviews leave, and monitors operations.

Driver – views assigned duties, marks attendance, applies for leave, and checks notifications/profile.

Conductor – views assigned duties, marks attendance, applies for leave, and checks notifications/profile.

The architecture is extensible for additional roles such as Admin and Mechanic.

Main Features

Public Website

Animated landing page

Bus/depot images and visual sections

Responsive design

Login and Sign Up pages

Light theme

Depot Manager

Dashboard

Employee management

Duty/shift allocation

Roster

Leave approval/rejection

Bus management

Route management

Maintenance status

Reports

Notifications

Driver / Conductor

Personal dashboard

Today's duty

Duty history

Attendance marking

Attendance history

Leave application

Leave balance

Notifications

Profile

Technology Stack

Frontend

React

Vite

Tailwind CSS

Framer Motion

React Router

Backend

Node.js

Express.js

REST APIs

JWT authentication

bcrypt/bcryptjs

dotenv

CORS

Database

PostgreSQL through Supabase / PostgreSQL-compatible connection

Relational schema with foreign keys and business relationships

Project Structure

smart-workforce-bus-depot/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── animations/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── schema.sql
│   ├── supabase-schema.sql
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md

Prerequisites

Install these before running the project:

Node.js 18+ recommended

npm

Git

A Supabase/PostgreSQL database for backend persistence

Check installations:

node --version
npm --version
git --version

1. Clone the Repository

git clone https://github.com/kaustubh082/smart-workforce-bus-depot.git
cd smart-workforce-bus-depot

2. Setup Frontend

Open a terminal in the project root:

cd frontend
npm install

Start the frontend:

npm run dev

Vite will display the local URL in the terminal, usually similar to:

http://localhost:5173

Open that URL in Chrome/Edge.

3. Setup Backend

Open a second terminal:

cd backend
npm install

Create:

backend/.env

Do NOT commit this file.

Copy the structure from:

backend/.env.example

Example:

PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d

Use your own real database connection string and JWT secret.

4. Start Backend

From:

smart-workforce-bus-depot/backend

run:

npm run dev

If the project is configured without a development script, use the start command defined in backend/package.json.

The backend health endpoint is:

GET /api/health

Typical local URL:

http://localhost:5000/api/health

5. Database Setup

The repository contains database schema files.

Before using the application with a new database:

Create a Supabase/PostgreSQL project.

Open the SQL editor.

Run the appropriate schema file:

backend/supabase-schema.sql for the Supabase/PostgreSQL setup.

Add the database connection string to backend/.env.

Start the backend.

Do not commit your database password, API secret, or real connection string.

6. Running Frontend and Backend Together

You need two terminals.

Terminal 1

cd smart-workforce-bus-depot/frontend
npm install
npm run dev

Terminal 2

cd smart-workforce-bus-depot/backend
npm install
npm run dev

Then open the frontend URL shown by Vite.

7. Important Environment Rules

Never commit:

backend/.env
frontend/.env

The repository already contains a .gitignore.

Safe to commit:

backend/.env.example

The example file should contain placeholders only.

8. API Overview

Main backend areas include:

/api/auth
/api/duties
/api/management
/api/workforce
/api/insights

Refer to:

backend/API.md

for the current endpoint documentation.

9. Main Data Relationships

The application uses a relational model.

Core entities include:

Users
Employees
Duties
Attendance
Leaves
Buses
Routes
Maintenance
Notifications
Reports
Audit Logs

Typical relationship:

Employee
   ├── Duties
   ├── Attendance
   └── Leaves

Bus
   ├── Duties
   └── Maintenance

Route
   └── Duties

A duty connects an employee with a bus, route, date, shift, and time.

10. Duty Allocation Workflow

The main Manager → Driver/Conductor interaction is:

Depot Manager logs in
        ↓
Select employee
        ↓
Select bus
        ↓
Select route
        ↓
Select date and shift
        ↓
Backend validates conflicts
        ↓
Duty saved in database
        ↓
Notification created
        ↓
Driver/Conductor logs in
        ↓
Assigned duty appears on dashboard

The backend should prevent invalid allocation such as:

assigning an employee who is on approved leave

overlapping employee duties

assigning a bus under maintenance

overlapping bus assignments

11. Authentication

The application uses authenticated accounts.

Typical flow:

Sign Up
   ↓
User account created
   ↓
Login
   ↓
JWT/session
   ↓
Role checked
   ↓
Role-specific dashboard

Primary roles:

DEPOT_MANAGER
DRIVER
CONDUCTOR

The backend should enforce authorization and not rely only on frontend route protection.

12. Development Notes for Teammates

When making changes:

Pull the latest code before starting.

Create a separate branch for larger changes.

Do not commit .env.

Do not commit node_modules.

Test both frontend and backend after changes.

Commit with a meaningful message.

Example:

git pull
git checkout -b feature/duty-allocation

After making changes:

git status
git add .
git commit -m "Implement duty allocation validation"
git push -u origin feature/duty-allocation

13. Troubleshooting

npm is blocked in PowerShell

If PowerShell shows an execution-policy error for npm.ps1, you can use Command Prompt instead or configure the current Windows user execution policy appropriately.

Port already in use

Change the backend port in:

backend/.env

Example:

PORT=5001

If the frontend API URL depends on the backend port, update that configuration as well.

Database connection failure

Check:

DATABASE_URL

database availability

network access

database credentials

Supabase project status

Frontend does not show backend data

Check:

Backend is running.

/api/health responds.

Frontend API base URL is correct.

Browser console for errors.

Backend terminal for request/database errors.

14. Academic Scope

This project is an academic Software Project Management implementation focused on practical bus depot workforce operations.

The current implementation intentionally avoids unnecessary complexity such as:

passenger ticketing

payment processing

GPS tracking

facial recognition

biometric attendance

AI-based route optimization

predictive analytics

15. Future Enhancements

Possible future additions include:

Dedicated native mobile application

GPS-based live bus tracking

Biometric attendance

Predictive maintenance

Payroll integration

Fuel and expense management

SMS/email notifications

16. Team

Project:

Smart Workforce and Operations Management System for Bus Depots

Team members:

Ameet Deshmukh

Hardik Moolchandani

Kaustubh Nahire

Repository

GitHub:

https://github.com/kaustubh082/smart-workforce-bus-depot
