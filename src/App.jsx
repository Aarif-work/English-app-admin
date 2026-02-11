import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  Users,
  Tally5,
  Languages,
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
  Clock,
  Download,
  BookOpen,
  Activity,
  User,
  Lock
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
  { id: 101, userId: 1, userName: 'Anish Kumar', sentence: 'Resilience is key to success.', time: '10:30 AM', date: new Date().toISOString().split('T')[0] },
  { id: 102, userId: 4, userName: 'Sowmya G', sentence: 'She showed remarkable resilience.', time: '11:15 AM', date: new Date().toISOString().split('T')[0] },
  { id: 103, userId: 2, userName: 'Priya Dharshini', sentence: 'Building resilience takes time.', time: '01:45 PM', date: new Date().toISOString().split('T')[0] },
  { id: 104, userId: 5, userName: 'Karthik S', sentence: 'Resilience helps in tough times.', time: 'Yesterday', date: '2023-10-26' }
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
    { id: 'word-management', label: 'Publishing Studio', icon: BookOpen },
    { id: 'submissions', label: 'Activity Streams', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'scores', label: 'Score Monitoring', icon: TrendingUp }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span style={{ fontSize: '1.5rem' }}>One Word Wonder</span>
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

      </div>
    </header>
  );
};

const Dashboard = ({ users, submissions, setSection }) => {
  const today = new Date().toISOString().split('T')[0];
  const submissionsToday = submissions.filter(s => s.date === today);
  const totalScore = users.reduce((acc, u) => acc + u.score, 0);
  const avgScore = users.length ? Math.round(totalScore / users.length) : 0;

  // Mock word for today - effectively assuming one is posted for this demo
  const todaysWord = "Resilience";

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
          <div className="card-header">
            <div className="card-title-group">
              <h2>Recent Submissions</h2>
              <p>Updates from the last 24 hours</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setSection('submissions')}>View All</button>
          </div>
          <div className="status-list">
            {submissions.slice(0, 3).map(sub => (
              <div key={sub.id} className="status-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '14px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>{sub.userName.charAt(0)}</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{sub.userName}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{sub.sentence}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                  <Clock size={14} /> {sub.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <div className="card-title-group">
              <h2>Today's Word</h2>
            </div>
            {todaysWord ? <span className="badge badge-positive">Published</span> : <span className="badge badge-negative">Pending</span>}
          </div>

          {todaysWord ? (
            <div className="todays-word-display" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--bg-card), var(--primary-light))', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.05, borderRadius: '50%' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1, marginBottom: '0.25rem' }}>Resilience</h3>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>/rəˈzilyəns/</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#475569', display: 'block' }}>மீண்டெழும் திறன்</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.6)', padding: '0.75rem', borderRadius: '10px', backdropFilter: 'blur(4px)' }}>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#334155', margin: 0 }}>
                      <strong style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginRight: '0.5rem', letterSpacing: '0.5px' }}>Meaning</strong>
                      The capacity to withstand or to recover quickly from difficulties.
                    </p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.6)', padding: '0.75rem', borderRadius: '10px', backdropFilter: 'blur(4px)' }}>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#334155', fontStyle: 'italic', margin: 0 }}>
                      <strong style={{ color: '#10b981', fontSize: '0.75rem', textTransform: 'uppercase', marginRight: '0.5rem', fontStyle: 'normal', letterSpacing: '0.5px' }}>Example</strong>
                      "She showed great resilience in the face of adversity."
                    </p>
                  </div>
                </div>
              </div>

              <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => setSection('word-management')}>
                <Plus size={16} /> Update Word
              </button>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <div className="empty-state-icon"><CalendarDays size={32} /></div>
              <h3>No Word Published</h3>
              <p>Post a new word for your students today.</p>
              <button className="btn btn-primary" onClick={() => setSection('word-management')}>
                <Plus size={18} /> Post Word
              </button>
            </div>
          )}
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

      <form className="admin-form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '0.5rem 0.5rem 0.5rem 1rem', borderRadius: '50px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginRight: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scheduled For</span>
            <div style={{ position: 'relative' }}>
              <CalendarDays size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{
                  padding: '0.5rem 1rem 0.5rem 2.2rem',
                  borderRadius: '30px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h2>Compose Daily Word</h2>
              <p>Define the learning content for English learners today.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
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

            <div className="form-group full-width">
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
          <div className="form-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            <button type="button" className="btn-icon" onClick={() => setFormData({
              ...formData,
              englishWord: '', englishMeaning: '', englishExample: '',
              tamilWord: '', tamilMeaning: '', tamilExample: ''
            })} title="Reset Form">
              <RefreshCcw size={20} />
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={18} /> Publish Content
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

const Submissions = ({ submissions, users }) => {
  const [search, setSearch] = useState('');

  const filteredSubs = useMemo(() => {
    return submissions.filter(s =>
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.sentence.toLowerCase().includes(search.toLowerCase())
    );
  }, [submissions, search]);

  const getUserEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Unknown';
  };

  const getPoints = () => {
    // Return a random point value as requested (1, 5, or 10)
    const points = [1, 5, 10];
    return points[Math.floor(Math.random() * points.length)];
  };

  return (
    <motion.div {...pageTransition}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <div className="search-container" style={{ margin: 0, width: '300px' }}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by user or sentence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Submitted Sentence</th>
              <th>Points</th>
              <th style={{ textAlign: 'right' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.length > 0 ? filteredSubs.map((sub) => (
              <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td><strong>{sub.userName}</strong></td>
                <td style={{ color: '#64748b' }}>{getUserEmail(sub.userId)}</td>
                <td>"{sub.sentence}"</td>
                <td><span className="badge badge-positive">{getPoints()} pts</span></td>
                <td style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem' }}>{sub.time}</td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5">
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <div className="search-container" style={{ margin: 0, width: '300px' }}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
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
                    <span style={{ fontWeight: 600 }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{user.email}</td>
                <td><strong>{user.score} pts</strong></td>
                <td>
                  <span className={`badge ${user.status === 'Active' ? 'badge-positive' : 'badge-negative'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-icon"
                      style={{ color: user.status === 'Active' ? 'var(--danger)' : 'var(--success)', borderColor: 'transparent', background: 'transparent', width: 'auto', height: 'auto', padding: '0.5rem' }}
                      title={user.status === 'Active' ? 'Ban User' : 'Unban User'}
                      onClick={() => showConfirm(
                        user.status === 'Active' ? 'Ban User Account' : 'Unban User Account',
                        `This will ${user.status === 'Active' ? 'restrict' : 'restore'} access for ${user.name}. Are you sure?`,
                        () => toggleStatus(user.id)
                      )}
                    >
                      {user.status === 'Active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                      className="btn-icon"
                      style={{ color: 'var(--danger)', borderColor: 'transparent', background: 'transparent', width: 'auto', height: 'auto', padding: '0.5rem' }}
                      title="Delete most recent submission"
                      onClick={() => showConfirm(
                        'Delete Recent Record',
                        `Permanently delete the last sentence submitted by ${user.name}? This cannot be undone.`,
                        () => deleteSub(user.id)
                      )}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5">
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
        <button
          className="btn btn-danger-outline"
          onClick={() => showConfirm('Reset All Weekly Scores', 'This will set the weekly progress to zero for all users. Continue?', resetScores)}
          style={{ padding: '0.75rem 1.25rem', gap: '0.5rem', borderRadius: '50px' }}
        >
          <RefreshCcw size={16} /> Reset Cycle
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
              <div className="status-item" key={u.id} style={{ padding: '1.25rem', background: i === 0 ? 'var(--primary-light)' : 'transparent', borderRadius: '16px', marginBottom: '0.5rem', border: i === 0 ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '32px', height: '32px', background: i === 0 ? 'var(--primary)' : '#cbd5e1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{i + 1}</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{u.name}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{Math.floor(u.score / 10)} submissions</span>
                  </div>
                </div>
                <strong style={{ fontSize: '1.25rem', color: i === 0 ? 'var(--primary)' : 'var(--text-main)' }}>{u.score} pts</strong>
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
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '8px' }}>{val}</div>
                <motion.div
                  className="bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxActivity) * 100}%` }}
                />
                <div className="bar-label" style={{ marginTop: '12px' }}>{days[i]}</div>
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

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate professional auth delay
    setTimeout(() => {
      if (email === 'admin@oneword.com' && password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid credentials. Please use admin@oneword.com / admin123');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-panel-left">
        <div className="hero-gradient-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-brand">
            <div className="brand-icon">
              <BookOpen size={28} />
            </div>
            <span>One Word Wonder</span>
          </div>

          <h1 className="hero-heading">
            Revolutionize <br />
            <span>Daily Learning.</span>
          </h1>
          <p className="hero-description">
            Managing excellence, one word at a time. Your professional suite for overseeing the One Word Wonder ecosystem.
          </p>


        </motion.div>
      </div>

      <div className="login-panel-right">
        <motion.div
          className="login-form-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="form-head">
            <h2>Welcome Back</h2>
            <p>Please enter your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">
            <div className="input-group">
              <label>Administrative Email</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="email"
                  placeholder="admin@oneword.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Secure Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>



            {error && (
              <motion.div
                className="login-error-alert"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <X size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className={`primary-login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loader-dots">
                  <span></span><span></span><span></span>
                </div>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowUpRight size={18} />
                </>
              )}
            </button>
          </form>


        </motion.div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={() => setIsAuthenticated(true)} />
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
      </>
    );
  }

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
              {currentSection === 'submissions' && <Submissions submissions={submissions} users={users} />}
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
