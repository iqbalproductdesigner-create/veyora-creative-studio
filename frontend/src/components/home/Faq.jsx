import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useContent } from "../../context/ContentContext";
import { fadeUp, viewport } from "../../lib/motionVariants";

export default function Faq() {
  const { faqs } = useContent();

  return (
    <section id="faq" data-testid="faq-section" className="section-pad">
      <div className="veyora-container grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="lg:col-span-4">
          <span className="eyebrow">FAQ</span>
          <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight leading-tight mt-4">
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="font-body text-[#A3AAB4] mt-5 leading-relaxed">
            Masih ragu? Tenang, ini beberapa hal yang biasa ditanyakan calon klien kami sebelum memulai.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="lg:col-span-8">
          <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
            {(faqs || []).map((f, i) => (
              <AccordionItem
                key={f.id}
                value={f.id}
                className="border-b border-[#23262B]"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="font-head text-white text-left text-base md:text-lg hover:no-underline py-6">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-[#A3AAB4] text-sm md:text-base leading-relaxed pb-6">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
