import { motion } from "framer-motion";

const LoadingDots = () => {
    return (
        <div className="loading-container">
            <motion.span 
                className="dot"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.span 
                className="dot"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span 
                className="dot"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );
};

export default LoadingDots;
