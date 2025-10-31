import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';

interface CollapsibleSectionProps {
    title: string;
    summary: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, summary, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-background rounded-2xl">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <div>
                    <h3 className="font-bold text-text-primary text-lg">{title}</h3>
                    <p className="text-sm text-text-secondary">{summary}</p>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon name="chevron-down" className="w-6 h-6 text-text-secondary" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden px-4 pb-3"
                    >
                       {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSection;