export const STATUSES = [
    'Applied',
    'Phone Screen',
    'Technical Interview',
    'Onsite Interview',
    'Final Round',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];
  
  export const INTERVIEW_STAGES = [
    'Phone Screen',
    'Technical',
    'Take-Home',
    'Onsite',
    'Final Round',
    'HR',
    'Other',
  ];
  
  export const statusClass = (status) => {
    const map = {
      'Applied': 'badge-applied',
      'Phone Screen': 'badge-phone',
      'Technical Interview': 'badge-technical',
      'Onsite Interview': 'badge-onsite',
      'Final Round': 'badge-finalround',
      'Offer': 'badge-offer',
      'Rejected': 'badge-rejected',
      'Withdrawn': 'badge-withdrawn',
    };
    return map[status] || 'badge-applied';
  };
  
  export const statusDot = (status) => {
    const map = {
      'Applied': '○',
      'Phone Screen': '◎',
      'Technical Interview': '◈',
      'Onsite Interview': '◉',
      'Final Round': '★',
      'Offer': '✦',
      'Rejected': '✕',
      'Withdrawn': '—',
    };
    return map[status] || '○';
  };
  
  export const StatusBadge = ({ status }) => (
    <span className={`badge ${statusClass(status)}`}>
      {statusDot(status)} {status}
    </span>
  );