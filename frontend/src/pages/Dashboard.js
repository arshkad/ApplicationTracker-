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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Funnel */}
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Application Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byStatus.filter(s => s.count > 0).map(({ status, count }) => (
              <div key={status}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{status}</span>
                  <span style={{ fontSize: 12, fontFamily: 'DM Mono', color: 'var(--text)' }}>{count}</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${total ? (count / total) * 100 : 0}%`,
                    background: 'var(--accent)',
                    opacity: 0.7,
                    borderRadius: 2,
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            ))}
            {total === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No applications yet.</p>}
          </div>
        </div>

        {/* Recent */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16 }}>Recent Applications</h3>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setPage('applications')}>
              View all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.map(app => (
              <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="company-avatar">{app.company[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.company}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.role}</div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
            {recent.length === 0 && (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <p>No applications yet. Start tracking!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
