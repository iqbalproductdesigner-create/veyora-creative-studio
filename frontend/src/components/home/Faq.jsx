import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import api from '../../lib/api';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await api.get('/faqs');
      if (res.data && Array.isArray(res.data)) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#080D10] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block text-xs font-semibold tracking-wider text-[#D9DEE6] border border-[#23262B] px-3 py-1 rounded-full bg-[#121417] uppercase">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="text-[#A3AAB4] text-sm sm:text-base leading-relaxed">
            Masih ragu? Tenang, ini beberapa hal yang biasa ditanyakan calon klien kami sebelum memulai.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#A3AAB4]">Memuat FAQ dari database...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 text-[#A3AAB4]">Belum ada pertanyaan FAQ di database.</div>
        ) : (
          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id || item._id || idx}
                  className="rounded-2xl bg-[#121417] border border-[#23262B] overflow-hidden transition-colors duration-200"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-semibold text-base sm:text-lg text-white">
                      {item.question || item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#A3AAB4] transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#D9DEE6]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#A3AAB4] leading-relaxed border-t border-[#23262B] pt-4">
                      {item.answer || item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
