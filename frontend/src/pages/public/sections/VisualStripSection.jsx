import { motion } from 'framer-motion';

const CARDS = [
    {
        img: '/bus-hero.png',
        label: 'Fleet Overview',
        caption: 'Manage your entire bus fleet from one screen',
        objectPos: 'center',
    },
    {
        img: '/depot-aerial.png',
        label: 'Depot Yard',
        caption: 'Real-time visibility into depot operations',
        objectPos: 'center',
    },
    {
        img: '/driver-cockpit.png',
        label: 'Driver View',
        caption: 'Drivers see duties on any device',
        objectPos: 'center top',
    },
    {
        img: '/conductor.png',
        label: 'Conductor Portal',
        caption: 'Conductors check in, view routes instantly',
        objectPos: 'center top',
    },
    {
        // UI preview card (no photo)
        img: null,
        label: 'Duty Roster',
        caption: 'Assign shifts in seconds',
        objectPos: 'center',
        isUI: true,
    },
];

function UIPreviewCard() {
    return (
        <div className="w-full h-full bg-[#f0fdf9] flex flex-col p-4 gap-2">
            <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1">Weekly Roster</div>
            {['Rajesh K.', 'Suresh P.', 'Anita D.', 'Vijay M.'].map((name, i) => (
                <div key={name} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0">
                        {name[0]}
                    </div>
                    <div className="flex-1 flex gap-1">
                        {['M', 'A', 'M', 'O', 'M', 'A', 'O'].map((s, j) => (
                            <div key={j} className={`flex-1 h-4 rounded text-[7px] font-bold flex items-center justify-center
                ${s === 'M' ? 'bg-teal-100 text-teal-700' : s === 'A' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
                                {s}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function StripCard({ card, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(0,0,0,0.18)', borderColor: 'rgba(20,184,166,0.4)' }}
            className="group relative flex-shrink-0 w-72 sm:w-80 h-64 rounded-2xl overflow-hidden border border-white/10 bg-white cursor-pointer transition-[border-color] duration-300"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        >
            {/* Image */}
            {card.isUI ? (
                <UIPreviewCard />
            ) : (
                <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                        src={card.img} alt={card.label}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ objectPosition: card.objectPos }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
            )}

            {/* Label pill */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white/90 text-[10px] font-semibold uppercase tracking-wider border border-white/15">
                {card.label}
            </div>

            {/* Caption — slides up on hover */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ y: 8, opacity: 0.7 }}
                whileHover={{ y: 0, opacity: 1 }}>
                <p className={`text-sm font-medium leading-snug ${card.isUI ? 'text-navy-900' : 'text-white'}`}>
                    {card.caption}
                </p>
            </motion.div>
        </motion.div>
    );
}

export default function VisualStripSection() {
    return (
        <section className="py-8 overflow-hidden bg-[#060c1c]">
            {/* heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 px-4">
                <p className="text-teal-400 text-xs uppercase tracking-[0.25em] font-bold">Visual Preview</p>
            </motion.div>

            {/* scrollable strip */}
            <div className="flex gap-4 px-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide
        md:justify-center md:overflow-visible md:flex-wrap md:px-12 md:gap-5">
                {CARDS.map((card, i) => (
                    <div key={card.label} className="snap-start">
                        <StripCard card={card} index={i} />
                    </div>
                ))}
            </div>

            <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
        </section>
    );
}
