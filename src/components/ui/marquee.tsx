import { motion } from "framer-motion";

const MarqueeSection = () => {
  const text = "Welcome to DigiSence • Discover Amazing Businesses • Manage Your Profile • Transform Your Business • ";

  return (
    <section className="bg-gray-100 py-5 relative z-10 overflow-hidden w-full">
      <motion.div
        className="whitespace-nowrap text-gray-700 text-6xl font-medium"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {text.repeat(2)}
      </motion.div>
    </section>
  );
};

export default MarqueeSection;