import React, { useState, useEffect } from 'react';
import {
  People as PeopleIcon,
  VpnKey as RolesIcon,
  Security as PermissionsIcon,
  DeviceHub as SessionsIcon,
} from '@mui/icons-material';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import api from '../../services/api';

const COLORS = {
  indigo: '#4F46E5',    // Deep Indigo
  violet: '#7C3AED',    // Rich Violet
  fuchsia: '#D946EF',   // Bright Fuchsia
  cyan: '#06B6D4',      // Vivid Cyan
  rose: '#F43F5E',      // Warm Rose
  amber: '#F59E0B',     // Golden Amber
  emerald: '#10B981',   // Fresh Emerald
  sky: '#0EA5E9',       // Bright Sky Blue
  purple: '#9333EA',    // Deep Purple
  teal: '#14B8A6',      // Ocean Teal
  orange: '#F97316',    // Vibrant Orange
  lime: '#84CC16',      // Fresh Lime
};

function DashboardCard({ title, value, icon, loading, color, trend }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide">{title}</p>
          {loading ? (
            <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-primary rounded-full border-t-transparent" />
          ) : (
            <div className="flex items-baseline space-x-2">
              <h3 className={`text-xl sm:text-3xl font-bold text-${color}`}>{value}</h3>
              {trend && (
                <span className={`text-xs sm:text-sm font-semibold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 sm:p-4 bg-${color}/10 rounded-full transform transition-transform duration-300 hover:scale-110`}>
          {React.cloneElement(icon, { className: `text-${color} h-6 w-6 sm:h-8 sm:w-8` })}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="transition-all duration-300 hover:scale-[1.02]">
        {children}
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
    sessions: 0,
  });
  const [roleData, setRoleData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [permissionDistribution, setPermissionDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPieChartDimensions = () => {
    if (windowWidth < 380) {  // Extra small devices
      return {
        innerRadius: 30,
        outerRadius: 50,
        labelOffset: 10,
      };
    } else if (windowWidth < 768) {  // Mobile devices
      return {
        innerRadius: 40,
        outerRadius: 65,
        labelOffset: 15,
      };
    } else {  // Tablets and larger
      return {
        innerRadius: 60,
        outerRadius: 100,
        labelOffset: 20,
      };
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [users, roles, permissions] = await Promise.all([
        api.getUsers(),
        api.getRoles(),
        api.getPermissions(),
      ]);

      // Basic stats
      setStats({
        users: users.length,
        roles: roles.length,
        permissions: permissions.length,
        sessions: users.filter(u => u.status === 'Active').length,
      });

      // Role data for bar chart
      const roleStats = roles.map(role => ({
        name: role.name,
        permissions: role.permissions.length,
      }));
      setRoleData(roleStats);

      // Permission distribution for pie chart
      const permCount = {};
      roles.forEach(role => {
        role.permissions.forEach(perm => {
          permCount[perm] = (permCount[perm] || 0) + 1;
        });
      });
      const permStats = Object.entries(permCount).map(([name, value]) => ({
        name,
        value,
      }));
      setPermissionDistribution(permStats);

      // User role distribution data
      const roleCount = {};
      users.forEach(user => {
        roleCount[user.role] = (roleCount[user.role] || 0) + 1;
      });
      
      const userRoleStats = Object.entries(roleCount).map(([role, count]) => ({
        name: role,
        users: count,
      }));
      setUserRoleData(userRoleStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm sm:text-base">Welcome to your analytics dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Total Users"
            value={stats.users}
            icon={<PeopleIcon />}
            loading={loading}
            color="indigo"
            trend={12}
          />
          <DashboardCard
            title="Total Roles"
            value={stats.roles}
            icon={<RolesIcon />}
            loading={loading}
            color="violet"
            trend={5}
          />
          <DashboardCard
            title="Total Permissions"
            value={stats.permissions}
            icon={<PermissionsIcon />}
            loading={loading}
            color="emerald"
            trend={-2}
          />
          <DashboardCard
            title="Active Sessions"
            value={stats.sessions}
            icon={<SessionsIcon />}
            loading={loading}
            color="rose"
            trend={8}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Role Permissions Distribution">
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData} margin={{ top: 20, right: 30, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#4B5563', fontSize: '0.75rem' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#4B5563', fontSize: '0.75rem' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    domain={[0, 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '0.75rem',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Bar 
                    dataKey="permissions" 
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                    animationDuration={2000}
                    animationBegin={200}
                  >
                    {roleData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Permission Usage">
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: -15, bottom: 0 }}>
                  <Pie
                    data={permissionDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={getPieChartDimensions().innerRadius}
                    outerRadius={getPieChartDimensions().outerRadius}
                    paddingAngle={4}
                    label={({ name, percent }) => {
                      if (windowWidth < 380) {
                        return `${(percent * 100).toFixed(0)}%`;
                      } else if (windowWidth < 768) {
                        const shortName = name.length > 8 ? `${name.substring(0, 8)}...` : name;
                        return `${shortName}\n${(percent * 100).toFixed(0)}%`;
                      }
                      return `${name} (${(percent * 100).toFixed(0)}%)`;
                    }}
                    labelLine={{
                      stroke: '#6B7280',
                      strokeWidth: 1,
                      strokeDasharray: '2,2',
                      offsetRadius: getPieChartDimensions().labelOffset,
                    }}
                  >
                    {permissionDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                        stroke="white"
                        strokeWidth={2}
                        style={{ 
                          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '0.75rem',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      padding: '12px',
                      fontSize: windowWidth < 768 ? '12px' : '14px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    iconSize={windowWidth < 768 ? 8 : 10}
                    formatter={(value) => (
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {windowWidth < 380 && value.length > 8 
                          ? `${value.substring(0, 8)}...` 
                          : value}
                      </span>
                    )}
                    wrapperStyle={{
                      fontSize: windowWidth < 768 ? '10px' : '12px',
                      paddingTop: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="User Role Distribution" className="lg:col-span-2">
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={userRoleData} 
                  margin={{ top: 20, right: 30, left: -15, bottom: 0 }}
                  maxBarSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#4B5563', fontSize: '0.75rem' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#4B5563', fontSize: '0.75rem' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    domain={[0, 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '0.75rem',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Bar 
                    dataKey="users" 
                    name="Number of Users"
                    radius={[8, 8, 0, 0]}
                    barSize={30}
                    animationDuration={2000}
                    animationBegin={200}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 