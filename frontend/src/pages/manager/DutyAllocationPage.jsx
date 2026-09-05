import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge, PageHeader, Button, Modal, Select, Table } from '../../components/ui';
import { MOCK_DUTIES, MOCK_EMPLOYEES, MOCK_BUSES, MOCK_ROUTES, MOCK_SHIFTS } from '../../mock/data';

export default function DutyAllocationPage() {
    const [duties, setDuties] = useState(MOCK_DUTIES);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ employeeId: '', busId: '', routeId: '', shiftId: '', date: '' });

    const drivers = MOCK_EMPLOYEES.filter((e) => e.role === 'driver');
    const conductors = MOCK_EMPLOYEES.filter((e) => e.role === 'conductor');
    const allWorkers = MOCK_EMPLOYEES.filter((e) => e.role !== 'manager');

    const addDuty = () => {
        const emp = MOCK_EMPLOYEES.find((e) => e.id === form.employeeId);
        const bus = MOCK_BUSES.find((b) => b.id === form.busId);
        const route = MOCK_ROUTES.find((r) => r.id === form.routeId);
        const shift = MOCK_SHIFTS.find((s) => s.id === form.shiftId);
        if (!emp || !bus || !route || !shift) return;
        setDuties([{
            id: 'D' + Date.now(),
            employeeId: emp.id,
            date: form.date || new Date().toISOString().split('T')[0],
            shift: shift.name, busId: bus.id, busReg: bus.regNo,
            routeNo: route.routeNo, routeFrom: route.origin, routeTo: route.destination,
            startTime: shift.startTime, endTime: shift.endTime, status: 'scheduled',
        }, ...duties]);
        setModal(false);
        setForm({ employeeId: '', busId: '', routeId: '', shiftId: '', date: '' });
    };

    const columns = [
        { key: 'date', label: 'Date', render: (v) => <span className="text-gray-300">{v}</span> },
        {
            key: 'employeeId', label: 'Employee', render: (v) => {
                const emp = MOCK_EMPLOYEES.find((e) => e.id === v);
                return <span className="text-white">{emp?.name || v}</span>;
            }
        },
        { key: 'routeNo', label: 'Route', render: (v, row) => <span className="text-teal-400 font-mono">{v} ({row.routeFrom}–{row.routeTo})</span> },
        { key: 'busReg', label: 'Bus', render: (v) => <span className="font-mono text-xs text-gray-400">{v}</span> },
        { key: 'shift', label: 'Shift', render: (v, row) => <span className="text-gray-400">{v} ({row.startTime}–{row.endTime})</span> },
        { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
    ];

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Duty Allocation" subtitle={`${duties.length} duties assigned`}
                    actions={<Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => setModal(true)}>Assign Duty</Button>}
                />
            </motion.div>

            <motion.div variants={fadeUp}>
                <Table columns={columns} data={duties} />
            </motion.div>

            <Modal isOpen={modal} onClose={() => setModal(false)} title="Assign New Duty">
                <div className="space-y-4">
                    <Select label="Employee" value={form.employeeId}
                        options={[{ value: '', label: 'Select employee…' }, ...allWorkers.map((e) => ({ value: e.id, label: `${e.name} (${e.role})` }))]}
                        onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Bus" value={form.busId}
                            options={[{ value: '', label: 'Select bus…' }, ...MOCK_BUSES.filter((b) => b.status === 'operational').map((b) => ({ value: b.id, label: b.regNo }))]}
                            onChange={(e) => setForm({ ...form, busId: e.target.value })}
                        />
                        <Select label="Route" value={form.routeId}
                            options={[{ value: '', label: 'Select route…' }, ...MOCK_ROUTES.filter((r) => r.status === 'active').map((r) => ({ value: r.id, label: `${r.routeNo} (${r.origin}–${r.destination})` }))]}
                            onChange={(e) => setForm({ ...form, routeId: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Shift" value={form.shiftId}
                            options={[{ value: '', label: 'Select shift…' }, ...MOCK_SHIFTS.map((s) => ({ value: s.id, label: `${s.name} (${s.startTime}–${s.endTime})` }))]}
                            onChange={(e) => setForm({ ...form, shiftId: e.target.value })}
                        />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date</label>
                            <input type="date" className="input-base" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                                style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <Button variant="primary" className="flex-1" onClick={addDuty}>Assign Duty</Button>
                        <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
