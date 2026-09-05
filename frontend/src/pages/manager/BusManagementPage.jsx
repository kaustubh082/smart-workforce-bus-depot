import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wrench } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge, PageHeader, Button, Table, Modal, Input, Select } from '../../components/ui';
import { MOCK_BUSES } from '../../mock/data';

const STATUS_OPTIONS = [
    { value: 'operational', label: 'Operational' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out-of-service', label: 'Out of Service' },
];

export default function BusManagementPage() {
    const [buses, setBuses] = useState(MOCK_BUSES);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ regNo: '', model: '', capacity: '', status: 'operational' });

    const addBus = () => {
        setBuses([{ id: 'B' + Date.now(), ...form, km: 0, lastMaintenance: new Date().toISOString().split('T')[0], route: '—' }, ...buses]);
        setModal(false);
        setForm({ regNo: '', model: '', capacity: '', status: 'operational' });
    };

    const columns = [
        { key: 'regNo', label: 'Reg. No.', render: (v) => <span className="font-mono text-sm text-teal-400">{v}</span> },
        { key: 'model', label: 'Model', render: (v) => <span className="text-gray-200">{v}</span> },
        { key: 'capacity', label: 'Capacity', render: (v) => <span className="text-gray-400">{v} seats</span> },
        { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
        { key: 'route', label: 'Route', render: (v) => <span className="text-gray-400">{v}</span> },
        { key: 'lastMaintenance', label: 'Last Maint.', render: (v) => <span className="text-xs text-gray-500">{v}</span> },
        { key: 'km', label: 'Km', render: (v) => <span className="text-xs font-mono text-gray-500">{Number(v).toLocaleString()}</span> },
    ];

    const status = { operational: 0, maintenance: 0, 'out-of-service': 0 };
    buses.forEach((b) => { if (status[b.status] !== undefined) status[b.status]++; });

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Bus Fleet"
                    subtitle={`${buses.length} total · ${status.operational} operational`}
                    actions={<Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => setModal(true)}>Add Bus</Button>}
                />
            </motion.div>

            {/* Status pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {Object.entries(status).map(([s, n]) => (
                    <div key={s} className="flex items-center gap-2 px-3 py-1.5 bg-navy-800 border border-white/06 rounded-full">
                        <Badge status={s} />
                        <span className="text-xs text-gray-400 font-medium">{n}</span>
                    </div>
                ))}
            </motion.div>

            <motion.div variants={fadeUp}>
                <Table columns={columns} data={buses} />
            </motion.div>

            <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Bus">
                <div className="space-y-4">
                    <Input label="Registration No." value={form.regNo} onChange={(e) => setForm({ ...form, regNo: e.target.value })} placeholder="MH-12-AB-0000" />
                    <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Tata Starbus 9m" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Capacity (seats)" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                        <Select label="Status" value={form.status} options={STATUS_OPTIONS} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <Button variant="primary" className="flex-1" onClick={addBus}>Add Bus</Button>
                        <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
