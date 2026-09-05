import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Edit3, Trash2 } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Button, Badge, PageHeader, Table, Modal, Input, Select } from '../../components/ui';
import { MOCK_EMPLOYEES } from '../../mock/data';

const ROLE_OPTIONS = [{ value: 'driver', label: 'Driver' }, { value: 'conductor', label: 'Conductor' }];
const STATUS_OPTIONS = [{ value: 'active', label: 'Active' }, { value: 'on-leave', label: 'On Leave' }, { value: 'inactive', label: 'Inactive' }];

export default function EmployeesPage() {
    const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ name: '', employeeId: '', role: 'driver', phone: '', shift: 'Morning', status: 'active' });

    const filtered = employees.filter(
        (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase())
    );

    const addEmployee = () => {
        if (!form.name || !form.employeeId) return;
        setEmployees([{ ...form, id: String(Date.now()), joinedDate: new Date().toISOString().split('T')[0] }, ...employees]);
        setModal(false);
        setForm({ name: '', employeeId: '', role: 'driver', phone: '', shift: 'Morning', status: 'active' });
    };

    const remove = (id) => setEmployees((prev) => prev.filter((e) => e.id !== id));

    const columns = [
        {
            key: 'name', label: 'Name', render: (v, row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-400">{v.charAt(0)}</div>
                    <div>
                        <p className="text-sm font-medium text-white">{v}</p>
                        <p className="text-xs text-gray-500">{row.employeeId}</p>
                    </div>
                </div>
            )
        },
        { key: 'role', label: 'Role', render: (v) => <span className="capitalize text-gray-300">{v}</span> },
        { key: 'shift', label: 'Shift', render: (v) => <span className="text-gray-400">{v}</span> },
        { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
        { key: 'phone', label: 'Phone', render: (v) => <span className="text-gray-400">{v}</span> },
        {
            key: 'actions', label: '', render: (_, row) => (
                <button onClick={() => remove(row.id)} className="p-1 rounded hover:bg-danger/10 text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                </button>
            )
        },
    ];

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Employees"
                    subtitle={`${employees.length} total · ${employees.filter(e => e.status === 'active').length} active`}
                    actions={<Button variant="primary" size="md" icon={<UserPlus size={16} />} onClick={() => setModal(true)}>Add Employee</Button>}
                />
            </motion.div>

            {/* Search */}
            <motion.div variants={fadeUp} className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input className="input-base pl-9" placeholder="Search by name or ID…"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
            </motion.div>

            {/* Table */}
            <motion.div variants={fadeUp}>
                <Table columns={columns} data={filtered} emptyText="No employees match your search" />
            </motion.div>

            {/* Add modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Employee">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Role" value={form.role} options={ROLE_OPTIONS} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <Button variant="primary" className="flex-1" onClick={addEmployee}>Add Employee</Button>
                        <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
