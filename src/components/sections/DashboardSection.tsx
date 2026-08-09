import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Package, FileText, Calculator, Users, FolderKanban,
  Contact, TrendingUp, DollarSign, ShoppingCart, UserCheck,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { SectionWrapper, SectionHeader } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const pieColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const recentOrders = [
  { id: '#ORD-7291', customer: 'Acme Corp', amount: '$12,400', statusKey: 'Completed' },
  { id: '#ORD-7290', customer: 'TechFlow Inc', amount: '$8,750', statusKey: 'Processing' },
  { id: '#ORD-7289', customer: 'GlobalTech', amount: '$5,200', statusKey: 'Shipped' },
  { id: '#ORD-7288', customer: 'DataSync Ltd', amount: '$15,800', statusKey: 'Completed' },
  { id: '#ORD-7287', customer: 'CloudBase', amount: '$3,900', statusKey: 'Pending' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-emerald-500/10 text-emerald-400',
  Processing: 'bg-brand-500/10 text-brand-400',
  Shipped: 'bg-purple-500/10 text-purple-400',
  Pending: 'bg-amber-500/10 text-amber-400',
};

function DashboardContent({ activeTab, t }: { activeTab: string; t: any }) {
  const salesData = useMemo(() => [
    { month: t.dashboard.months.jan, revenue: 42000, orders: 340 },
    { month: t.dashboard.months.feb, revenue: 48000, orders: 380 },
    { month: t.dashboard.months.mar, revenue: 55000, orders: 420 },
    { month: t.dashboard.months.apr, revenue: 51000, orders: 390 },
    { month: t.dashboard.months.may, revenue: 62000, orders: 460 },
    { month: t.dashboard.months.jun, revenue: 71000, orders: 520 },
    { month: t.dashboard.months.jul, revenue: 68000, orders: 490 },
    { month: t.dashboard.months.aug, revenue: 78000, orders: 560 },
  ], [t]);

  const inventoryData = useMemo(() => [
    { name: t.dashboard.categories.electronics, value: 35 },
    { name: t.dashboard.categories.clothing, value: 25 },
    { name: t.dashboard.categories.food, value: 20 },
    { name: t.dashboard.categories.furniture, value: 15 },
    { name: t.dashboard.categories.other, value: 5 },
  ], [t]);

  const getStatusLabel = (statusKey: string) => {
    switch (statusKey) {
      case 'Completed': return t.dashboard.statuses.completed;
      case 'Processing': return t.dashboard.statuses.processing;
      case 'Shipped': return t.dashboard.statuses.shipped;
      case 'Pending': return t.dashboard.statuses.pending;
      default: return statusKey;
    }
  };

  const content = useMemo(() => {
    switch (activeTab) {
      case 'sales':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 glass-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-slate-400 mb-4">{t.dashboard.revenueOverview}</h4>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f0f2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name={t.dashboard.revenueOverview}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-slate-400 mb-4">{t.dashboard.recentOrders}</h4>
              <div className="space-y-3">
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white font-medium">{order.customer}</div>
                      <div className="text-xs text-slate-500">{order.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{order.amount}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.statusKey]}`}>
                        {getStatusLabel(order.statusKey)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-slate-400 mb-4">{t.dashboard.stockDistribution}</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {inventoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f0f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 glass-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-slate-400 mb-4">{t.dashboard.stockLevels}</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f0f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
                  <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-slate-400 mb-4">{t.dashboard.tabs[activeTab as keyof typeof t.dashboard.tabs] || activeTab} - {t.dashboard.trends}</h4>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f0f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-slate-400 mb-4">{t.dashboard.distribution}</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f0f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
    }
  }, [activeTab, salesData, inventoryData, t]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

export const DashboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const { t } = useLanguage();

  const tabs = [
    { id: 'sales', label: t.dashboard.tabs.sales, icon: DollarSign },
    { id: 'inventory', label: t.dashboard.tabs.inventory, icon: Package },
    { id: 'invoices', label: t.dashboard.tabs.invoices, icon: FileText },
    { id: 'accounting', label: t.dashboard.tabs.accounting, icon: Calculator },
    { id: 'hr', label: t.dashboard.tabs.hr, icon: Users },
    { id: 'projects', label: t.dashboard.tabs.projects, icon: FolderKanban },
    { id: 'crm', label: t.dashboard.tabs.crm, icon: Contact },
    { id: 'analytics', label: t.dashboard.tabs.analytics, icon: BarChart3 },
  ];

  const kpiCards = [
    { label: t.dashboard.kpi.totalRevenue, value: '$2.4M', change: '+12.5%', up: true, icon: TrendingUp },
    { label: t.dashboard.kpi.activeOrders, value: '1,847', change: '+8.2%', up: true, icon: ShoppingCart },
    { label: t.dashboard.kpi.newCustomers, value: '384', change: '+23.1%', up: true, icon: UserCheck },
    { label: t.dashboard.kpi.conversionRate, value: '3.24%', change: '-1.8%', up: false, icon: BarChart3 },
  ];

  return (
    <SectionWrapper id="dashboard">
      <SectionHeader
        badge={t.dashboard.badge}
        title={t.dashboard.title}
        titleHighlight={t.dashboard.titleHighlight}
        description={t.dashboard.description}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="glass-card rounded-xl p-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="w-5 h-5 text-slate-500" />
              <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className="text-xs text-slate-500 mt-1">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Frame */}
      <motion.div
        className="glass-card rounded-2xl p-1 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Tab Bar */}
        <div className="flex items-center gap-1 p-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          <DashboardContent activeTab={activeTab} t={t} />
        </div>
      </motion.div>
    </SectionWrapper>
  );
};
