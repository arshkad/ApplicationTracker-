export default function Sidebar({ page, setPage }) {
  const nav = [
    { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
    { id: 'applications', icon: '◫', label: 'Applications' },
    { id: 'analytics', icon: '◈', label: 'Analytics' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        Trakkr
        <span>job application tracker</span>
      </div>
      {nav.map(item => (
        <button
          key={item.id}
          className={`nav-item ${page === item.id ? 'active' : ''}`}
          onClick={() => setPage(item.id)}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
