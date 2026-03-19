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
    setApps(r.data);
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