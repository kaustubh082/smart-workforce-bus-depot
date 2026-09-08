# Bus Workforce API

All protected endpoints require `Authorization: Bearer <JWT>`. Responses are `{ "success": true, "data": ... }`; failures use `{ "success": false, "message": "..." }`.

| Endpoint | Access | Purpose |
|---|---|---|
| `POST /api/auth/register`, `POST /api/auth/login` | Public | Driver/conductor registration and credential login (`identifier`, `password`) |
| `GET /api/auth/me`, `POST /api/auth/logout` | Authenticated | Session identity and logout acknowledgement |
| `GET/POST/PUT /api/employees` | Manager/Admin | Employee directory and changes |
| `PATCH /api/employees/:id/status` | Manager/Admin | Activate/deactivate employee |
| `GET/POST/PUT /api/buses`, `/api/routes`, `/api/maintenance` | Manager/Admin | Operational resources |
| `GET/POST /api/duties`, `GET/PUT/DELETE /api/duties/:id` | Manager/Admin | Roster management |
| `GET /api/duties/my` | Authenticated | Current user's duties |
| `POST /api/attendance`, `GET /api/attendance/my` | Authenticated | Mark/view own attendance |
| `GET /api/attendance`, `/api/attendance/employee/:id` | Manager/Admin | Attendance reports |
| `POST /api/leaves`, `GET /api/leaves/my`, `/api/leaves/balance/my` | Authenticated | Leave application/history/balance |
| `GET /api/leaves/pending`, `PUT /api/leaves/:id/approve|reject` | Manager/Admin | Leave review |
| `GET /api/notifications/my`, `PATCH /api/notifications/:id/read`, `/api/notifications/read-all` | Authenticated | In-app notifications |
| `GET /api/dashboard/manager` | Manager/Admin | Manager aggregate data |
| `GET /api/dashboard/me` | Authenticated | Worker aggregate data |
| `GET /api/reports/duties|attendance|leaves|maintenance?from=YYYY-MM-DD&to=YYYY-MM-DD` | Manager/Admin | Export-ready records |

### Demo accounts

After importing `supabase-schema.sql`, use `manager@busworkforce.demo`, `driver1@busworkforce.demo`, or `conductor1@busworkforce.demo` with password `password`.
