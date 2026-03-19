import { useState, useEffect } from 'react';
import { getApplications } from '../utils/api';
import { StatusBadge } from '../components/StatusBadge';
import { format } from 'date-fns';

const STATUSES = ['Applied', 'Phone Screen', 'Technical Interview', 'Onsite Interview', 'Final Round', 'Offer', 'Rejected'];

export default function Dashboard({ setPage }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications().then(r => { setApps(r.data); setLoading(false); });
  }, []);

  const total = apps.length;
  const active = apps.filter(a => !['Rejected', 'Withdrawn', 'Offer'].includes(a.status)).length;
  const offers = apps.filter(a => a.status === 'Offer').length;
  const responseRate = total ? Math.round((apps.filter(a => a.status !== 'Applied').length / total) * 100) : 0;

  const byStatus = STATUSES.map(s => ({ status: s, count: apps.filter(a => a.status === s).length }));
  const recent = [...apps].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  if (loading) return <div className="loading"><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your job search at a glance</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Applied', value: total, sub: 'all time' },
          { label: 'Active', value: active, sub: 'in progress' },
          { label: 'Response Rate', value: `${responseRate}%`, sub: 'heard back' },
          { label: 'Offers', value: offers, sub: '🎉 congrats!' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div> 