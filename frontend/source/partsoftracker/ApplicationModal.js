import { useState, useEffect } from 'react';
import { STATUSES } from './StatusBadge';

const defaultForm = {
  company: '', role: '', status: 'Applied', applied_date: new Date().toISOString().split('T')[0],
  location: '', salary_min: '', salary_max: '', job_url: '', notes: '',
};

export default function ApplicationModal({ app, onSave, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (app) {
      setForm({
        ...app,
        applied_date: app.applied_date?.split('T')[0] || '',
        salary_min: app.salary_min || '',
        salary_max: app.salary_max || '',
      });
    }
  }, [app]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.applied_date) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>{app ? 'Edit Application' : 'Add Application'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              {app ? `${app.company} · ${app.role}` : 'Track a new job opportunity'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company *</label>
            <input className="form-input" value={form.company} onChange={set('company')} placeholder="e.g. Google" />
          </div>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <input className="form-input" value={form.role} onChange={set('role')} placeholder="e.g. Software Engineer" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={set('status')}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Applied Date *</label>
            <input className="form-input" type="date" value={form.applied_date} onChange={set('applied_date')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={form.location} onChange={set('location')} placeholder="e.g. San Francisco, CA · Remote" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Salary Min ($)</label>
            <input className="form-input" type="number" value={form.salary_min} onChange={set('salary_min')} placeholder="80000" />
          </div>
          <div className="form-group">
            <label className="form-label">Salary Max ($)</label>
            <input className="form-input" type="number" value={form.salary_max} onChange={set('salary_max')} placeholder="120000" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Job URL</label>
          <input className="form-input" value={form.job_url} onChange={set('job_url')} placeholder="https://..." />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" value={form.notes} onChange={set('notes')} placeholder="Recruiter contact, key requirements, interview prep notes..." />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? '...' : app ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
