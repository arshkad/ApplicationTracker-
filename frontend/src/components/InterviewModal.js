import { useState } from 'react';
import { INTERVIEW_STAGES } from './StatusBadge';

const OUTCOMES = ['', 'Passed', 'Rejected', 'Offer', 'Pending'];

export default function InterviewModal({ applicationId, interview, onSave, onClose }) {
  const [form, setForm] = useState({
    stage: interview?.stage || 'Phone Screen',
    scheduled_date: interview?.scheduled_date ? new Date(interview.scheduled_date).toISOString().slice(0,16) : '',
    interviewer: interview?.interviewer || '',
    notes: interview?.notes || '',
    completed: interview?.completed || false,
    outcome: interview?.outcome || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <h2>{interview ? 'Edit Interview' : 'Add Interview'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Stage</label>
          <select className="form-select" value={form.stage} onChange={set('stage')}>
            {INTERVIEW_STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Scheduled Date & Time</label>
          <input className="form-input" type="datetime-local" value={form.scheduled_date} onChange={set('scheduled_date')} />
        </div>

        <div className="form-group">
          <label className="form-label">Interviewer(s)</label>
          <input className="form-input" value={form.interviewer} onChange={set('interviewer')} placeholder="Name, title..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Outcome</label>
            <select className="form-select" value={form.outcome} onChange={set('outcome')}>
              {OUTCOMES.map(o => <option key={o} value={o}>{o || '— Not yet —'}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
              <input type="checkbox" checked={form.completed} onChange={set('completed')} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
              Mark as completed
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" value={form.notes} onChange={set('notes')} placeholder="Questions asked, feedback, prep notes..." />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? '...' : interview ? 'Save' : 'Add Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}
