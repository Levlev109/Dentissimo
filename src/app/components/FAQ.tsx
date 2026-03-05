import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

export const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { questionKey: 'faq.q1', answerKey: 'faq.a1' },
    { questionKey: 'faq.q2', answerKey: 'faq.a2' },
    { questionKey: 'faq.q3', answerKey: 'faq.a3' },
    { questionKey: 'faq.q4', answerKey: 'faq.a4' },
    { questionKey: 'faq.q5', answerKey: 'faq.a5' },
    { questionKey: 'faq.q6', answerKey: 'faq.a6' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-stone-950 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <span className="font-semibold text-stone-900 dark:text-white pr-4">
                  {t(faq.questionKey)}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="text-[#D4AF37]" size={20} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800">
                      {t(faq.answerKey)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-4">
            {t('faq.stillHaveQuestions')}
          </p>
          <a
            href="mailto:info@blasspharma.com"
            className="inline-block px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-medium rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            {t('faq.contactUs')}
          </a>
        </div>
      </div>
    </section>
  );
};
