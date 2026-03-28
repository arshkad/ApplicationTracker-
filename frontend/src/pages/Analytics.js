import { useState, useEffect } from 'react';
import { getAnalytics, getApplications } from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#5fa8ff', '#ffb347', '#a78bfa', '#5ff0d4', '#c8f261', '#ff5f5f', '#565a70'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || 'var(--accent)' }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getApplications()]).then(([a, b]) => {
      setAnalytics(a.data);
      setApps(b.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /> Loading analytics...</div>;

  const total = parseInt(analytics?.responseRate?.total || 0);
  const responded = parseInt(analytics?.responseRate?.responded || 0);
  const responseRate = total ? Math.round((responded / total) * 100) : 0;

  const statusData = (analytics?.byStatus || []).map(r => ({ name: r.status, value: parseInt(r.count) }));
  const monthlyData = (analytics?.byMonth || []).map(r => ({ month: r.month, applications: parseInt(r.count) }));

  // Weekly activity (from apps array)
  const last30 = apps.filter(a => new Date(a.created_at) > new Date(Date.now() - 30 * 86400000));
  const byWeekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => ({
    day,
    count: last30.filter(a => new Date(a.created_at).getDay() === i).length
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Insights across {total} applications</p>
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <div className="icon">◈</div>
          <h3>No data yet</h3>
          <p>Add some applications to see your analytics.</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            {[
              { label: 'Total Applications', value: total },
              { label: 'Response Rate', value: `${responseRate}%` },
              { label: 'Active Pipeline', value: apps.filter(a => !['Rejected', 'Withdrawn', 'Offer'].includes(a.status)).length },
              { label: 'Offers', value: apps.filter(a => a.status === 'Offer').length },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Status Breakdown */}
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 20 }}>Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Volume */}
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 20 }}>Monthly Applications</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="applications" fill="var(--accent)" radius={[4,4,0,0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekday Activity */}
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 20 }}>Activity by Day of Week (last 30 days)</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={byWeekday} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Applications" fill="var(--purple)" radius={[4,4,0,0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
