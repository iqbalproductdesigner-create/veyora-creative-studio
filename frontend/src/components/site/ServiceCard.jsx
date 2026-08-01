import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motionVariants";

// Reusable service card used across the site.
export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div variants={fadeUp} custom={index} className="group">
      <Link
        to={`/services/${service.slug}`}
        data-testid={`service-card-${service.slug}`}
        className="surface-card overflow-hidden flex flex-col h-full hover:border-[#3a3e45] hover:-translate-y-1 transition-all duration-300"
      >
        <div className="relative overflow-hidden aspect-[16/10]">
          {service.thumbnail ? (
            <img
              src={service.thumbnail}
              alt={service.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-[#080D10]" />
          )}
          <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-body text-white bg-[#080D10]/80 border border-[#23262B] rounded-full px-3 py-1">
            {service.category}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-head text-white text-xl">{service.title}</h3>
            <ArrowUpRight className="w-5 h-5 text-[#A3AAB4] group-hover:text-white transition-colors shrink-0" />
          </div>
          <p className="font-body text-sm text-[#A3AAB4] leading-relaxed mt-3 flex-1">
            {service.short_description}
          </p>
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#23262B]">
            <div>
              <p className="font-body text-[11px] text-[#A3AAB4] uppercase tracking-wider">Mulai dari</p>
              <p className="font-head text-white text-lg">{service.starting_price}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[#A3AAB4]">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-body text-xs">{service.estimated_time}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
