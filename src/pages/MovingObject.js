import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MovigObjects = () => {
    const [objects, setObjects] = useState([]);


    useEffect(() => {
        const interval = setInterval(() => {
            setObjects((prev) => [
                ...prev,
                { id: Date.now(), key: Math.random() },
            ]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="moving-container">
            {objects.map((obj) => (
                <motion.div
                key={obj.id}
                initial={{ x: "100vw" }}
                animate={{ x: "-10vw" }}
                transition={{ duration: 3, ease: "linear" }}
                // initial={{ x: "100vw", y: 0 }}
                // animate={{
                //     x: ["100vw", "50vw", "-10vw"], // 오른쪽 → 중간 → 왼쪽
                //     y: [0, -50, 0], // 중간에서 살짝 튀어오름
                // }}
                // transition={{
                //     duration: 3,
                //     ease: "linear",
                //     times: [0, 0.5, 1], // 50% 지점에서 y가 튀어오름
                // }}
                onAnimationComplete={() => {
                    setObjects((prev) => prev.filter((item) => item.id !== obj.id));
                }}
                className="moving-object"
                />
            ))}
        </div>
    )
}

export default MovigObjects;