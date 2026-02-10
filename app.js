/**
 * Admin Panel Logic for Word of the Day App
 */

const app = {
    // Initial State
    state: {
        currentSection: 'dashboard',
        todayWord: {
            date: new Date().toISOString().split('T')[0],
            posted: false,
            english: {},
            tamil: {}
        },
        users: [
            { id: 1, name: 'Anish Kumar', email: 'anish@example.com', score: 125, status: 'Active', joinedDate: '2026-01-15' },
            { id: 2, name: 'Priya Dharshini', email: 'priya@example.com', score: 98, status: 'Active', joinedDate: '2026-01-20' },
            { id: 3, name: 'Rahul Raj', email: 'rahul@example.com', score: 45, status: 'Banned', joinedDate: '2026-02-01' },
            { id: 4, name: 'Sowmya G', email: 'sowmya@example.com', score: 210, status: 'Active', joinedDate: '2026-01-10' },
            { id: 5, name: 'Karthik S', email: 'karthik@example.com', score: 75, status: 'Active', joinedDate: '2026-02-05' }
        ],
        submissions: [
            { id: 101, userId: 1, userName: 'Anish Kumar', sentence: 'The ocean is vast and mysterious.', status: 'Pending', date: '2026-02-10' },
            { id: 102, userId: 2, userName: 'Priya Dharshini', sentence: 'She like to play piano every day.', status: 'Pending', date: '2026-02-10' },
            { id: 103, userId: 4, userName: 'Sowmya G', sentence: 'Resilience is key to success in any field.', status: 'Approved', date: '2026-02-09' },
            { id: 104, userId: 5, userName: 'Karthik S', sentence: 'I am reading a book now.', status: 'Corrected', date: '2026-02-09', correction: 'I am reading a book at the moment.', explanation: 'Used more natural phrasing.' }
        ],
        activity: [12, 18, 15, 25, 20, 30, 22] // Mock activity for 7 days
    },

    // Initialization
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderAll();
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
    },

    cacheDOM() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('.content-section');
        this.sectionTitle = document.getElementById('section-title');
        this.currentDateEl = document.getElementById('current-date');

        // Dashboard
        this.statTotalUsers = document.getElementById('stat-total-users');
        this.statSentencesToday = document.getElementById('stat-sentences-today');
        this.statAvgScore = document.getElementById('stat-avg-score');
        this.statWeeklyTotal = document.getElementById('stat-weekly-total');
        this.statusWordPosted = document.getElementById('status-word-posted');

        // Word Management
        this.wordForm = document.getElementById('word-form');
        this.wordDateInput = document.getElementById('word-date');

        // Submissions
        this.submissionsTableBody = document.getElementById('submissions-table-body');

        // Users
        this.usersTableBody = document.getElementById('users-table-body');

        // Scores
        this.scoresTableBody = document.getElementById('scores-table-body');
        this.topPerformersList = document.getElementById('top-performers-list');
        this.activityChart = document.getElementById('daily-activity-chart-placeholder');
        this.resetScoresBtn = document.getElementById('reset-scores-btn');

        // Modal
        this.modalOverlay = document.getElementById('modal-container');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');
        this.modalFooter = document.getElementById('modal-footer');
        this.closeModalBtn = document.getElementById('close-modal');
    },

    bindEvents() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.navigateTo(section);
            });
        });


        // Word Form
        this.wordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleWordSubmit();
        });

        // Modal Close
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.closeModal();
        });

        // Reset Scores
        this.resetScoresBtn.addEventListener('click', () => {
            this.showConfirm('Reset Weekly Scores', 'Are you sure you want to reset all user scores to zero? This action cannot be undone.', () => {
                this.state.users.forEach(u => u.score = 0);
                this.renderScores();
                this.renderDashboard();
                this.renderUsers();
                this.showToast('Scores reset successfully');
            });
        });
    },

    // Navigation Logic
    navigateTo(sectionId) {
        this.state.currentSection = sectionId;

        // Update UI
        this.navItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update title
        const titleMap = {
            'dashboard': 'Dashboard',
            'word-management': 'Word of the Day Management',
            'submissions': 'Submission Review',
            'users': 'User Management',
            'scores': 'Score Monitoring'
        };
        this.sectionTitle.innerText = titleMap[sectionId] || 'Admin Panel';

        this.renderSection(sectionId);
    },

    updateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        this.currentDateEl.innerText = now.toLocaleDateString('en-US', options);
    },

    // Rendering Logic
    renderAll() {
        this.renderDashboard();
        this.renderSubmissions();
        this.renderUsers();
        this.renderScores();

        // Set default date in word form
        this.wordDateInput.value = this.state.todayWord.date;
    },

    renderSection(sectionId) {
        switch (sectionId) {
            case 'dashboard': this.renderDashboard(); break;
            case 'submissions': this.renderSubmissions(); break;
            case 'users': this.renderUsers(); break;
            case 'scores': this.renderScores(); break;
        }
    },

    renderDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const submissionsToday = this.state.submissions.filter(s => s.date === today);
        const totalScore = this.state.users.reduce((acc, u) => acc + u.score, 0);
        const avgScore = this.state.users.length ? Math.round(totalScore / this.state.users.length) : 0;
        const weeklyTotal = this.state.activity.reduce((acc, val) => acc + val, 0);

        this.statTotalUsers.innerText = this.state.users.length;
        this.statSentencesToday.innerText = submissionsToday.length;
        this.statAvgScore.innerText = avgScore;
        this.statWeeklyTotal.innerText = weeklyTotal;

        // Word Posted Status
        if (this.state.todayWord.posted) {
            this.statusWordPosted.innerText = 'Yes';
            this.statusWordPosted.className = 'badge badge-positive';
        } else {
            this.statusWordPosted.innerText = 'No';
            this.statusWordPosted.className = 'badge badge-negative';
        }
    },

    renderSubmissions() {
        const filtered = this.state.submissions;

        this.submissionsTableBody.innerHTML = filtered.map(s => `
            <tr>
                <td><strong>${s.userName}</strong></td>
                <td>"${s.sentence}"</td>
            </tr>
        `).join('') || '<tr><td colspan="2" style="text-align:center">No submissions found.</td></tr>';
    },

    renderUsers() {
        this.usersTableBody.innerHTML = this.state.users.map(u => `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar">${u.name.charAt(0)}</div>
                        <div class="user-details">
                            <span class="user-name">${u.name}</span>
                            <span class="user-email">${u.email}</span>
                        </div>
                    </div>
                </td>
                <td><strong>${u.score} pts</strong></td>
                <td><span class="badge badge-${u.status === 'Active' ? 'positive' : 'negative'}">${u.status}</span></td>
                <td>
                    <div class="table-actions">
                        ${u.status === 'Active' ?
                `<button class="btn btn-sm btn-outline" onclick="app.toggleUserStatus(${u.id}, 'Banned')">Ban</button>` :
                `<button class="btn btn-sm btn-primary" onclick="app.toggleUserStatus(${u.id}, 'Active')">Unban</button>`
            }
                        <button class="btn btn-sm btn-danger" onclick="app.deleteRecentSubmission(${u.id})">Del Submission</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderScores() {
        const sorted = [...this.state.users].sort((a, b) => b.score - a.score);

        // Render Table
        this.scoresTableBody.innerHTML = sorted.map((u, i) => `
            <tr>
                <td><strong>#${i + 1}</strong></td>
                <td>${u.name}</td>
                <td>${Math.floor(u.score / 10)}</td> <!-- Mock sub count -->
                <td class="text-primary"><strong>${u.score} pts</strong></td>
            </tr>
        `).join('');

        // Render Top Performers
        this.topPerformersList.innerHTML = sorted.slice(0, 3).map((u, i) => `
            <div class="status-item">
                <span>${i + 1}. ${u.name}</span>
                <strong>${u.score} pts</strong>
            </div>
        `).join('');

        // Render Activity Chart
        const max = Math.max(...this.state.activity);
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        this.activityChart.innerHTML = this.state.activity.map((val, i) => `
            <div class="bar" style="height: ${(val / max) * 100}%" data-label="${days[i]}"></div>
        `).join('');
    },

    renderPageEditor(pageKey) {
        // Function intentionally removed
    },

    // Action Handlers
    handleWordSubmit() {
        const dateValue = document.getElementById('word-date').value;

        // Prevent multiple words per day check (mock)
        if (dateValue === this.state.todayWord.date && this.state.todayWord.posted) {
            alert('A word has already been posted for today. You can edit it if needed.');
            return;
        }

        this.state.todayWord = {
            date: dateValue,
            posted: true,
            english: {
                word: document.getElementById('english-word').value,
                meaning: document.getElementById('english-meaning').value,
                example: document.getElementById('english-example').value,
            },
            tamil: {
                word: document.getElementById('tamil-word').value,
                meaning: document.getElementById('tamil-meaning').value,
                example: document.getElementById('tamil-example').value,
            }
        };

        this.showToast('Daily word posted successfully!');
        this.renderDashboard();
    },

    submitCorrection(id) {
        // Function intentionally removed - auto-correction handled by app
    },

    toggleUserStatus(userId, newStatus) {
        const title = newStatus === 'Banned' ? 'Ban User' : 'Unban User';
        const msg = `Are you sure you want to ${newStatus.toLowerCase()} this user?`;

        this.showConfirm(title, msg, () => {
            const user = this.state.users.find(u => u.id === userId);
            if (user) {
                user.status = newStatus;
                this.renderUsers();
                this.showToast(`User ${newStatus.toLowerCase()} successfully.`);
            }
        });
    },

    deleteRecentSubmission(userId) {
        this.showConfirm('Delete Submission', 'Delete the most recent submission from this user?', () => {
            const index = this.state.submissions.findLastIndex(s => s.userId === userId);
            if (index !== -1) {
                this.state.submissions.splice(index, 1);
                this.renderSubmissions();
                this.showToast('User submission deleted.');
            } else {
                this.showToast('No submissions found for this user.');
            }
        });
    },

    handleSavePage() {
        // Function intentionally removed
    },

    // Modal Utility
    openModal() {
        this.modalOverlay.classList.add('active');
    },

    closeModal() {
        this.modalOverlay.classList.remove('active');
    },

    showConfirm(title, message, onConfirm) {
        this.modalTitle.innerText = title;
        this.modalBody.innerHTML = `<p>${message}</p>`;
        this.modalFooter.innerHTML = `
            <button class="btn btn-outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn-danger" id="confirm-btn">Confirm</button>
        `;
        this.openModal();
        document.getElementById('confirm-btn').onclick = () => {
            onConfirm();
            this.closeModal();
        };
    },

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #1e293b;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
        `;
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Global styles for toast animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .text-primary { color: var(--primary); }
    .text-muted { color: var(--text-muted); }
`;
document.head.appendChild(style);

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
