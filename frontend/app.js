/* ============================================================
   Hobby Tracker — app.js
   FastAPI backend: https://gwc-team-13.onrender.com
   ============================================================ */

const API_BASE = 'https://gwc-team-13.onrender.com';

let editingId = null;
let currentFilter = '';

/* ============================================================
   Initialisation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  loadHobbies();

  const completedCheckbox = document.getElementById('inputCompleted');
  completedCheckbox.addEventListener('change', () => {
    const label = document.getElementById('toggleLabelText');
    label.textContent = completedCheckbox.checked ? 'Completed' : 'In Progress';
    label.style.color = completedCheckbox.checked ? '#42B072' : '';
  });
});

/* ============================================================
   API Calls
   ============================================================ */

async function fetchHobbies(hobbyType = '') {
  const url = hobbyType
    ? `${API_BASE}/hobbies?hobby_type=${encodeURIComponent(hobbyType)}`
    : `${API_BASE}/hobbies`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch hobbies (${response.status})`);
  return response.json();
}

async function createHobby(data) {
  const response = await fetch(`${API_BASE}/hobbies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to create entry (${response.status})`);
  }
  return response.json();
}

async function updateHobby(id, data) {
  const response = await fetch(`${API_BASE}/hobbies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to update entry (${response.status})`);
  }
  return response.json();
}

async function deleteHobby(id) {
  const response = await fetch(`${API_BASE}/hobbies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to delete entry (${response.status})`);
  }
  return response.json();
}

/* ============================================================
   Load & Render
   ============================================================ */

async function loadHobbies() {
  try {
    const entries = await fetchHobbies(currentFilter);
    renderCards(entries);
    updateStats(entries);
  } catch (err) {
    showToast('Could not load entries. Is the server running?', 'error');
    renderCards([]);
    updateStats([]);
  }
}

function updateStats(entries) {
  const total = entries.length;
  const completed = entries.filter(e => e.completed).length;
  const minutes = entries.reduce((sum, e) => sum + (Number(e.duration) || 0), 0);

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statCompleted').textContent = completed;
  document.getElementById('statMinutes').textContent = minutes;
}

function renderCards(entries) {
  const grid = document.getElementById('cardsGrid');
  const emptyState = document.getElementById('emptyState');

  grid.innerHTML = '';

  if (!entries || entries.length === 0) {
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  entries.forEach(entry => {
    const card = buildCard(entry);
    grid.appendChild(card);
  });
}

function buildCard(entry) {
  const hobbyType = (entry.hobby_type || '').toLowerCase();
  const hobbyLabel = hobbyTypeLabel(hobbyType);

  const card = document.createElement('article');
  card.className = `card ${hobbyType}`;
  card.dataset.id = entry.id;

  const formattedDate = formatDate(entry.date);
  const duration = entry.duration ? `${entry.duration} min` : '—';
  const isCompleted = Boolean(entry.completed);
  const statusClass = isCompleted ? 'status-done' : 'status-progress';
  const statusText = isCompleted ? '✓ Done' : '○ In Progress';
  const notesHtml = entry.notes
    ? `<p class="card-notes">${escapeHtml(entry.notes)}</p>`
    : '';

  card.innerHTML = `
    <div class="card-strip"></div>
    <div class="card-body">
      <div class="card-top">
        <h3 class="card-title">${escapeHtml(entry.title || 'Untitled')}</h3>
        <span class="card-badge">${hobbyLabel}</span>
      </div>
      <div class="card-meta">
        <span class="card-meta-item">
          <span class="meta-icon">📅</span>
          <span>${formattedDate}</span>
        </span>
        <span class="card-meta-item">
          <span class="meta-icon">⏱️</span>
          <span>${duration}</span>
        </span>
      </div>
      <span class="card-status ${statusClass}">${statusText}</span>
      ${notesHtml}
    </div>
    <div class="card-footer">
      <button class="icon-btn edit-btn" title="Edit entry" onclick="openModal(${JSON.stringify(entry).replace(/"/g, '&quot;')})">✏️</button>
      <button class="icon-btn delete-btn" title="Delete entry" onclick="deleteEntry(${entry.id})">🗑️</button>
    </div>
  `;

  return card;
}

/* ============================================================
   Filter
   ============================================================ */

function setFilter(btn, type) {
  currentFilter = type;

  document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  loadHobbies();
}

/* ============================================================
   Modal
   ============================================================ */

function openModal(entry = null) {
  editingId = null;

  const overlay = document.getElementById('modalOverlay');
  const form = document.getElementById('entryForm');
  const titleEl = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitBtn');

  form.reset();
  document.getElementById('toggleLabelText').textContent = 'In Progress';
  document.getElementById('toggleLabelText').style.color = '';

  if (entry) {
    editingId = entry.id;
    titleEl.textContent = 'Edit Entry';
    submitBtn.textContent = 'Save Changes';

    const hobbyType = (entry.hobby_type || '').toLowerCase();
    const radioToSelect = form.querySelector(`input[name="hobby_type"][value="${hobbyType}"]`);
    if (radioToSelect) radioToSelect.checked = true;

    document.getElementById('inputTitle').value = entry.title || '';
    document.getElementById('inputDate').value = entry.date || '';
    document.getElementById('inputDuration').value = entry.duration || '';

    const completedCheckbox = document.getElementById('inputCompleted');
    completedCheckbox.checked = Boolean(entry.completed);
    const label = document.getElementById('toggleLabelText');
    if (completedCheckbox.checked) {
      label.textContent = 'Completed';
      label.style.color = '#42B072';
    }

    document.getElementById('inputNotes').value = entry.notes || '';
  } else {
    titleEl.textContent = 'New Entry';
    submitBtn.textContent = 'Save Entry';
    document.getElementById('inputDate').value = todayDateString();
  }

  overlay.classList.add('open');
  setTimeout(() => {
    document.getElementById('inputTitle').focus();
  }, 150);
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  editingId = null;
}

function handleOverlayClick(event) {
  if (event.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
}

/* ============================================================
   Form Submit
   ============================================================ */

async function submitForm(event) {
  event.preventDefault();

  const form = document.getElementById('entryForm');
  const submitBtn = document.getElementById('submitBtn');
  const formData = new FormData(form);

  const hobbyType = formData.get('hobby_type');
  const title = formData.get('title');
  const date = formData.get('date');
  const duration = formData.get('duration');
  const completed = document.getElementById('inputCompleted').checked;
  const notes = formData.get('notes');

  if (!hobbyType) {
    showToast('Please select a hobby type.', 'error');
    return;
  }

  const payload = {
    hobby_type: hobbyType,
    title: title.trim(),
    date: date,
    duration: duration ? Number(duration) : null,
    completed: completed,
    notes: notes ? notes.trim() : null,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = editingId ? 'Saving...' : 'Adding...';

  try {
    if (editingId !== null) {
      await updateHobby(editingId, payload);
      showToast('Entry updated successfully!', 'success');
    } else {
      await createHobby(payload);
      showToast('Entry added successfully!', 'success');
    }
    closeModal();
    loadHobbies();
  } catch (err) {
    showToast(err.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = editingId !== null ? 'Save Changes' : 'Save Entry';
  }
}

/* ============================================================
   Delete
   ============================================================ */

async function deleteEntry(id) {
  const confirmed = confirm('Are you sure you want to delete this entry? This action cannot be undone.');
  if (!confirmed) return;

  try {
    await deleteHobby(id);
    showToast('Entry deleted.', 'success');
    loadHobbies();
  } catch (err) {
    showToast(err.message || 'Could not delete entry. Please try again.', 'error');
  }
}

/* ============================================================
   Toast
   ============================================================ */

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : '✕';
  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3500);
}

/* ============================================================
   Utility helpers
   ============================================================ */

function todayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[parseInt(month, 10) - 1] || month;
  return `${monthName} ${parseInt(day, 10)}, ${year}`;
}

function hobbyTypeLabel(type) {
  const labels = {
    baking: '🥐 Baking',
    crochet: '🧶 Crochet',
    pottery: '🏺 Pottery',
  };
  return labels[type] || type;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
