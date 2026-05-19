const API = {
  sessionId: localStorage.getItem('pv_session') || '',
  async request(url, options = {}) {
    const headers = options.headers || {};
    headers['X-Session-Id'] = this.sessionId;
    const res = await fetch(url, { ...options, headers });
    const newSession = res.headers.get('X-Session-Id');
    if (newSession && newSession !== this.sessionId) {
      this.sessionId = newSession;
      localStorage.setItem('pv_session', newSession);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data;
  },
  async getPrompts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/prompts?${params}`);
  },
  async getTags() {
    return this.request('/api/tags');
  },
  async create(formData) {
    return this.request('/api/prompts', { method: 'POST', body: formData });
  },
  async update(id, formData) {
    return this.request(`/api/prompts/${id}`, { method: 'PUT', body: formData });
  },
  async delete(id) {
    return this.request(`/api/prompts/${id}`, { method: 'DELETE' });
  },
  async like(id) {
    return this.request(`/api/prompts/${id}/like`, { method: 'POST' });
  },
  async view(id) {
    return this.request(`/api/prompts/${id}/view`, { method: 'POST' });
  },
  async import(items) {
    return this.request('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
  }
};

const icons = {
  copy: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>`,
  edit: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`,
  trash: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`,
  eye: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
  download: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>`,
  image: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>`,
  md: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`,
  heart: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`,
  heartFilled: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`,
  share: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.287 1.093m0-1.093c-.18-.324-.287-.696-.287-1.093m0 1.093l9.823-5.164m-9.823 5.164l9.823 5.164m-9.823-5.164a2.253 2.253 0 01-.287-1.093m.287 1.093l9.823-5.164m0 0a2.25 2.25 0 113.935 2.186 2.25 2.25 0 01-3.935-2.186zm0 0V5.417m0 4.186l9.823 5.164m0 0a2.25 2.25 0 113.935 2.186 2.25 2.25 0 01-3.935-2.186z" /></svg>`,
  view: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
  sticky: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" /></svg>`
};

function mdToHtml(text) {
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Process line by line for better spacing control
  const lines = html.split('\n');
  const result = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Headings
    if (trimmed.match(/^#{1,6}\s/)) {
      const level = trimmed.match(/^(#{1,6})\s/)[1].length;
      const content = trimmed.replace(/^#{1,6}\s*/, '');
      result.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      result.push('<hr>');
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      result.push(`<blockquote>${trimmed.replace(/^>\s?/, '')}</blockquote>`);
      continue;
    }

    // List items
    if (trimmed.match(/^[-*+]\s/) || trimmed.match(/^\d+\.\s/)) {
      if (!inList) {
        inList = true;
        result.push('<ul>');
      }
      const content = trimmed.replace(/^([-*+]|\d+\.)\s*/, '');
      result.push(`<li>${content}</li>`);
      continue;
    }

    if (inList && !trimmed.match(/^[-*+]\s/) && !trimmed.match(/^\d+\.\s/)) {
      inList = false;
      result.push('</ul>');
    }

    // Empty line - add spacing
    if (trimmed === '') {
      result.push('<br>');
      continue;
    }

    // Regular paragraph with inline formatting
    let formatted = trimmed
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    result.push(`<p>${formatted}</p>`);
  }

  if (inList) result.push('</ul>');

  return result.join('\n');
}

class PromptVault {
  constructor() {
    this.items = [];
    this.tags = [];
    this.filter = { type: 'all', tag: 'all', search: '' };
    this.sort = 'newest';
    this.currentFile = null;
    this.currentViewId = null;
    this.selectedTags = new Set();
    this.shareItemId = null;
    this.viewedItems = new Set();
    this.init();
  }

  async init() {
    await this.loadData();
    this.render();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeViewModal();
        this.closeConfirmModal();
        this.closeShareModal();
        this.closeAdminPanel();
      }
    });
  }

  async loadData() {
    try {
      this.items = await API.getPrompts();
      this.tags = await API.getTags();
    } catch (e) {
      this.showToast('Failed to load data: ' + e.message, 'error');
    }
  }

  getFilteredItems() {
    let result = [...this.items];
    if (this.filter.type !== 'all') {
      result = result.filter(i => i.type === this.filter.type);
    }
    if (this.filter.tag !== 'all') {
      result = result.filter(i => i.tags.includes(this.filter.tag));
    }
    if (this.filter.search) {
      const q = this.filter.search.toLowerCase();
      result = result.filter(i =>
        (i.prompt && i.prompt.toLowerCase().includes(q)) ||
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.content && i.content.toLowerCase().includes(q)) ||
        (i.notes && i.notes.toLowerCase().includes(q)) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      if (this.sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (this.sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (this.sort === 'alpha') return (a.title || a.prompt || '').localeCompare(b.title || b.prompt || '');
      return 0;
    });
    return result;
  }

  render() {
    const items = this.getFilteredItems();
    const imageItems = items.filter(i => i.type === 'image');
    const mdItems = items.filter(i => i.type === 'markdown');

    // Update result count
    const total = items.length;
    document.getElementById('resultCount').textContent = `ABOUT ${total} RESULT${total !== 1 ? 'S' : ''}`;

    // Render image masonry
    const imageGrid = document.getElementById('imageGrid');
    const mdGrid = document.getElementById('mdGrid');
    const mdHeader = document.getElementById('mdSectionHeader');
    const empty = document.getElementById('emptyState');

    if (items.length === 0) {
      imageGrid.innerHTML = '';
      mdGrid.innerHTML = '';
      mdHeader.classList.add('hidden');
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    if (imageItems.length > 0) {
      imageGrid.innerHTML = imageItems.map((item, idx) => this.renderMasonryItem(item, idx)).join('');
    } else {
      imageGrid.innerHTML = '';
    }

    if (mdItems.length > 0) {
      mdHeader.classList.remove('hidden');
      document.getElementById('mdSectionCount').textContent = `${mdItems.length} prompt${mdItems.length !== 1 ? 's' : ''}`;
      mdGrid.innerHTML = mdItems.map((item, idx) => this.renderMdCard(item, idx)).join('');
    } else {
      mdHeader.classList.add('hidden');
      mdGrid.innerHTML = '';
    }
  }

  renderMasonryItem(item, idx) {
    const promptText = item.prompt || '';
    const displayPrompt = promptText.length > 140 ? promptText.substring(0, 140) + '...' : promptText;

    return `
      <div class="masonry-item" style="animation-delay:${idx * 40}ms" onmouseenter="app.trackView('${item._id}')">
        <img src="${item.imageUrl}" alt="${this.escapeHtml(item.title || '')}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x450?text=No+Image'">
        <div class="masonry-overlay">
          <div class="overlay-views">
            ${icons.view}
            ${item.views || 0}
          </div>
          <div class="overlay-top">
            ${icons.heart}
            ${item.likes || 0}
          </div>
          <div class="overlay-prompt">${this.escapeHtml(displayPrompt)}</div>
          <div class="overlay-actions">
            <button class="overlay-btn overlay-btn-primary" onclick="event.stopPropagation(); app.likePrompt('${item._id}')">
              ${icons.heart}
              Like
            </button>
            <button class="overlay-btn" onclick="event.stopPropagation(); app.copyPrompt('${item._id}')">
              ${icons.copy}
              Copy
            </button>
            <button class="overlay-btn" onclick="event.stopPropagation(); app.openShareModal('${item._id}')">
              ${icons.share}
              Share
            </button>
          </div>
        </div>
      </div>`;
  }

  renderMdCard(item, idx) {
    const tagsHtml = item.tags.map(t => `<span class="md-card-tag">${this.escapeHtml(t)}</span>`).join('');
    return `
      <div class="md-card" style="animation-delay:${idx * 40}ms">
        <div class="md-card-media">
          <img src="${item.imageUrl}" alt="${this.escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x340?text=No+Thumbnail'">
        </div>
        <div class="md-card-body">
          <h3 class="md-card-title">${this.escapeHtml(item.title)}</h3>
          <p class="md-card-desc">${this.escapeHtml(item.description || '')}</p>
          <div class="md-card-tags">${tagsHtml}</div>
          <div class="md-card-actions">
            <button class="md-action-btn" onclick="app.viewMarkdown('${item._id}')">${icons.eye} View</button>
            <button class="md-action-btn" onclick="app.copyMarkdown('${item._id}')">${icons.copy} Copy</button>
            <button class="md-action-btn" onclick="app.openShareModal('${item._id}')">${icons.share} Share</button>
          </div>
          <div class="md-card-footer">
            <span style="font-size:12px;color:var(--text-muted)">${this.formatDate(item.createdAt)}</span>
            <div class="card-ctrls">
              <button class="btn btn-icon btn-ghost" onclick="app.editPrompt('${item._id}')" title="Edit">${icons.edit}</button>
              <button class="btn btn-icon btn-ghost" onclick="app.confirmDelete('${item._id}')" title="Delete">${icons.trash}</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  async trackView(id) {
    if (this.viewedItems.has(id)) return;
    this.viewedItems.add(id);
    try {
      const result = await API.view(id);
      const item = this.items.find(i => i._id === id);
      if (item) item.views = result.views;
      this.render();
    } catch (e) {}
  }

  // Tag Selector
  renderTagSelector() {
    const container = document.getElementById('tagSelectorList');
    if (!container) return;
    const allTags = [...new Set([...this.tags, ...Array.from(this.selectedTags)])].sort();
    container.innerHTML = allTags.map(tag => {
      const isSelected = this.selectedTags.has(tag);
      return `<button type="button" class="tag-selector-chip ${isSelected ? 'selected' : ''}" onclick="app.toggleTag('${tag}')">${this.escapeHtml(tag)}</button>`;
    }).join('');
    document.getElementById('tags').value = Array.from(this.selectedTags).join(',');
  }

  toggleTag(tag) {
    if (this.selectedTags.has(tag)) this.selectedTags.delete(tag);
    else this.selectedTags.add(tag);
    this.renderTagSelector();
  }

  handleCustomTag(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addCustomTag();
    }
  }

  addCustomTag() {
    const input = document.getElementById('customTagInput');
    const value = input.value.trim().toLowerCase();
    if (!value) return;
    const newTags = value.split(/[,\s]+/).filter(t => t.length > 0);
    newTags.forEach(tag => {
      this.selectedTags.add(tag);
      if (!this.tags.includes(tag)) this.tags.push(tag);
    });
    input.value = '';
    this.renderTagSelector();
  }

  openModal(type, editId = null) {
    const modal = document.getElementById('modal');
    const form = document.getElementById('promptForm');
    form.reset();
    this.currentFile = null;
    this.selectedTags.clear();
    document.getElementById('imagePreview').classList.remove('show');
    document.getElementById('editId').value = editId || '';
    document.getElementById('promptType').value = type;

    const isEdit = !!editId;
    const isMd = type === 'markdown';

    document.getElementById('modalTitle').textContent = isEdit ? 'Edit Prompt' : (isMd ? 'Add Markdown Prompt' : 'Add Image Prompt');
    document.getElementById('imageLabel').textContent = isMd ? 'Thumbnail Image' : 'Image';

    document.getElementById('titleField').classList.remove('hidden');
    document.getElementById('descField').classList.toggle('hidden', !isMd);
    document.getElementById('contentField').classList.toggle('hidden', !isMd);
    document.getElementById('promptField').classList.toggle('hidden', isMd);

    document.getElementById('mdTitle').required = true;
    document.getElementById('mdContent').required = isMd;
    document.getElementById('promptText').required = !isMd;

    if (isEdit) {
      const item = this.items.find(i => i._id === editId);
      if (item) {
        document.getElementById('imageUrl').value = item.imageUrl || '';
        document.getElementById('notes').value = item.notes || '';
        item.tags.forEach(t => this.selectedTags.add(t));
        if (item.imageUrl) {
          document.getElementById('previewImg').src = item.imageUrl;
          document.getElementById('imagePreview').classList.add('show');
        }
        if (item.type === 'markdown') {
          document.getElementById('mdTitle').value = item.title || '';
          document.getElementById('mdDesc').value = item.description || '';
          document.getElementById('mdContent').value = item.content || '';
        } else {
          document.getElementById('mdTitle').value = item.title || '';
          document.getElementById('promptText').value = item.prompt || '';
        }
      }
    }

    this.renderTagSelector();
    modal.classList.add('open');
  }

  closeModal() {
    document.getElementById('modal').classList.remove('open');
    this.currentFile = null;
    this.selectedTags.clear();
  }

  async savePrompt(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const type = document.getElementById('promptType').value;
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const tags = Array.from(this.selectedTags);
    const notes = document.getElementById('notes').value.trim();
    const title = document.getElementById('mdTitle').value.trim();

    const payload = { type, imageUrl, tags, notes, title };

    if (type === 'markdown') {
      payload.description = document.getElementById('mdDesc').value.trim();
      payload.content = document.getElementById('mdContent').value;
    } else {
      payload.prompt = document.getElementById('promptText').value.trim();
    }

    const formData = new FormData();
    if (this.currentFile) formData.append('imageFile', this.currentFile);
    formData.append('data', JSON.stringify(payload));

    try {
      if (id) {
        await API.update(id, formData);
        this.showToast('Prompt updated!', 'success');
      } else {
        await API.create(formData);
        this.showToast('Prompt added!', 'success');
      }
      await this.loadData();
      this.render();
      this.closeModal();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Image too large. Max 5MB.', 'error');
      input.value = '';
      return;
    }
    this.currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('imageUrl').value = '';
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('imagePreview').classList.add('show');
    };
    reader.readAsDataURL(file);
  }

  previewImage(url) {
    if (url) {
      document.getElementById('previewImg').src = url;
      document.getElementById('imagePreview').classList.add('show');
    } else {
      document.getElementById('imagePreview').classList.remove('show');
    }
  }

  parseMarkdown(text) {
    const lines = text.split('\n');
    let title = '';
    let description = '';

    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^#+\s+(.+)$/);
      if (match) {
        title = match[1].trim();
        for (let j = i + 1; j < lines.length; j++) {
          const line = lines[j].trim();
          if (line && !line.match(/^#/)) {
            description = line;
            break;
          }
        }
        break;
      }
    }

    if (!title) {
      const first = lines.find(l => l.trim());
      title = first ? first.trim().replace(/^#+\s*/, '').substring(0, 60) : 'Imported Markdown';
    }

    return { title, description, content: text };
  }

  async handleMdImport(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const parsed = this.parseMarkdown(text);

        const payload = {
          type: 'markdown',
          title: parsed.title,
          description: parsed.description,
          content: parsed.content,
          tags: ['md'],
          notes: '',
          imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));

        await API.create(formData);
        await this.loadData();
        this.render();
        this.showToast(`Imported "${parsed.title}"`, 'success');
      } catch (err) {
        this.showToast(err.message, 'error');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  async copyPrompt(id) {
    const item = this.items.find(i => i._id === id);
    if (item && item.prompt) {
      await navigator.clipboard.writeText(item.prompt);
      this.showToast('Prompt copied!', 'success');
    }
  }

  async copyMarkdown(id) {
    const item = this.items.find(i => i._id === id);
    if (item && item.content) {
      await navigator.clipboard.writeText(item.content);
      this.showToast('Markdown copied!', 'success');
    }
  }

  openShareModal(id) {
    this.shareItemId = id;
    document.getElementById('shareModal').classList.add('open');
  }

  closeShareModal() {
    document.getElementById('shareModal').classList.remove('open');
    this.shareItemId = null;
  }

  async shareTo(platform) {
    const item = this.items.find(i => i._id === this.shareItemId);
    if (!item) return;
    const text = item.type === 'image' ? item.prompt : item.content;
    const title = item.title || 'Prompt';
    const url = window.location.href;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title.substring(0, 100))}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    };

    if (platform === 'copy') {
      await navigator.clipboard.writeText(text);
      this.showToast('Prompt copied to clipboard!', 'success');
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    this.closeShareModal();
  }

  async likePrompt(id) {
    try {
      const result = await API.like(id);
      const item = this.items.find(i => i._id === id);
      if (item) item.likes = result.likes;
      this.render();
      this.showToast('Liked!', 'success');
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  downloadMarkdown(id) {
    const item = this.items.find(i => i._id === id);
    if (!item || !item.content) return;
    const blob = new Blob([item.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(item.title || 'prompt').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('Downloading .md...', 'success');
  }

  viewMarkdown(id) {
    const item = this.items.find(i => i._id === id);
    if (!item) return;
    this.currentViewId = id;
    document.getElementById('viewThumb').src = item.imageUrl;
    document.getElementById('viewTitle').textContent = item.title;
    document.getElementById('viewDesc').textContent = item.description || '';
    document.getElementById('viewContent').innerHTML = mdToHtml(item.content);
    document.getElementById('viewTags').innerHTML = item.tags.map(t => `<span class="md-card-tag">${this.escapeHtml(t)}</span>`).join('');
    document.getElementById('viewModal').classList.add('open');
  }

  closeViewModal() {
    document.getElementById('viewModal').classList.remove('open');
    this.currentViewId = null;
  }

  copyFromView() {
    if (this.currentViewId) this.copyMarkdown(this.currentViewId);
  }

  downloadFromView() {
    if (this.currentViewId) this.downloadMarkdown(this.currentViewId);
  }

  confirmDelete(id) {
    this.pendingDeleteId = id;
    const item = this.items.find(i => i._id === id);
    const name = item ? (item.title || item.prompt?.substring(0, 40) || 'this prompt') : 'this prompt';
    document.getElementById('confirmMessage').textContent = `Delete "${this.escapeHtml(name)}"? This cannot be undone.`;
    document.getElementById('confirmModal').classList.add('open');
  }

  closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('open');
    this.pendingDeleteId = null;
  }

  async executeDelete() {
    if (!this.pendingDeleteId) return;
    try {
      await API.delete(this.pendingDeleteId);
      await this.loadData();
      this.render();
      this.showToast('Deleted', 'info');
    } catch (e) {
      this.showToast(e.message, 'error');
    }
    this.closeConfirmModal();
  }

  editPrompt(id) {
    const item = this.items.find(i => i._id === id);
    if (item) this.openModal(item.type, id);
  }

  // Admin Panel
  openAdminPanel() {
    this.renderAdminTable();
    document.getElementById('adminModal').classList.add('open');
  }

  closeAdminPanel() {
    document.getElementById('adminModal').classList.remove('open');
  }

  renderAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = this.items.map(item => {
      const typeClass = item.type === 'image' ? 'admin-type-image' : 'admin-type-md';
      const typeLabel = item.type === 'image' ? 'Image' : '.md';
      return `
        <tr>
          <td><span class="admin-type ${typeClass}">${typeLabel}</span></td>
          <td class="admin-title">${this.escapeHtml(item.title || 'Untitled')}</td>
          <td>${item.tags.map(t => `<span class="md-card-tag">${this.escapeHtml(t)}</span>`).join(' ')}</td>
          <td>${item.likes || 0}</td>
          <td>${item.views || 0}</td>
          <td>${this.formatDate(item.createdAt)}</td>
          <td>
            <div class="admin-actions">
              <button class="btn btn-sm btn-ghost" onclick="app.editPrompt('${item._id}'); app.closeAdminPanel();">${icons.edit}</button>
              <button class="btn btn-sm btn-ghost" onclick="app.confirmDelete('${item._id}'); app.closeAdminPanel();">${icons.trash}</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  handleSearch(value) {
    this.filter.search = value.trim();
    this.render();
  }

  triggerSearch() {
    const val = document.getElementById('searchInput').value;
    this.handleSearch(val);
  }

  setTypeFilter(type) {
    this.filter.type = type;
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter-${type}`).classList.add('active');
    this.render();
  }

  setTagFilter(tag) {
    this.filter.tag = tag;
    this.render();
  }

  setSort(sort) {
    this.sort = sort;
    this.render();
    this.showToast(`Sorted by ${sort}`, 'info');
  }

  async exportData() {
    try {
      const items = await API.getPrompts();
      const data = JSON.stringify(items, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast('Exported!', 'success');
    } catch (e) {
      this.showToast(e.message, 'error');
    }
  }

  async importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        if (!confirm(`Import ${data.length} prompts?`)) return;
        const result = await API.import(data);
        await this.loadData();
        this.render();
        this.showToast(`Imported ${result.imported}!`, 'success');
      } catch (err) {
        this.showToast('Invalid JSON', 'error');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const div = document.createElement('div');
    div.className = `toast toast-${type}`;
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>`;
    }
    div.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(div);
    setTimeout(() => {
      div.style.opacity = '0';
      div.style.transform = 'translateX(100%)';
      div.style.transition = 'all 0.3s';
      setTimeout(() => div.remove(), 300);
    }, 3000);
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(ts) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  }
}

const app = new PromptVault();
