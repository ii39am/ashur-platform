import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, MessageSquare, Mic, Brain, FileBarChart2, TrendingUp,
  Shield, Lightbulb, Sparkles, Send, Sparkle,
} from 'lucide-react';
import { SectionWrapper, SectionHeader, GlassCard } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const aiFeatureConfig = [
  { icon: Brain, key: 'predictive' },
  { icon: FileBarChart2, key: 'reports' },
  { icon: TrendingUp, key: 'forecast' },
  { icon: Shield, key: 'fraud' },
  { icon: Lightbulb, key: 'decisions' },
  { icon: Sparkles, key: 'ask' },
];

const aiTranslations = {
  en: {
    copilotTitle: 'Ashur AI Copilot',
    features: {
      predictive: { title: 'Predictive Analytics', description: 'AI-powered forecasting for demand, revenue, and resource planning.' },
      reports: { title: 'Auto Reports', description: 'Generate comprehensive reports with natural language commands.' },
      forecast: { title: 'Revenue Forecast', description: 'Machine learning models predict revenue trends with 94% accuracy.' },
      fraud: { title: 'Fraud Detection', description: 'Real-time anomaly detection flags suspicious transactions instantly.' },
      decisions: { title: 'Smart Decisions', description: 'AI analyzes data patterns and suggests optimal business decisions.' },
      ask: { title: 'Ask Anything', description: 'Natural language interface — just ask about any business metric.' },
    },
    defaultChat: [
      { role: 'user' as const, text: 'Show me last quarter revenue breakdown by region.' },
      {
        role: 'ai' as const,
        text: "Here's your Q3 revenue breakdown:\n\n📊 North America: $1.2M (+18%)\n📊 Europe: $890K (+12%)\n📊 Asia Pacific: $650K (+24%)\n📊 Middle East: $420K (+31%)\n\nMENA region shows strongest growth at 31% QoQ.",
      },
    ],
  },
  ar: {
    copilotTitle: 'مساعد آشور بالذكاء الاصطناعي',
    features: {
      predictive: { title: 'التحليلات التنبؤية', description: 'تنبؤات بالذكاء الاصطناعي على الطلب، الإيرادات وتخطيط الموارد.' },
      reports: { title: 'تقارير آليّة', description: 'إنشاء تقارير شاملة من خلال الأوامر والأسئلة باللغة الطبيعية.' },
      forecast: { title: 'توقعات الإيرادات', description: 'نماذج تعلم الآلة تتوقع اتجاهات المبيعات بدقة تصل إلى 94%.' },
      fraud: { title: 'كشف الاحتيال', description: 'كشف الأنشطة والمعاملات المشبوهة والتنبيه بها فور حدوثها.' },
      decisions: { title: 'قرارات ذكية', description: 'تحليل أنماط البيانات واقتراح أفضل القرارات الاستراتيجية للمؤسسة.' },
      ask: { title: 'اسأل أي شيء', description: 'واجهة لغة طبيعية تفاعلية — فقط اسأل عن أي مؤشر تجاري.' },
    },
    defaultChat: [
      { role: 'user' as const, text: 'اعرض لي توزيع إيرادات الربع الأخير حسب المنطقة.' },
      {
        role: 'ai' as const,
        text: "إليك توزيع إيرادات الربع الثالث:\n\n📊 أمريكا الشمالية: 1.2M$ (+18%)\n📊 أوروبا: 890K$ (+12%)\n📊 آسيا والمحيط الهادئ: 650K$ (+24%)\n📊 الشرق الأوسط وشمال أفريقيا: 420K$ (+31%)\n\nمنطقة الشرق الأوسط تسجل أعلى معدل نمو بنسبة 31% مقارنة بالربع السابق.",
      },
    ],
  },
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-brand-400"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function VoiceWaveform() {
  return (
    <div className="flex items-end gap-0.5 h-6">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-gradient-to-t from-brand-500 to-cyan-400 rounded-full"
          animate={{
            height: [
              `${Math.random() * 16 + 4}px`,
              `${Math.random() * 24 + 8}px`,
              `${Math.random() * 12 + 4}px`,
            ],
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}

export const AIAssistantSection: React.FC = () => {
  const { t, language } = useLanguage();
  const currentTrans = aiTranslations[language as 'en' | 'ar'] || aiTranslations.en;

  const [messages, setMessages] = useState(currentTrans.defaultChat);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiFeatures = aiFeatureConfig.map((item) => ({
    ...item,
    ...currentTrans.features[item.key as keyof typeof currentTrans.features],
  }));

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = language === 'ar'
        ? `تم تحليل استفسارك: "${text}".\n\n✅ تم التحقق والتدقيق عبر سجلات الأستاذ العام والمخزون.\n📈 النسبة الإيجابية المتوقعة: +14.2% للدورة القادمة.`
        : `I have analyzed your query: "${text}".\n\n✅ Audit verified across G/L & Inventory.\n📈 Projected positive variance: +14.2% for next cycle.`;

      if (text.includes('الربع') || text.toLowerCase().includes('q4') || text.toLowerCase().includes('forecast') || text.includes('توقع')) {
        aiText = language === 'ar'
          ? `🔮 رؤى وتوقعات الربع الرابع:\n\n• إجمالي المبيعات المتوقعة: 3.84M$\n• مخاطر نفاد المخزون: منخفضة (تم تتبع منتجين)\n• ميزانية التسويق المقترحة: +15% في الشرق الأوسط وأوروبا.`
          : `🔮 Q4 Forecast Insights:\n\n• Projected Sales Volume: $3.84M\n• Projected Stock Out Risk: Low (2 SKUs monitored)\n• Recommended Marketing Budget: +15% in MENA & EU.`;
      } else if (text.includes('المنتجات') || text.includes('إعادة طلب') || text.toLowerCase().includes('restock') || text.toLowerCase().includes('inventory')) {
        aiText = language === 'ar'
          ? `📦 تنبيه إعادة طلب المخزون التلقائي:\n\n• المنتج SKU-4521 (ودجت برو) — تم طلب 140 قطعة\n• المنتج SKU-1182 (وحدة الحساسات) — تم إنشاء أمر شراء رقم #9402 تلقائياً.`
          : `📦 Automated Inventory Reorder Alert:\n\n• SKU-4521 (Widget Pro) — 140 units ordered\n• SKU-1182 (Sensor Module) — PO #9402 generated automatically.`;
      }

      setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <SectionWrapper id="ai-assistant">
      <SectionHeader
        badge={t.ai.badge}
        title={t.ai.title}
        titleHighlight={t.ai.titleHighlight}
        description={t.ai.description}
      />

      {/* Quick Interactive Prompt Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {Object.entries(t.ai.prompts).map(([key, promptText]) => (
          <button
            key={key}
            onClick={() => handleSend(promptText)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-light border border-brand-500/20 text-brand-300 hover:bg-brand-500/15 text-xs font-medium transition-all cursor-pointer"
          >
            <Sparkle className="w-3 h-3 text-brand-400" />
            <span>{promptText}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Chat Interface */}
        <motion.div
          className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-dark-900/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-md shadow-brand-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{currentTrans.copilotTitle}</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400">{t.ai.online}</span>
              </div>
            </div>
            <div className="ml-auto">
              <VoiceWaveform />
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 min-h-[320px] max-h-[380px] overflow-y-auto">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-brand-500/20 text-white rounded-br-md border border-brand-500/30'
                        : 'bg-white/5 text-slate-300 rounded-bl-md border border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 rounded-2xl rounded-bl-md">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-4 border-t border-white/5 bg-dark-900/40"
          >
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10 focus-within:border-brand-500/50 transition-colors">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t.ai.inputPlaceholder}
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
              />
              <Mic className="w-4 h-4 text-slate-500 hover:text-brand-400 cursor-pointer transition-colors" />
              <button type="submit" className="text-brand-400 hover:text-brand-300 cursor-pointer">
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </form>
        </motion.div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aiFeatures.map((feature, i) => (
            <GlassCard
              key={feature.title}
              className="p-5 group cursor-default"
              glow
              tilt
              delay={i * 0.08}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border border-brand-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5 h-5 text-brand-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{feature.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
