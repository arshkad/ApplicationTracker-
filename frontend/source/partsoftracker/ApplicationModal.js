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
  }
};