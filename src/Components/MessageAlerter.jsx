import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const alertMessageRoot = document.getElementById('alertmsg');

const MessageAlerter = ({ type = false, message = '', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose(); // callback to remove the alert
        }, 2000);

        return () => clearTimeout(timer); // cleanup
    }, [onClose]);

    if (!message) return null;

    const bgcolor = type ? 'bg-green-600' : 'bg-red-700';

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 200, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`fixed top-5 right-5 px-4 py-2 text-white rounded-md shadow-lg ${bgcolor} z-50`}
            >
                {message}
            </motion.div>
        </AnimatePresence>,
        alertMessageRoot
    );
};

export default MessageAlerter;
