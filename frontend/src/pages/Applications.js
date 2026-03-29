import { useState, useEffect, useCallback } from 'react';
import { getApplications, createApplication, updateApplication, deleteApplication, getApplication, createInterview, updateInterview, deleteInterview } from '../utils/api';
import { StatusBadge } from '../components/StatusBadge';
import ApplicationModal from '../components/ApplicationModal';
import InterviewModal from '../components/InterviewModal';
import { format } from 'date-fns';

const FILTERS = ['All', 'Applied', 'Phone Screen', 'Technical Interview', 'Onsite Interview', 'Final Round', 'Offer', 'Rejected'];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editInterview, setEditInterview] = useState(null);

  const load = useCallback(async () => {
    const params = {};
    if (filter !== 'All') params.status = filter;
    if (search) params.search = search;
    const r = await getApplications(params);
    setApps(Array.isArray(r.data) ? r.data : []);
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const refreshSelected = async (id) => {
    const r = await getApplication(id);
    setSelected(r.data);
  };

  const handleSaveApp = async (form) => {
    if (editApp) {
      await updateApplication(editApp.id, form);
    } else {
      await createApplication(form);
    }
    setShowAppModal(false);
    setEditApp(null);
    load();
    if (selected && editApp?.id === selected.id) refreshSelected(selected.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    await deleteApplication(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const handleSaveInterview = async (form) => {
    if (editInterview) {
      await updateInterview(editInterview.id, form);
    } else {
      await createInterview(selected.id, form);
    }
    setShowInterviewModal(false);
    setEditInterview(null);
    refreshSelected(selected.id);
    load();
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    await deleteInterview(id);
    refreshSelected(selected.id);
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Applications</h1>
            <p>{apps.length} total{filter !== 'All' ? ` · filtered by ${filter}` : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditApp(null); setShowAppModal(true); }}>
            + Add Application
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="form-input search-input"
          placeholder="Search company or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="loading"><div className="spinner" /> Loading...</div>
          ) : apps.length === 0 ? (
            <div className="empty-state">
              <div className="icon">◫</div>
              <h3>No applications yet</h3>
              <p>Start tracking your job applications to stay organized.</p>
              <button className="btn btn-primary" onClick={() => setShowAppModal(true)}>Add your first application</button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Location</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id} onClick={() => refreshSelected(app.id)} style={{ background: selected?.id === app.id ? 'var(--bg-3)' : undefined }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="company-avatar">{app.company[0]}</div>
                          <span style={{ fontWeight: 500 }}>{app.company}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.role}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'DM Mono' }}>
                        {app.applied_date ? format(new Date(app.applied_date), 'MMM d') : '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{app.location || '—'}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => { setEditApp(app); setShowAppModal(true); }}>Edit</button>
                          <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => handleDelete(app.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div className="company-avatar" style={{ width: 40, height: 40, fontSize: 18 }}>{selected.company[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{selected.company}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{selected.role}</div>
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <StatusBadge status={selected.status} />

            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Applied', value: selected.applied_date ? format(new Date(selected.applied_date), 'MMM d, yyyy') : null },
                { label: 'Location', value: selected.location },
                { label: 'Salary', value: selected.salary_min ? `$${selected.salary_min.toLocaleString()}${selected.salary_max ? ` – $${selected.salary_max.toLocaleString()}` : '+'}` : null },
              ].filter(i => i.value).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 12 }}>{value}</span>
                </div>
              ))}
              {selected.job_url && (
                <a href={selected.job_url} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 12, marginTop: 4 }}>
                  View Job Posting ↗
                </a>
              )}
            </div>

            {selected.notes && (
              <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-3)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {selected.notes}
              </div>
            )}

            {/* Interviews */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14 }}>Interview Stages</h3>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}
                  onClick={() => { setEditInterview(null); setShowInterviewModal(true); }}>
                  + Add
                </button>
              </div>

              {selected.interviews?.length === 0 ? (
                <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>No interviews scheduled yet.</p>
              ) : (
                <div className="timeline">
                  {selected.interviews?.map(iv => (
                    <div className="timeline-item" key={iv.id}>
                      <div className={`timeline-dot ${iv.completed ? 'done' : ''}`}>
                        {iv.completed ? '✓' : '○'}
                      </div>
                      <div className="timeline-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4>{iv.stage}</h4>
                            {iv.scheduled_date && (
                              <p>{format(new Date(iv.scheduled_date), 'MMM d, h:mm a')}</p>
                            )}
                            {iv.interviewer && <p>with {iv.interviewer}</p>}
                            {iv.outcome && (
                              <span style={{ fontSize: 11, color: iv.outcome === 'Passed' || iv.outcome === 'Offer' ? 'var(--accent)' : iv.outcome === 'Rejected' ? 'var(--red)' : 'var(--amber)' }}>
                                {iv.outcome}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-ghost" style={{ fontSize: 11, padding: '2px 6px' }}
                              onClick={() => { setEditInterview(iv); setShowInterviewModal(true); }}>Edit</button>
                            <button className="btn btn-danger" style={{ fontSize: 11, padding: '2px 6px' }}
                              onClick={() => handleDeleteInterview(iv.id)}>✕</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showAppModal && (
        <ApplicationModal app={editApp} onSave={handleSaveApp} onClose={() => { setShowAppModal(false); setEditApp(null); }} />
      )}
      {showInterviewModal && selected && (
        <InterviewModal applicationId={selected.id} interview={editInterview} onSave={handleSaveInterview} onClose={() => { setShowInterviewModal(false); setEditInterview(null); }} />
      )}
    </div>
  );
}
