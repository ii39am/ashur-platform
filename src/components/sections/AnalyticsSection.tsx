import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar,
} from 'recharts';
import { SectionWrapper, SectionHeader } from '../ui';
import { InteractiveGlobe } from '../3d/InteractiveGlobe';
import { useLanguage } from '../../context/LanguageContext';

const pieColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const heatmapData = [
  [4, 7, 3, 9, 5, 8, 2],
  [6, 3, 8, 4, 7, 5, 9],
  [2, 8, 5, 7, 3, 9, 6],
  [9, 4, 7, 2, 8, 3, 5],
  [5, 9, 2, 6, 4, 7, 8],
];

const tooltipStyle = {
  backgroundColor: '#0f0f2e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#e2e8f0',
};

const hours = ['9AM', '11AM', '1PM', '3PM', '5PM'];

function Heatmap({ days }: { days: string[] }) {
  return (
    <div className="space-y-1">
      <div className="flex gap-1 ml-12">
        {days.map((day) => (
          <div key={day} className="flex-1 text-center text-[10px] text-slate-600">{day}</div>
        ))}
      </div>
      {heatmapData.map((row, ri) => (
        <div key={ri} className="flex items-center gap-1">
          <span className="text-[10px] text-slate-600 w-10 text-right">{hours[ri]}</span>
          {row.map((val, ci) => (
            <motion.div
              key={ci}
              className="flex-1 h-8 rounded-md cursor-default"
              style={{
                backgroundColor: `rgba(59, 130, 246, ${val / 10})`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (ri * 7 + ci) * 0.02 }}
              whileHover={{ scale: 1.1 }}
              title={`${val * 11} transactions`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function WorldMap({ regions }: { regions: Array<{ name: string; x: string; y: string; value: string }> }) {
  return (
    <div className="relative w-full h-full min-h-[250px]">
      <svg viewBox="0 0 100 60" className="w-full h-full opacity-10" fill="none" stroke="#3b82f6" strokeWidth="0.3">
        <path d="M15,15 Q20,10 25,12 L30,15 Q28,20 25,22 L20,25 Q17,22 15,18 Z" />
        <path d="M25,30 Q28,28 30,30 L32,38 Q30,42 27,40 L24,35 Z" />
        <path d="M40,12 Q50,8 58,12 L60,18 Q55,22 50,20 L42,18 Z" />
        <path d="M42,25 Q48,22 55,25 L58,35 Q52,40 45,38 Z" />
        <path d="M62,18 Q70,12 80,15 L85,22 Q82,30 75,28 L68,25 Q64,22 62,18 Z" />
        <path d="M75,35 Q85,30 90,35 L88,42 Q82,45 78,42 Z" />
      </svg>

      {regions.map((region, i) => (
        <motion.div
          key={region.name}
          className="absolute group cursor-default"
          style={{ left: region.x, top: region.y }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: 'spring' }}
        >
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-brand-500 animate-ping opacity-30" />

            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              <div className="glass rounded-lg px-3 py-1.5 whitespace-nowrap">
                <div className="text-[10px] text-slate-400">{region.name}</div>
                <div className="text-xs font-bold text-white">{region.value}</div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export const AnalyticsSection: React.FC = () => {
  const { t } = useLanguage();

  const revenueData = useMemo(() => [
    { month: t.dashboard.months.jan, revenue: 42000, expenses: 28000, profit: 14000 },
    { month: t.dashboard.months.feb, revenue: 48000, expenses: 31000, profit: 17000 },
    { month: t.dashboard.months.mar, revenue: 55000, expenses: 33000, profit: 22000 },
    { month: t.dashboard.months.apr, revenue: 51000, expenses: 30000, profit: 21000 },
    { month: t.dashboard.months.may, revenue: 62000, expenses: 35000, profit: 27000 },
    { month: t.dashboard.months.jun, revenue: 71000, expenses: 38000, profit: 33000 },
    { month: t.dashboard.months.jul, revenue: 68000, expenses: 36000, profit: 32000 },
    { month: t.dashboard.months.aug, revenue: 78000, expenses: 40000, profit: 38000 },
  ], [t]);

  const departmentData = useMemo(() => [
    { name: t.analytics.departments.sales, value: 35 },
    { name: t.analytics.departments.marketing, value: 20 },
    { name: t.analytics.departments.engineering, value: 25 },
    { name: t.analytics.departments.support, value: 12 },
    { name: t.analytics.departments.operations, value: 8 },
  ], [t]);

  const performanceData = useMemo(() => [
    { category: t.analytics.departments.sales, score: 92 },
    { category: t.analytics.departments.marketing, score: 78 },
    { category: t.analytics.departments.support, score: 88 },
    { category: t.analytics.departments.product, score: 95 },
    { category: t.analytics.departments.finance, score: 85 },
    { category: t.analytics.departments.hr, score: 72 },
  ], [t]);

  const regions = useMemo(() => [
    { name: t.analytics.regions.northAmerica, x: '22%', y: '35%', value: '$1.2M' },
    { name: t.analytics.regions.europe, x: '48%', y: '30%', value: '$890K' },
    { name: t.analytics.regions.asiaPacific, x: '72%', y: '42%', value: '$650K' },
    { name: t.analytics.regions.middleEast, x: '55%', y: '45%', value: '$420K' },
    { name: t.analytics.regions.africa, x: '48%', y: '58%', value: '$180K' },
    { name: t.analytics.regions.southAmerica, x: '30%', y: '62%', value: '$310K' },
  ], [t]);

  return (
    <SectionWrapper id="analytics">
      <SectionHeader
        badge={t.analytics.badge}
        title={t.analytics.title}
        titleHighlight={t.analytics.titleHighlight}
        description={t.analytics.description}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <motion.div
          className="glass-card rounded-2xl p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-sm font-medium text-slate-400 mb-4">{t.analytics.revenueVsExpense}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#gRevenue)" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#gExpenses)" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#gProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-slate-400 mb-4">{t.analytics.budgetAllocation}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3} label={({ name, percent }: { name?: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {departmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-slate-400 mb-4">{t.analytics.departmentPerformance}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="category" stroke="#475569" fontSize={11} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(255,255,255,0.05)" fontSize={10} />
              <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Heatmap */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-slate-400 mb-4">{t.analytics.heatmap}</h3>
          <Heatmap days={t.analytics.days} />
        </motion.div>

        {/* World Map / Interactive 3D Globe */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-slate-400 mb-4">{t.analytics.globalRevenue}</h3>
          <InteractiveGlobe />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
