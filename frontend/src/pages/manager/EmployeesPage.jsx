import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Phone, Mail } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Badge, Modal, Button, Input } from '../../components/ui';
import { api } from '../../services/api';

export default function EmployeesPage() {
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showAdd, setShowAdd] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const emptyForm = { name: '', employeeId: '', email: '', mobile: '', role: 'driver', password: '' };
    const [form, setForm] = useState(emptyForm);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await api('/employees');
            setEmployees(data.map((e) => ({ ...e, employeeId: e.employeeId || e.employeeid || e.employee_id, role: (e.role || e.designation || '').toLowerCase(), status: e.status?.toLowerCase(), mobile: e.phone })));
        } catch (err) { setError(err.message || 'Unable to load employees.'); }
        finally { setLoading(false); }
    };
    useEffect(() => { loadEmployees(); }, []);

    const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setShowAdd(true); };
    const openEdit = (emp) => { setEditing(emp); setForm({ name: emp.name, employeeId: emp.employeeId, email: emp.email || '', mobile: emp.mobile || '', role: emp.role, password: '' }); setError(''); setShowAdd(true); };
    const saveEmployee = async () => {
        if (!form.name || !form.employeeId || !form.email || !form.mobile || (!editing && form.password.length < 8)) { setError(editing ? 'Please complete all employee details.' : 'Complete all details and set an initial password of at least 8 characters.'); return; }
        setSaving(true); setError('');
        const body = { name: form.name, email: form.email, phone: form.mobile, designation: form.role.toUpperCase(), ...(editing ? {} : { employee_id: form.employeeId, joining_date: new Date().toISOString().slice(0, 10), password: form.password }) };
        try {
            if (editing) await api(`/employees/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
            else await api('/employees', { method: 'POST', body: JSON.stringify(body) });
            setShowAdd(false); await loadEmployees();
        } catch (err) { setError(err.message || 'Unable to save employee.'); }
        finally { setSaving(false); }
    };
    const toggleStatus = async (emp) => {
        try { await api(`/employees/${emp.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: emp.status === 'active' ? 'INACTIVE' : 'ACTIVE' }) }); await loadEmployees(); }
        catch (err) { setError(err.message || 'Unable to update employee status.'); }
    };

    const filtered = employees.filter((e) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === 'all' || e.role === filterRole;
        return matchSearch && matchRole;
    });

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Employees"
                    subtitle={`${employees.length} total · ${employees.filter(e => e.status === 'active').length} active`}
                    action={
                        <Button onClick={openAdd}>
                            <Plus size={15} /> Add Employee
                        </Button>
                    } />
            </motion.div>

            {/* Search + filter */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name or ID…"
                        className="input-base pl-10 w-full" />
                </div>
                <div className="flex gap-2">
                    {['all', 'driver', 'conductor'].map((r) => (
                        <button key={r} onClick={() => setFilterRole(r)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold capitalize border transition-all"
                            style={{
                                background: filterRole === r ? '#E6F7F7' : '#FFFFFF',
                                borderColor: filterRole === r ? '#19A7A8' : '#E5EAF0',
                                color: filterRole === r ? '#178F90' : '#6B7E92',
                            }}>
                            {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Employee cards — grid */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((emp) => (
                    <motion.div key={emp.id} variants={fadeUp}
                        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(18,59,93,0.10)' }}
                        className="card p-5 cursor-default transition-all">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#19A7A8] to-[#2D8CFF] flex items-center justify-center text-white font-bold text-base shrink-0">
                                {emp.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[#14212B] truncate">{emp.name}</p>
                                <p className="text-xs text-[#6B7E92]">{emp.employeeId} · <span className="capitalize">{emp.role}</span></p>
                            </div>
                            <Badge status={emp.status} />
                        </div>
                        <div className="space-y-1.5 border-t border-[#F7F9FC] pt-3">
                            {emp.mobile && (
                                <div className="flex items-center gap-2 text-xs text-[#6B7E92]">
                                    <Phone size={11} className="text-[#98A9BB]" />{emp.mobile}
                                </div>
                            )}
                            {emp.email && (
                                <div className="flex items-center gap-2 text-xs text-[#6B7E92]">
                                    <Mail size={11} className="text-[#98A9BB]" />{emp.email}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => openEdit(emp)} className="text-xs font-semibold text-[#178F90] hover:underline">Edit</button>
                            <button onClick={() => toggleStatus(emp)} className="text-xs font-semibold text-[#6B7E92] hover:underline">Mark {emp.status === 'active' ? 'inactive' : 'active'}</button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {!loading && filtered.length === 0 && (
                <div className="text-center py-16 text-[#98A9BB]">
                    <Users size={40} className="mx-auto mb-3 text-[#D0DAE6]" />
                    No employees found matching your search.
                </div>
            )}

            {/* Add employee modal */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editing ? 'Edit Employee' : 'Add Employee'}
                footer={<><Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button><Button loading={saving} onClick={saveEmployee}>Save Employee</Button></>}>
                <div className="space-y-4">
                    <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Suresh Patil" />
                    <Input label="Employee ID" value={form.employeeId} disabled={Boolean(editing)} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="e.g. DRV-050" />
                    <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="employee@example.com" />
                    <Input label="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="98XXXXXXXX" />
                    {!editing && <Input label="Initial Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" />}
                    <div>
                        <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider block mb-1.5">Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-base bg-white">
                            <option value="driver">Driver</option>
                            <option value="conductor">Conductor</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
