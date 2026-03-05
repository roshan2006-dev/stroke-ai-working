import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  FaArrowUp, FaArrowDown, FaMinus, FaHeartbeat,
  FaExclamationTriangle, FaClock, FaCheckCircle
} from 'react-icons/fa';

const DashboardHome = ({ stats }) => {
  const weeklyData = [
    { day: 'Mon', scans: 45, strokes: 12 },
    { day: 'Tue', scans: 52, strokes: 15 },
    { day: 'Wed', scans: 48, strokes: 10 },
    { day: 'Thu', scans: 61, strokes: 18 },
    { day: 'Fri', scans: 55, strokes: 14 },
    { day: 'Sat', scans: 38, strokes: 8 },
    { day: 'Sun', scans: 42, strokes: 9 }
  ];

  const severityData = [
    { name: 'Low', value: 35, color: '#4CAF50' },
    { name: 'Moderate', value: 40, color: '#FF9800' },
    { name: 'High', value: 20, color: '#f44336' },
    { name: 'Critical', value: 5, color: '#9C27B0' }
  ];

  const recentCases = [
    { id: 1, patient: 'John D.', age: 65, type: 'ISCHEMIC', severity: 'High', time: '5 min ago', status: 'urgent' },
    { id: 2, patient: 'Sarah M.', age: 72, type: 'HEMORRHAGIC', severity: 'Critical', time: '12 min ago', status: 'critical' },
    { id: 3, patient: 'Robert K.', age: 58, type: 'NORMAL', severity: 'None', time: '25 min ago', status: 'normal' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Scans"
          value={stats.totalScans}
          change="+12.3%"
          trend="up"
          icon={<FaHeartbeat />}
          color="blue"
        />
        <KPICard 
          title="Strokes Detected"
          value={stats.strokesDetected}
          change="+5.7%"
          trend="up"
          icon={<FaExclamationTriangle />}
          color="orange"
        />
        <KPICard 
          title="Critical Cases"
          value={stats.criticalCases}
          change="-2.1%"
          trend="down"
          icon={<FaClock />}
          color="red"
        />
        <KPICard 
          title="Accuracy"
          value={`${stats.accuracy}%`}
          change="+1.2%"
          trend="up"
          icon={<FaCheckCircle />}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Weekly Activity">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #333' }} />
              <Area type="monotone" dataKey="scans" stroke="#667eea" fillOpacity={1} fill="url(#colorScans)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Severity Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #333' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Cases */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Cases</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left py-2">Patient</th>
                <th className="text-left py-2">Age</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Severity</th>
                <th className="text-left py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((case_) => (
                <tr key={case_.id} className="border-t border-white/10">
                  <td className="py-3 text-white">{case_.patient}</td>
                  <td className="py-3 text-gray-300">{case_.age}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      case_.type === 'ISCHEMIC' ? 'bg-blue-500/20 text-blue-400' :
                      case_.type === 'HEMORRHAGIC' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {case_.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      case_.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      case_.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      case_.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {case_.severity}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">{case_.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const KPICard = ({ title, value, change, trend, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
        {icon}
      </div>
    </div>
    <div className={`mt-4 flex items-center text-sm ${
      trend === 'up' ? 'text-green-400' : 
      trend === 'down' ? 'text-red-400' : 'text-gray-400'
    }`}>
      {trend === 'up' && <FaArrowUp className="mr-1" />}
      {trend === 'down' && <FaArrowDown className="mr-1" />}
      <span>{change}</span>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

export default DashboardHome;