import { motion } from "framer-motion";
import { TierCard } from "./tier-card";

interface ServicesSectionProps {
  onTierSelect?: (tier: string) => void;
}

export function ServicesSection({ onTierSelect }: ServicesSectionProps) {
  const handleCTAClick = (tier: string) => {
    onTierSelect?.(tier);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-32 px-4" id="services">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">The Ascension Model</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Not everyone is ready. Progress through the tiers as you prove your
            commitment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xl text-gray-500 italic">
            "Tools make you faster. Systems make you inevitable."
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent hidden lg:block" />

          <div className="grid gap-8 lg:gap-12">
            <TierCard
              tier="peasant"
              index={0}
              onCTAClick={() => handleCTAClick("peasant")}
            />

            <div className="hidden lg:flex justify-center py-4">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
              >
                <span className="text-white text-sm font-bold">↑</span>
              </motion.div>
            </div>

            <TierCard
              tier="knight"
              index={1}
              onCTAClick={() => handleCTAClick("knight")}
            />

            <div className="hidden lg:flex justify-center py-4">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              >
                <span className="text-white text-sm font-bold">↑</span>
              </motion.div>
            </div>

            <TierCard
              tier="royal"
              index={2}
              onCTAClick={() => handleCTAClick("royal")}
            />

            <div className="hidden lg:flex justify-center py-4">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
              >
                <span className="text-white text-sm font-bold">↑</span>
              </motion.div>
            </div>

            <TierCard
              tier="ascended"
              index={3}
              onCTAClick={() => handleCTAClick("ascended")}
            />

            <div className="hidden lg:flex justify-center py-4">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
              >
                <span className="text-gray-500 text-sm font-bold">?</span>
              </motion.div>
            </div>

            <TierCard tier="grayl" index={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
