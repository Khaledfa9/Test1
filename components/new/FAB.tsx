import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../common/Icon';

interface Action {
    label: string;
    icon: React.ComponentProps<typeof Icon>['name'];
    action: () => void;
}

interface FABProps {
    actions: Action[];
}

const FAB: React.FC<FABProps> = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false);

    const wrapperVariants = {
        open: {
            transition: { staggerChildren: 0.07, delayChildren: 0.2 }
        },
        closed: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const itemVariants = {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 1000, velocity: -100 }
            }
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: { stiffness: 1000 }
            }
        }
    };

    return (
        <div className="fixed bottom-24 right-5 z-50">
            <AnimatePresence>
                {isOpen && (
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
             <motion.div
                className="relative z-50"
                initial={false}
                animate={isOpen ? "open" : "closed"}
            >
                {isOpen && (
                    <motion.ul
                        variants={wrapperVariants}
                        className="space-y-3 mb-4 flex flex-col items-end"
                    >
                        {actions.map((action, index) => (
                            <motion.li
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-3 cursor-pointer"
                                onClick={() => {
                                    action.action();
                                    setIsOpen(false);
                                }}
                            >
                                <span className="bg-card text-text-primary px-3 py-1.5 rounded-lg shadow-md text-sm font-medium">{action.label}</span>
                                <div className="bg-card p-3 rounded-full shadow-md">
                                    <Icon name={action.icon} className="w-5 h-5 text-text-primary" />
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/40"
                    aria-label="Add meal"
                >
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }}>
                        <Icon name="plus" className="w-8 h-8" />
                    </motion.div>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default FAB;