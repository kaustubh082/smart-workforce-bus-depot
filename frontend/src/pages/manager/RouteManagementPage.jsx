import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge, PageHeader, Button, Table, Modal, Input, Select } from '../../components/ui';
import { MOCK_ROUTES } from '../../mock/data';

const STATUS_OPTIONS = [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }];

export default function RouteManagementPage() {
    const [routes, setRoutes] = useState(MOCK_ROUTES);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ routeNo: '', origin: '', destination: '', distance: '', stops: '', frequency: '', status: 'active' });

    const addRoute = () => {
        setRoutes([{ id: 'R' + Date.now(), ...form }, ...routes]);
        setModal(false);
        setForm({ routeNo: '', origin: '', destination: '', distance: '', stops: '', frequency: '', status: 'active' });
    };

    const columns = [
        { key: 'routeNo', label: 'Route No.', render: (v) => <span className="font-mono font-bold text-teal-400">{v}</span> },
        {
            key: 'origin', label: 'From', render: (v, row) => (
                <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-gray-500" />
                    <span className="text-gray-200">{v}</span>
                </div>
            )
        },
        { key: 'destination', label: 'To', render: (v) => <span className="text-gray-300">{v}</span> },
        { key: 'distance', label: 'Distance', render: (v) => <span className="text-gray-400">{v} km</span> },
        { key: 'stops', label: 'Stops', render: (v) => <span className="text-gray-400">{v}</span> },
        { key: 'frequency', label: 'Frequency', render: (v) => <span className="text-gray-400">{v}</span> },
        { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
    ];

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Route Management"
                    subtitle={`${routes.length} routes · ${routes.filter((r) => r.status === 'active').length} active`}
                    actions={<Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => setModal(true)}>Add Route</Button>}
                />
            </motion.div>

            <motion.div variants={fadeUp}>
                <Table columns={columns} data={routes} />
            </motion.div>

            <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Route">
                <div className="space-y-4">
                    <Input label="Route No." value={form.routeNo} onChange={(e) => setForm({ ...form, routeNo: e.target.value })} placeholder="e.g. 15-A" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Shivajinagar" />
                        <Input label="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Hadapsar" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Input label="Distance (km)" type="number" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} />
                        <Input label="No. of Stops" type="number" value={form.stops} onChange={(e) => setForm({ ...form, stops: e.target.value })} />
                        <Input label="Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} placeholder="10 min" />
                    </div>
                    <Select label="Status" value={form.status} options={STATUS_OPTIONS} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                    <div className="flex gap-3 mt-2">
                        <Button variant="primary" className="flex-1" onClick={addRoute}>Add Route</Button>
                        <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
