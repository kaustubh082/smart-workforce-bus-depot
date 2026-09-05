// =========================================
// Mock Data — Replace each section with API calls later
// All IDs are strings to match future DB UUIDs
// =========================================

export const MOCK_USERS = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'manager@depot.com',
        password: 'manager123',
        role: 'manager',
        employeeId: 'MGR-001',
        phone: '9876543210',
        depot: 'Central Bus Depot, Pune',
        joinedDate: '2018-04-01',
        avatar: null,
    },
    {
        id: '2',
        name: 'Suresh Patil',
        email: 'driver@depot.com',
        password: 'driver123',
        role: 'driver',
        employeeId: 'DRV-042',
        phone: '9823456789',
        licenseNo: 'MH12-20180045',
        depot: 'Central Bus Depot, Pune',
        joinedDate: '2019-08-15',
        avatar: null,
    },
    {
        id: '3',
        name: 'Anita Deshmukh',
        email: 'conductor@depot.com',
        password: 'conductor123',
        role: 'conductor',
        employeeId: 'CON-019',
        phone: '9712345678',
        depot: 'Central Bus Depot, Pune',
        joinedDate: '2020-03-10',
        avatar: null,
    },
];

export const MOCK_EMPLOYEES = [
    { id: '1', name: 'Rajesh Kumar', employeeId: 'MGR-001', role: 'manager', status: 'active', phone: '9876543210', joinedDate: '2018-04-01', shift: 'Morning' },
    { id: '2', name: 'Suresh Patil', employeeId: 'DRV-042', role: 'driver', status: 'active', phone: '9823456789', joinedDate: '2019-08-15', shift: 'Morning' },
    { id: '3', name: 'Anita Deshmukh', employeeId: 'CON-019', role: 'conductor', status: 'active', phone: '9712345678', joinedDate: '2020-03-10', shift: 'Afternoon' },
    { id: '4', name: 'Manoj Shinde', employeeId: 'DRV-043', role: 'driver', status: 'active', phone: '9811234567', joinedDate: '2021-01-20', shift: 'Night' },
    { id: '5', name: 'Priya Joshi', employeeId: 'CON-020', role: 'conductor', status: 'on-leave', phone: '9900112233', joinedDate: '2021-06-01', shift: 'Morning' },
    { id: '6', name: 'Vikram Rao', employeeId: 'DRV-044', role: 'driver', status: 'active', phone: '9988776655', joinedDate: '2022-03-15', shift: 'Afternoon' },
    { id: '7', name: 'Sunita Ninawe', employeeId: 'CON-021', role: 'conductor', status: 'active', phone: '9765432100', joinedDate: '2022-07-22', shift: 'Afternoon' },
    { id: '8', name: 'Deepak More', employeeId: 'DRV-045', role: 'driver', status: 'inactive', phone: '9654321098', joinedDate: '2017-11-05', shift: 'Night' },
];

export const MOCK_BUSES = [
    { id: 'B01', regNo: 'MH-12-AB-1001', model: 'Tata Starbus 9m', capacity: 55, status: 'operational', km: 128450, lastMaintenance: '2026-08-10', route: 'Route 15-A' },
    { id: 'B02', regNo: 'MH-12-AB-1002', model: 'Ashok Leyland 12m', capacity: 72, status: 'operational', km: 98760, lastMaintenance: '2026-08-22', route: 'Route 22-B' },
    { id: 'B03', regNo: 'MH-12-AB-1003', model: 'Tata Starbus 12m', capacity: 72, status: 'maintenance', km: 215000, lastMaintenance: '2026-09-01', route: '-' },
    { id: 'B04', regNo: 'MH-12-AC-2001', model: 'Volvo 8400', capacity: 45, status: 'operational', km: 67890, lastMaintenance: '2026-07-30', route: 'Route 5-X' },
    { id: 'B05', regNo: 'MH-12-AC-2002', model: 'Eicher Intercity', capacity: 52, status: 'operational', km: 155320, lastMaintenance: '2026-08-15', route: 'Route 33-C' },
    { id: 'B06', regNo: 'MH-12-AD-3001', model: 'Tata Starbus 9m', capacity: 55, status: 'out-of-service', km: 312000, lastMaintenance: '2026-06-01', route: '-' },
];

export const MOCK_ROUTES = [
    { id: 'R01', routeNo: '15-A', origin: 'Shivajinagar', destination: 'Hadapsar', distance: 18.4, stops: 14, frequency: '10 min', status: 'active' },
    { id: 'R02', routeNo: '22-B', origin: 'Kothrud', destination: 'Wagholi', distance: 24.7, stops: 19, frequency: '15 min', status: 'active' },
    { id: 'R03', routeNo: '5-X', origin: 'Swargate', destination: 'PCMC', distance: 32.1, stops: 22, frequency: '20 min', status: 'active' },
    { id: 'R04', routeNo: '33-C', origin: 'Pimpri', destination: 'Yerawada', distance: 21.5, stops: 17, frequency: '12 min', status: 'active' },
    { id: 'R05', routeNo: '8-D', origin: 'Hinjewadi', destination: 'Katraj', distance: 28.9, stops: 21, frequency: '20 min', status: 'suspended' },
];

export const MOCK_DUTIES = [
    {
        id: 'D001',
        employeeId: '2',
        date: '2026-09-05',
        shift: 'Morning',
        busId: 'B01',
        busReg: 'MH-12-AB-1001',
        routeNo: '15-A',
        routeFrom: 'Shivajinagar',
        routeTo: 'Hadapsar',
        startTime: '06:00',
        endTime: '14:00',
        status: 'scheduled',
        conductorId: '3',
        conductorName: 'Anita Deshmukh',
    },
    {
        id: 'D002',
        employeeId: '3',
        date: '2026-09-05',
        shift: 'Morning',
        busId: 'B01',
        busReg: 'MH-12-AB-1001',
        routeNo: '15-A',
        routeFrom: 'Shivajinagar',
        routeTo: 'Hadapsar',
        startTime: '06:00',
        endTime: '14:00',
        status: 'scheduled',
        driverId: '2',
        driverName: 'Suresh Patil',
    },
    {
        id: 'D003',
        employeeId: '2',
        date: '2026-09-04',
        shift: 'Morning',
        busId: 'B01',
        busReg: 'MH-12-AB-1001',
        routeNo: '15-A',
        routeFrom: 'Shivajinagar',
        routeTo: 'Hadapsar',
        startTime: '06:00',
        endTime: '14:00',
        status: 'completed',
        conductorId: '3',
        conductorName: 'Anita Deshmukh',
    },
];

export const MOCK_ATTENDANCE = [
    { id: 'A001', employeeId: '2', date: '2026-09-05', checkIn: '05:52', checkOut: null, status: 'present' },
    { id: 'A002', employeeId: '2', date: '2026-09-04', checkIn: '06:01', checkOut: '14:05', status: 'present' },
    { id: 'A003', employeeId: '2', date: '2026-09-03', checkIn: '06:12', checkOut: '14:18', status: 'present' },
    { id: 'A004', employeeId: '2', date: '2026-09-02', checkIn: null, checkOut: null, status: 'absent' },
    { id: 'A005', employeeId: '2', date: '2026-09-01', checkIn: '06:00', checkOut: '14:02', status: 'present' },
    { id: 'A006', employeeId: '3', date: '2026-09-05', checkIn: '05:58', checkOut: null, status: 'present' },
    { id: 'A007', employeeId: '3', date: '2026-09-04', checkIn: '06:03', checkOut: '14:08', status: 'present' },
];

export const MOCK_LEAVES = [
    {
        id: 'L001',
        employeeId: '3',
        employeeName: 'Anita Deshmukh',
        leaveType: 'Casual Leave',
        fromDate: '2026-09-10',
        toDate: '2026-09-11',
        days: 2,
        reason: 'Family function',
        status: 'pending',
        appliedOn: '2026-09-03',
    },
    {
        id: 'L002',
        employeeId: '5',
        employeeName: 'Priya Joshi',
        leaveType: 'Sick Leave',
        fromDate: '2026-09-01',
        toDate: '2026-09-05',
        days: 5,
        reason: 'Fever and rest',
        status: 'approved',
        appliedOn: '2026-08-31',
        approvedBy: 'Rajesh Kumar',
    },
    {
        id: 'L003',
        employeeId: '2',
        employeeName: 'Suresh Patil',
        leaveType: 'Annual Leave',
        fromDate: '2026-09-15',
        toDate: '2026-09-20',
        days: 6,
        reason: 'Personal travel',
        status: 'pending',
        appliedOn: '2026-09-04',
    },
];

export const MOCK_LEAVE_BALANCE = {
    '2': { casual: { total: 12, used: 2, remaining: 10 }, sick: { total: 10, used: 1, remaining: 9 }, annual: { total: 15, used: 3, remaining: 12 } },
    '3': { casual: { total: 12, used: 4, remaining: 8 }, sick: { total: 10, used: 2, remaining: 8 }, annual: { total: 15, used: 0, remaining: 15 } },
};

export const MOCK_SHIFTS = [
    { id: 'S1', name: 'Morning', startTime: '06:00', endTime: '14:00', color: 'teal' },
    { id: 'S2', name: 'Afternoon', startTime: '14:00', endTime: '22:00', color: 'amber' },
    { id: 'S3', name: 'Night', startTime: '22:00', endTime: '06:00', color: 'indigo' },
];

export const MOCK_NOTIFICATIONS = [
    { id: 'N001', userId: '2', title: 'Duty Assigned', body: 'You have been assigned to Route 15-A on Sep 6.', type: 'duty', isRead: false, createdAt: '2026-09-05T07:00:00' },
    { id: 'N002', userId: '2', title: 'Leave Approved', body: 'Your casual leave for Sep 15-20 is approved.', type: 'leave', isRead: false, createdAt: '2026-09-04T15:30:00' },
    { id: 'N003', userId: '2', title: 'Attendance Marked', body: 'Check-in recorded at 05:52.', type: 'info', isRead: true, createdAt: '2026-09-05T05:52:00' },
    { id: 'N004', userId: '3', title: 'Leave Pending', body: 'Your leave request is awaiting approval.', type: 'leave', isRead: false, createdAt: '2026-09-03T10:00:00' },
    { id: 'N005', userId: '1', title: 'New Leave Request', body: 'Suresh Patil applied for 6 days leave.', type: 'alert', isRead: false, createdAt: '2026-09-04T20:00:00' },
];

export const MOCK_STATS = {
    totalEmployees: 48,
    activeDrivers: 22,
    activeConductors: 18,
    totalBuses: 32,
    operationalBuses: 28,
    routesActive: 14,
    attendanceToday: 89, // percent
    pendingLeaves: 5,
};

export const MOCK_ROSTER = [
    { week: '2026-09-01', employee: 'Suresh Patil', mon: 'Morning', tue: 'Morning', wed: 'Off', thu: 'Morning', fri: 'Morning', sat: 'Afternoon', sun: 'Off' },
    { week: '2026-09-01', employee: 'Anita Deshmukh', mon: 'Morning', tue: 'Off', wed: 'Afternoon', thu: 'Morning', fri: 'Off', sat: 'Morning', sun: 'Off' },
    { week: '2026-09-01', employee: 'Manoj Shinde', mon: 'Night', tue: 'Night', wed: 'Night', thu: 'Off', fri: 'Night', sat: 'Off', sun: 'Night' },
    { week: '2026-09-01', employee: 'Vikram Rao', mon: 'Off', tue: 'Morning', wed: 'Morning', thu: 'Morning', fri: 'Morning', sat: 'Morning', sun: 'Off' },
];
