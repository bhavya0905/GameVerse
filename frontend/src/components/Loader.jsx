// src/components/Loader.jsx
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      style={{
        width: "60px",
        height: "60px",
        border: "6px solid #f87171",
        borderTop: "6px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}
