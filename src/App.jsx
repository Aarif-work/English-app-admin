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
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

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

const staggerContainer = {
  hidden: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, x: -15 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const AnimatedCounter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
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
            <span>One Word Wonder</span>
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
          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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

  // Mock words for today
  const challenges = [
    {
      word: "Ambition",
      difficulty: "Easy",
      phonetic: "/amˈbiSH(ə)n/",
      tamil: "இலட்சியம்",
      meaning: "A strong desire to do or to achieve something, typically requiring determination and hard work.",
      example: "Her ambition was to become a successful architect."
    },
    {
      word: "Resilience",
      difficulty: "Hard",
      phonetic: "/rəˈzilyəns/",
      tamil: "மீண்டெழும் திறன்",
      meaning: "The capacity to withstand or to recover quickly from difficulties.",
      example: "She showed great resilience in the face of adversity."
    }
  ];

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const diff = nextMidnight - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div {...pageTransition} className="dashboard-v2">
      <div className="dashboard-header-bar">
        <div className="card-title-group">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Overview Dashboard</h2>
          <p style={{ margin: 0 }}>System performance and top user rankings</p>
        </div>
        <div className="main-header-reset">
          <Clock size={16} /> <span>Reset: {timeLeft}</span>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-column">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card stats-master-card"
          >
            <div className="card-header">
              <div className="card-title-group">
                <h2>Performance Metrics</h2>
                <p>Key indicators</p>
              </div>
            </div>
            <motion.div
              className="stats-vertical-list"
              variants={staggerContainer}
              initial="hidden"
              animate="animate"
            >
              <motion.div className="stats-v-item" variants={staggerItem} onClick={() => setSection('users')}>
                <div className="stat-icon-mini users"><Users size={18} /></div>
                <div className="stat-v-info">
                  <span className="stat-v-label">Total Users</span>
                  <span className="stat-v-value"><AnimatedCounter value={users.length} /></span>
                </div>
              </motion.div>
              <motion.div className="stats-v-item" variants={staggerItem} onClick={() => setSection('submissions')}>
                <div className="stat-icon-mini submissions"><Send size={18} /></div>
                <div className="stat-v-info">
                  <span className="stat-v-label">Sentences Today</span>
                  <span className="stat-v-value"><AnimatedCounter value={submissionsToday.length} /></span>
                </div>
              </motion.div>
              <motion.div className="stats-v-item" variants={staggerItem} onClick={() => setSection('scores')}>
                <div className="stat-icon-mini info"><Award size={18} /></div>
                <div className="stat-v-info">
                  <span className="stat-v-label">Avg Weekly Score</span>
                  <span className="stat-v-value"><AnimatedCounter value={avgScore} /></span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Top 3 Scores */}
          <div className="card activity-card">
            <div className="card-header">
              <div className="card-title-group">
                <h2>Top Performers</h2>
                <p>Users with the highest scores</p>
              </div>
              <button className="btn btn-icon btn-outline btn-sm" onClick={() => setSection('users')} title="All Rankings">
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="top-users-list" style={{ marginTop: '1rem' }}>
              {users.slice()
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((u, index) => (
                  <div key={index} className="top-user-item" onClick={() => setSection('users')}>
                    <div className="rank-and-user" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div className={`user-rank-box rank-${index + 1}`}>#{index + 1}</div>
                      <div className="top-user-info">
                        <div className="user-avatar" style={{ margin: 0 }}>{u.name.charAt(0)}</div>
                        <div className="user-details-mini" style={{ marginLeft: '0.75rem' }}>
                          <div className="user-name" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>{u.score} pts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="dashboard-right-column">
          <div className="card word-card-master">
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <div className="card-title-group">
                <h2>Today's Words</h2>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span className="badge badge-positive">Active Now</span>
                <button className="btn btn-icon btn-outline btn-sm" onClick={() => setSection('word-management')} title="View History">
                  <CalendarDays size={14} />
                </button>
              </div>
            </div>

            <div className="dual-word-container">
              {challenges.map((challenge, idx) => (
                <div key={idx} className={`word-display-card mini ${challenge.difficulty.toLowerCase()}`}>
                  <div className="challenge-mode-label">{challenge.difficulty} Mode</div>

                  <div className="word-header-row">
                    <div>
                      <h3 className="word-title">{challenge.word}</h3>
                      <span className="word-phonetic">{challenge.phonetic}</span>
                    </div>
                    <div className="word-tamil-container">
                      <span className="word-tamil">{challenge.tamil}</span>
                    </div>
                  </div>

                  <div className="word-details-column">
                    <div className="word-info-box">
                      <p>
                        <strong className="info-label meaning">Meaning</strong>
                        {challenge.meaning}
                      </p>
                    </div>
                    <div className="word-info-box">
                      <p className="example-text">
                        <strong className="info-label example">Example</strong>
                        "{challenge.example}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setSection('word-management')}>
                <CalendarDays size={16} /> History
              </button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setSection('word-management')}>
                <Plus size={16} /> New Word
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div >
  );
};



const WordManagement = ({ showToast }) => {
  const [view, setView] = useState('calendar'); // 'calendar' or 'detail'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock database for words per date
  const [wordDatabase, setWordDatabase] = useState({
    '2026-02-18': {
      easy: { word: 'Happy', meaning: 'Feeling or showing pleasure', tamil: 'மகிழ்ச்சி' },
      hard: { word: 'Resilience', meaning: 'The capacity to recover quickly', tamil: 'மீண்டெழும் திறன்' }
    },
    '2026-02-19': {
      easy: { word: 'Ambition', meaning: 'Strong desire to achieve', tamil: 'லட்சியம்' },
      hard: { word: 'Equanimity', meaning: 'Mental calmness', tamil: 'மன அமைதி' }
    }
  });

  const [editFormData, setEditFormData] = useState({
    easy: { word: '', meaning: '', tamil: '' },
    hard: { word: '', meaning: '', tamil: '' }
  });

  // Calendar Logic
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const renderCalendar = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasWords = wordDatabase[dateStr];
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div
          key={d}
          className={`calendar-day ${selectedDate === dateStr ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasWords ? 'has-data' : ''}`}
          onClick={() => {
            setSelectedDate(dateStr);
            handleOpenDay(dateStr);
          }}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const handleOpenDay = (dateStr) => {
    const existing = wordDatabase[dateStr] || {
      easy: { word: '', meaning: '', tamil: '' },
      hard: { word: '', meaning: '', tamil: '' }
    };
    setEditFormData(existing);
    setView('detail');
  };

  const saveDailyWords = () => {
    setWordDatabase({
      ...wordDatabase,
      [selectedDate]: editFormData
    });
    showToast(`Pack updated for ${selectedDate}`);
    setView('calendar');
  };

  if (view === 'detail') {
    return (
      <motion.div {...pageTransition}>
        <div className="card">
          <div className="card-header">
            <div className="detail-view-header">
              <button className="back-btn" onClick={() => setView('calendar')}>
                <ArrowLeft size={18} /> Back
              </button>
              <div className="card-title-group">
                <h2 style={{ fontSize: '1.25rem' }}>{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={saveDailyWords}>Save All Changes</button>
          </div>

          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="mode-edit-section">
              <h3 style={{ color: 'var(--success)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%' }} /> Easy Mode
              </h3>
              <div className="form-group">
                <label>English Word</label>
                <input type="text" value={editFormData.easy.word} onChange={(e) => setEditFormData({ ...editFormData, easy: { ...editFormData.easy, word: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Meaning</label>
                <textarea rows="3" value={editFormData.easy.meaning} onChange={(e) => setEditFormData({ ...editFormData, easy: { ...editFormData.easy, meaning: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Tamil Translation</label>
                <input type="text" value={editFormData.easy.tamil} onChange={(e) => setEditFormData({ ...editFormData, easy: { ...editFormData.easy, tamil: e.target.value } })} />
              </div>
            </div>

            <div className="mode-edit-section">
              <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%' }} /> Hard Mode
              </h3>
              <div className="form-group">
                <label>English Word</label>
                <input type="text" value={editFormData.hard.word} onChange={(e) => setEditFormData({ ...editFormData, hard: { ...editFormData.hard, word: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Meaning</label>
                <textarea rows="3" value={editFormData.hard.meaning} onChange={(e) => setEditFormData({ ...editFormData, hard: { ...editFormData.hard, meaning: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Tamil Translation</label>
                <input type="text" value={editFormData.hard.tamil} onChange={(e) => setEditFormData({ ...editFormData, hard: { ...editFormData.hard, tamil: e.target.value } })} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageTransition} className="studio-layout">
      <div className="calendar-container">
        <div className="calendar-header">
          <h2>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="calendar-nav">
            <button className="nav-btn" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
            <button className="nav-btn" onClick={handleNextMonth}><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="weekday-label">{day}</div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Day-wise Word Summary</h2>
            <p>Overview of scheduled and published words</p>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Target Date</th>
                <th>Easy Word</th>
                <th>Hard Word</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(wordDatabase).sort((a, b) => b.localeCompare(a)).map(date => (
                <tr key={date}>
                  <td><strong>{date}</strong></td>
                  <td>{wordDatabase[date].easy.word || '-'}</td>
                  <td>{wordDatabase[date].hard.word || '-'}</td>
                  <td>
                    <span className={`badge ${date >= new Date().toISOString().split('T')[0] ? 'badge-positive' : ''}`}>
                      {date === new Date().toISOString().split('T')[0] ? 'Active' : (date > new Date().toISOString().split('T')[0] ? 'Scheduled' : 'Passed')}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenDay(date)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
      <div className="search-header">
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
      <div className="search-header">
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

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-active');
    } else {
      document.body.classList.remove('sidebar-active');
    }
  }, [sidebarOpen]);

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
