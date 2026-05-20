<script lang="ts">
	import { onMount } from 'svelte';
	import type { Prompt } from '$lib/types';

	let prompts = $state<Prompt[]>([]);
	let loading = $state(true);
	let editing = $state<Prompt | null>(null);
	let showDeleteConfirm = $state<number | null>(null);
	let search = $state('');
	let toast = $state<{ msg: string; type: 'success' | 'error' } | null>(null);

	async function loadPrompts() {
		loading = true;
		const res = await fetch('/api/prompts');
		prompts = await res.json();
		loading = false;
	}

	function showToast(msg: string, type: 'success' | 'error' = 'success') {
		toast = { msg, type };
		setTimeout(() => (toast = null), 3000);
	}

	async function saveEdit() {
		if (!editing) return;
		const formData = new FormData();
		formData.append('data', JSON.stringify({
			title: editing.title,
			prompt: editing.prompt,
			content: editing.content,
			tags: editing.tags,
			notes: editing.notes,
			type: editing.type,
			imageUrl: editing.imageUrl
		}));
		const res = await fetch(`/api/prompts/${editing.id}`, { method: 'PUT', body: formData });
		if (res.ok) {
			showToast('Prompt updated');
			editing = null;
			await loadPrompts();
		} else {
			showToast('Failed to update', 'error');
		}
	}

	async function deletePrompt(id: number) {
		const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
		if (res.ok) {
			showToast('Prompt deleted');
			showDeleteConfirm = null;
			await loadPrompts();
		} else {
			showToast('Failed to delete', 'error');
		}
	}

	function updateImageFile(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file || !editing) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (editing) editing.imageUrl = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	const filteredPrompts = $derived(
		search.trim()
			? prompts.filter(p =>
					p.title.toLowerCase().includes(search.toLowerCase()) ||
					p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
				)
			: prompts
	);

	onMount(loadPrompts);
</script>

<svelte:head><title>Admin — PromptDeck</title></svelte:head>

<!-- Toast -->
{#if toast}
	<div class="admin-toast {toast.type === 'success' ? 'admin-toast--success' : 'admin-toast--error'}">
		{toast.msg}
	</div>
{/if}

<div class="admin-page">
	<!-- Header -->
	<header class="site-header site-header--admin">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="brand-logo">
					<svg xmlns="http://www.w3.org/2000/svg" class="brand-logo__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<h1 class="brand-name">PromptDeck</h1>
			</div>
			<a href="/" class="login-btn login-btn--ghost">
				← Back to Vault
			</a>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Search -->
		<div class="mb-6">
			<div class="admin-search">
				<svg xmlns="http://www.w3.org/2000/svg" class="admin-search__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input bind:value={search} placeholder="Search prompts..." class="admin-search__input" />
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20">
				<div class="spinner"></div>
			</div>
		{:else}
			<div class="admin-table-wrap">
				<table class="admin-table">
					<thead class="admin-table__head">
						<tr>
							<th>Image</th>
							<th>Title</th>
							<th>Type</th>
							<th>Tags</th>
							<th class="text-right">Likes</th>
							<th class="text-right">Views</th>
							<th class="text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="admin-table__body">
						{#each filteredPrompts as prompt (prompt.id)}
							<tr>
								<td>
									{#if prompt.imageUrl}
										<img src={prompt.imageUrl} alt="" class="admin-thumb" />
									{:else}
										<div class="admin-thumb--empty">—</div>
									{/if}
								</td>
								<td class="text-[#e5e7eb] font-medium max-w-xs truncate">{prompt.title}</td>
								<td>
									<span class="admin-type-badge">{prompt.type}</span>
								</td>
								<td>
									<div class="flex flex-wrap gap-1">
										{#each prompt.tags.slice(0, 3) as tag}
											<span class="admin-tag">{tag}</span>
										{/each}
										{#if prompt.tags.length > 3}
											<span class="admin-tag--more">+{prompt.tags.length - 3}</span>
										{/if}
									</div>
								</td>
								<td class="text-right font-condensed text-[#e5e7eb]">{prompt.likes}</td>
								<td class="text-right font-condensed text-[#e5e7eb]">{prompt.views}</td>
								<td class="text-right">
									<div class="flex items-center justify-end gap-2">
										<button onclick={() => editing = { ...prompt }} class="admin-action-btn" aria-label="Edit">
											<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
										</button>
										<button onclick={() => showDeleteConfirm = prompt.id} class="admin-action-btn admin-action-btn--danger" aria-label="Delete">
											<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</main>
</div>

<!-- Edit Modal -->
{#if editing}
	<div class="modal-backdrop" role="dialog" aria-modal="true" onclick={() => (editing = null)} onkeydown={(e) => e.key === 'Escape' && (editing = null)} tabindex="-1">
		<div class="modal-panel" onclick={(e) => e.stopPropagation()} role="document">
			<div class="flex items-center justify-between mb-6">
				<h2 class="modal-title">Edit Prompt</h2>
				<button onclick={() => (editing = null)} class="modal-close">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<div class="flex flex-col gap-4">
				<!-- Image preview -->
				{#if editing.imageUrl}
					<div class="image-preview-wrap">
						<img src={editing.imageUrl} alt="" class="image-preview-wrap__img" />
						<button onclick={() => editing && (editing.imageUrl = '')} class="image-preview-wrap__remove" aria-label="Remove image">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
					</div>
				{/if}

				<div>
					<label class="form-label">Image URL or Upload</label>
					<div class="flex gap-2">
						<input bind:value={editing.imageUrl} placeholder="https://..." class="form-input" />
						<label class="form-file-btn">
							Upload
							<input type="file" accept="image/*" class="hidden" onchange={updateImageFile} />
						</label>
					</div>
				</div>

				<div>
					<label class="form-label">Title</label>
					<input bind:value={editing.title} class="form-input" />
				</div>

				<div>
					<label class="form-label">Type</label>
					<select bind:value={editing.type} class="form-select">
						<option value="image">Image</option>
						<option value="markdown">Markdown</option>
						<option value="text">Text</option>
						<option value="code">Code</option>
					</select>
				</div>

				<div>
					<label class="form-label">Prompt / Content</label>
					<textarea bind:value={editing.prompt} class="form-textarea"></textarea>
				</div>

				<div>
					<label class="form-label">Tags (comma separated)</label>
					<input value={editing.tags.join(', ')} oninput={(e) => editing && (editing.tags = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean))} class="form-input" />
				</div>

				<div>
					<label class="form-label">Notes</label>
					<input bind:value={editing.notes} class="form-input" />
				</div>

				<div class="flex gap-2 pt-2">
					<button onclick={() => (editing = null)} class="btn btn--secondary flex-1">Cancel</button>
					<button onclick={saveEdit} class="btn btn--primary flex-1">Save Changes</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirm -->
{#if showDeleteConfirm}
	<div class="modal-backdrop" role="dialog" aria-modal="true" onclick={() => (showDeleteConfirm = null)} tabindex="-1">
		<div class="modal-panel modal-panel--small" onclick={(e) => e.stopPropagation()} role="document">
			<div class="delete-icon-wrap">
				<svg xmlns="http://www.w3.org/2000/svg" class="delete-icon-wrap__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			</div>
			<h3 class="delete-title">Delete Prompt?</h3>
			<p class="delete-text">This action cannot be undone.</p>
			<div class="flex gap-2">
				<button onclick={() => (showDeleteConfirm = null)} class="btn btn--secondary flex-1">Cancel</button>
				<button onclick={() => showDeleteConfirm && deletePrompt(showDeleteConfirm)} class="btn btn--danger flex-1">Delete</button>
			</div>
		</div>
	</div>
{/if}
