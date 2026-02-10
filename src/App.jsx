import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  Users,
  Tally5,
  Languages,
  Bell,
  Plus,
  Eye,
  Send,
  Award,
  BarChart2,
  RefreshCcw,
  X,
  CheckCircle,
  Menu,
  Search,
  Trash2,
  Ban,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const INITIAL_USERS = [
  { id: 1, name: 'Anish Kumar', email: 'anish@example.com', score: 125, status: 'Active', joinedDate: '2026-01-15' },
  { id: 2, name: 'Priya Dharshini', email: 'priya@example.com', score: 98, status: 'Active', joinedDate: '2026-01-20' },
  { id: 3, name: 'Rahul Raj', email: 'rahul@example.com', score: 45, status: 'Banned', joinedDate: '2026-02-01' },
  { id: 4, name: 'Sowmya G', email: 'sowmya@example.com', score: 210, status: 'Active', joinedDate: '2026-01-10' },
  { id: 5, name: 'Karthik S', email: 'karthik@example.com', score: 75, status: 'Active', joinedDate: '2026-02-05' }
];

const INITIAL_SUBMISSIONS = [
  { id: 101, userId: 1, userName: 'Anish Kumar', sentence: 'The ocean is vast and mysterious.', date: '2026-02-10', time: '10:30 AM' },
  { id: 102, userId: 2, userName: 'Priya Dharshini', sentence: 'She like to play piano every day.', date: '2026-02-10', time: '11:15 AM' },
  { id: 103, userId: 4, userName: 'Sowmya G', sentence: 'Resilience is key to success in any field.', date: '2026-02-09', time: '09:00 PM' },
  { id: 104, userId: 5, userName: 'Karthik S', sentence: 'I am reading a book now.', date: '2026-02-09', time: '04:45 PM' }
];

const ACTIVITY_DATA = [12, 18, 15, 25, 20, 30, 22];

// --- Animation Variants ---
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

const cardHover = {
  whileHover: { y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
  transition: { type: 'spring', stiffness: 300 }
};

// --- Components ---

const Sidebar = ({ currentSection, setSection, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'word-management', label: 'Word of the Day', icon: CalendarDays },
    { id: 'submissions', label: 'Submissions', icon: ClipboardCheck },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'scores', label: 'Score Monitoring', icon: Tally5 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay"
            style={{ zIndex: 90 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Languages size={28} strokeWidth={2.5} />
            <span>WordAdmin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => {
                setSection(item.id);
                setIsOpen(false);
              }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-pic">A</div>
            <div className="profile-info">
              <span className="name">Admin User</span>
              <span className="role">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ title, toggleSidebar }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="top-bar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="top-bar-actions">
        <div className="date-display">
          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Bell size={20} />
        </motion.button>
      </div>
    </header>
  );
};

const Dashboard = ({ users, submissions, setSection }) => {
  const today = new Date().toISOString().split('T')[0];
  const submissionsToday = submissions.filter(s => s.date === today);
  const totalScore = users.reduce((acc, u) => acc + u.score, 0);
  const avgScore = users.length ? Math.round(totalScore / users.length) : 0;

  return (
    <motion.div {...pageTransition}>
      <div className="stats-grid">
        <motion.div className="stat-card" {...cardHover}>
          <div className="stat-icon users"><Users size={24} /></div>
          <div className="stat-details">
            <span className="stat-label">Total Users</span>
            <h3>{users.length}</h3>
          </div>
        </motion.div>
        <motion.div className="stat-card" {...cardHover}>
          <div className="stat-icon submissions"><Send size={24} /></div>
          <div className="stat-details">
            <span className="stat-label">Sentences Today</span>
            <h3>{submissionsToday.length}</h3>
          </div>
        </motion.div>
        <motion.div className="stat-card" {...cardHover}>
          <div className="stat-icon info"><Award size={24} /></div>
          <div className="stat-details">
            <span className="stat-label">Avg Weekly Score</span>
            <h3>{avgScore}</h3>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-secondary-grid">
        <div className="card">
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <div className="card-title-group">
              <h2>Recent Submissions</h2>
              <p>Updates from the last 24 hours</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setSection('submissions')}>View All</button>
          </div>
          <div className="status-list">
            {submissions.slice(0, 3).map(sub => (
              <div key={sub.id} className="status-item" style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{sub.userName.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{sub.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub.sentence.substring(0, 40)}...</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {sub.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h2>Overview & Actions</h2>
            </div>
          </div>
          <div className="status-list">
            <div className="status-item">
              <span style={{ fontWeight: 600, color: '#475569' }}>Today's Word Status</span>
              <span className="badge badge-negative">Pending Upload</span>
            </div>
            <div className="status-item">
              <span style={{ fontWeight: 600, color: '#475569' }}>User Verification</span>
              <span className="badge badge-positive">All Verified</span>
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSection('word-management')}>
                <Plus size={18} /> Post Word
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSection('users')}>
                <Users size={18} /> Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const WordManagement = ({ showToast }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    englishWord: '',
    englishMeaning: '',
    englishExample: '',
    tamilWord: '',
    tamilMeaning: '',
    tamilExample: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Daily word published successfully!');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        englishWord: '',
        englishMeaning: '',
        englishExample: '',
        tamilWord: '',
        tamilMeaning: '',
        tamilExample: ''
      });
    }, 1000);
  };

  return (
    <motion.div {...pageTransition}>
      <AnimatePresence>
        {isSaving && (
          <motion.div
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="spinner"></div>
            <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Publishing Today's Word...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Compose Daily Word</h2>
            <p>Define the learning content for English learners today.</p>
          </div>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Date for Word</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>English Word</label>
              <input type="text" placeholder="e.g. Resilience" required value={formData.englishWord} onChange={(e) => setFormData({ ...formData, englishWord: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label>English Meaning</label>
              <textarea rows="2" placeholder="The capacity to recover quickly from difficulties." required value={formData.englishMeaning} onChange={(e) => setFormData({ ...formData, englishMeaning: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label>English Example Sentence</label>
              <textarea rows="2" placeholder="She showed great resilience after the set back." required value={formData.englishExample} onChange={(e) => setFormData({ ...formData, englishExample: e.target.value })} />
            </div>

            <div className="form-divider" />

            <div className="form-group">
              <label>Tamil Translation</label>
              <input type="text" placeholder="e.g. மீண்டெழும் திறன்" required value={formData.tamilWord} onChange={(e) => setFormData({ ...formData, tamilWord: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label>Tamil Meaning</label>
              <textarea rows="2" placeholder="சவால்களை எதிர்கொண்டு மீண்டும் பழைய நிலைக்குத் திரும்பும் திறன்." required value={formData.tamilMeaning} onChange={(e) => setFormData({ ...formData, tamilMeaning: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label>Tamil Example Sentence</label>
              <textarea rows="2" placeholder="தோல்விக்குப் பிறகும் அவர் மீண்டெழும் திறனைக் காட்டினார்." required value={formData.tamilExample} onChange={(e) => setFormData({ ...formData, tamilExample: e.target.value })} />
            </div>
          </div>
          <div className="form-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              <Send size={18} /> Publish Content
            </button>
            <button type="reset" className="btn btn-outline" onClick={() => setFormData({
              ...formData,
              englishWord: '', englishMeaning: '', englishExample: '',
              tamilWord: '', tamilMeaning: '', tamilExample: ''
            })}>
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const Submissions = ({ submissions }) => {
  const [search, setSearch] = useState('');

  const filteredSubs = useMemo(() => {
    return submissions.filter(s =>
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.sentence.toLowerCase().includes(search.toLowerCase())
    );
  }, [submissions, search]);

  return (
    <motion.div {...pageTransition}>
      <div className="card">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by user or sentence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Submitted Sentence</th>
                <th style={{ textAlign: 'right' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length > 0 ? filteredSubs.map((sub) => (
                <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td><strong>{sub.userName}</strong></td>
                  <td>"{sub.sentence}"</td>
                  <td style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem' }}>{sub.time}</td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="3">
                    <div className="empty-state">
                      <div className="empty-state-icon"><X size={32} /></div>
                      <h3>No submissions found</h3>
                      <p>Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const UserManagement = ({ users, toggleStatus, deleteSub, showConfirm }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <motion.div {...pageTransition}>
      <div className="card">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Info</th>
                <th>Weekly Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><strong>{user.score} pts</strong></td>
                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'badge-positive' : 'badge-negative'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className={`btn btn-sm ${user.status === 'Active' ? 'btn-outline' : 'btn-primary'}`}
                        style={{ minWidth: '94px' }}
                        title={user.status === 'Active' ? 'Restrict account access' : 'Restore account access'}
                        onClick={() => showConfirm(
                          user.status === 'Active' ? 'Ban User Account' : 'Unban User Account',
                          `This will ${user.status === 'Active' ? 'restrict' : 'restore'} access for ${user.name}. Are you sure?`,
                          () => toggleStatus(user.id)
                        )}
                      >
                        {user.status === 'Active' ? <><Ban size={14} /> Ban User</> : 'Unban'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger-outline"
                        title="Delete most recent submission"
                        onClick={() => showConfirm(
                          'Delete Recent Record',
                          `Permanently delete the last sentence submitted by ${user.name}? This cannot be undone.`,
                          () => deleteSub(user.id)
                        )}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <div className="empty-state-icon"><Users size={32} /></div>
                      <h3>No users found</h3>
                      <p>Try refining your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const ScoreMonitoring = ({ users, resetScores, showConfirm }) => {
  const sorted = [...users].sort((a, b) => b.score - a.score);
  const maxActivity = Math.max(...ACTIVITY_DATA);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <motion.div {...pageTransition}>
      <div className="scores-header">
        <button className="btn btn-danger" onClick={() => showConfirm('Reset All Weekly Scores', 'This will set the weekly progress to zero for all users. Continue?', resetScores)}>
          <RefreshCcw size={18} /> Reset Weekly Cycle
        </button>
      </div>

      <div className="scores-grid">
        <div className="card">
          <div className="card-header" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title-group">
              <h2>Top Global Performers</h2>
              <p>Leaderboard this week</p>
            </div>
            <Award size={24} color="var(--warning)" />
          </div>
          <div className="status-list">
            {sorted.slice(0, 3).map((u, i) => (
              <div className="status-item" key={u.id} style={{ padding: '1rem', background: i === 0 ? 'var(--primary-light)' : '#f8fafc', borderRadius: '12px', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: i === 0 ? 'var(--primary)' : '#64748b' }}>{i + 1}</span>
                  <strong>{u.name}</strong>
                </div>
                <strong>{u.score} pts</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h2>Engagement Level</h2>
              <p>Sentence submissions per day</p>
            </div>
          </div>
          <div className="chart-mockup">
            {ACTIVITY_DATA.map((val, i) => (
              <div key={i} className="bar-wrapper">
                <motion.div
                  className="bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxActivity) * 100}%` }}
                >
                  <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{val}</div>
                </motion.div>
                <div className="bar-label">{days[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Submissions</th>
              <th>Weekly Score</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((u, i) => (
              <tr key={u.id}>
                <td><strong>#{i + 1}</strong></td>
                <td>{u.name}</td>
                <td>{Math.floor(u.score / 10)}</td>
                <td><strong className="text-primary">{u.score} pts</strong></td>
                <td style={{ width: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((u.score / 250) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{
                          height: '100%',
                          background: u.score > 150 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #4f46e5, #818cf8)',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', minWidth: '30px' }}>
                      {Math.min(Math.round((u.score / 250) * 100), 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const Modal = ({ show, title, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="modal-close" onClick={onCancel}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={onCancel}>Keep Access</button>
              <button className="btn btn-danger" onClick={() => { onConfirm(); onCancel(); }}>Execute Action</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  const [currentSection, setSection] = useState('dashboard');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (title, message, onConfirm) => {
    setModal({ show: true, title, message, onConfirm });
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Banned' : 'Active' } : u));
    showToast('User preferences updated.');
  };

  const deleteSub = (userId) => {
    const newSubs = [...submissions];
    const index = newSubs.findLastIndex(s => s.userId === userId);
    if (index !== -1) {
      newSubs.splice(index, 1);
      setSubmissions(newSubs);
      showToast('Record deleted from logs.');
    } else {
      showToast('No recent records found.');
    }
  };

  const resetScores = () => {
    setUsers(users.map(u => ({ ...u, score: 0 })));
    showToast('All progress reset for new cycle.');
  };

  const sectionTitles = {
    dashboard: 'General Overview',
    'word-management': 'Publishing Studio',
    submissions: 'Activity Streams',
    users: 'Audience Control',
    scores: 'Performance Analytics'
  };

  return (
    <div className="app-container">
      <Sidebar
        currentSection={currentSection}
        setSection={setSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="main-content">
        <Header
          title={sectionTitles[currentSection]}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="content-area">
          <AnimatePresence mode="wait">
            <motion.div key={currentSection}>
              {currentSection === 'dashboard' && <Dashboard users={users} submissions={submissions} setSection={setSection} />}
              {currentSection === 'word-management' && <WordManagement showToast={showToast} />}
              {currentSection === 'submissions' && <Submissions submissions={submissions} />}
              {currentSection === 'users' && <UserManagement users={users} toggleStatus={toggleUserStatus} deleteSub={deleteSub} showConfirm={showConfirm} />}
              {currentSection === 'scores' && <ScoreMonitoring users={users} resetScores={resetScores} showConfirm={showConfirm} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ ...modal, show: false })}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="toast toast-success">
              <CheckCircle size={18} color="var(--success)" />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
