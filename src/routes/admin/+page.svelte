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

<svelte:head><title>Admin — PromptVault</title></svelte:head>

<!-- Toast -->
{#if toast}
	<div class="fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all {toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}">
		{toast.msg}
	</div>
{/if}

<div class="min-h-screen bg-[#0f1117]">
	<!-- Header -->
	<header class="border-b border-[#2a2e3b] bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-40">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="w-9 h-9 rounded-lg bg-[#6366f1] flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<h1 class="text-xl font-bold tracking-tight text-[#e5e7eb]">Admin Panel</h1>
			</div>
			<a href="/" class="text-sm text-[#9ca3af] hover:text-[#e5e7eb] transition-colors">← Back to Vault</a>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Search -->
		<div class="mb-6">
			<div class="relative max-w-md">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input bind:value={search} placeholder="Search prompts..." class="w-full bg-[#161922] border border-[#2a2e3b] rounded-lg pl-10 pr-4 py-2 text-sm text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1]" />
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20">
				<div class="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
			</div>
		{:else}
			<div class="overflow-x-auto rounded-xl border border-[#2a2e3b]">
				<table class="w-full text-left text-sm">
					<thead class="bg-[#161922] text-[#9ca3af] uppercase text-xs tracking-wider">
						<tr>
							<th class="px-4 py-3">Image</th>
							<th class="px-4 py-3">Title</th>
							<th class="px-4 py-3">Type</th>
							<th class="px-4 py-3">Tags</th>
							<th class="px-4 py-3 text-right">Likes</th>
							<th class="px-4 py-3 text-right">Views</th>
							<th class="px-4 py-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#2a2e3b]">
						{#each filteredPrompts as prompt (prompt.id)}
							<tr class="bg-[#0f1117] hover:bg-[#161922] transition-colors">
								<td class="px-4 py-3">
									{#if prompt.imageUrl}
										<img src={prompt.imageUrl} alt="" class="w-12 h-12 rounded object-cover bg-[#1e212d]" />
									{:else}
										<div class="w-12 h-12 rounded bg-[#1e212d] flex items-center justify-center text-[#4b5563]">—</div>
									{/if}
								</td>
								<td class="px-4 py-3 text-[#e5e7eb] font-medium max-w-xs truncate">{prompt.title}</td>
								<td class="px-4 py-3">
									<span class="px-2 py-0.5 rounded-full text-xs bg-[#1e212d] text-[#9ca3af] capitalize">{prompt.type}</span>
								</td>
								<td class="px-4 py-3">
									<div class="flex flex-wrap gap-1">
										{#each prompt.tags.slice(0, 3) as tag}
											<span class="px-2 py-0.5 rounded text-xs bg-[#6366f1]/10 text-[#6366f1]">{tag}</span>
										{/each}
										{#if prompt.tags.length > 3}
											<span class="text-xs text-[#6b7280]">+{prompt.tags.length - 3}</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-3 text-right font-condensed text-[#e5e7eb]">{prompt.likes}</td>
								<td class="px-4 py-3 text-right font-condensed text-[#e5e7eb]">{prompt.views}</td>
								<td class="px-4 py-3 text-right">
									<div class="flex items-center justify-end gap-2">
										<button onclick={() => editing = { ...prompt }} class="p-1.5 rounded hover:bg-[#6366f1]/20 text-[#9ca3af] hover:text-[#6366f1] transition-colors" aria-label="Edit">
											<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
										</button>
										<button onclick={() => showDeleteConfirm = prompt.id} class="p-1.5 rounded hover:bg-red-500/20 text-[#9ca3af] hover:text-red-400 transition-colors" aria-label="Delete">
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
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" onclick={() => (editing = null)} onkeydown={(e) => e.key === 'Escape' && (editing = null)} tabindex="-1">
		<div class="bg-[#161922] border border-[#2a2e3b] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6" onclick={(e) => e.stopPropagation()} role="document">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold text-[#e5e7eb]">Edit Prompt</h2>
				<button onclick={() => (editing = null)} class="text-[#6b7280] hover:text-[#e5e7eb]">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<div class="flex flex-col gap-4">
				<!-- Image preview -->
				{#if editing.imageUrl}
					<div class="relative rounded-lg overflow-hidden bg-[#1e212d] border border-[#2a2e3b]">
						<img src={editing.imageUrl} alt="" class="w-full h-48 object-cover" />
						<button onclick={() => editing && (editing.imageUrl = '')} class="absolute top-2 right-2 p-1.5 rounded bg-black/60 text-white hover:bg-black/80" aria-label="Remove image">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
						</button>
					</div>
				{/if}

				<div>
					<label class="block text-xs text-[#6b7280] uppercase tracking-wider mb-1">Image URL or Upload</label>
					<div class="flex gap-2">
						<input bind:value={editing.imageUrl} placeholder="https://..." class="flex-1 bg-[#1e212d] border border-[#2a2e3b] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1]" />
						<label class="px-3 py-2 bg-[#1e212d] border border-[#2a2e3b] rounded-lg text-sm text-[#9ca3af] hover:text-[#e5e7eb] hover:border-[#6366f1] cursor-pointer transition-colors">
							Upload
							<input type="file" accept="image/*" class="hidden" onchange={updateImageFile} />
						</label>
					</div>
				</div>

				<div>
					<label class="block text-xs text-[#6b7280] uppercase tracking-wider mb-1">Title</label>
					<input bind:value={editing.title} class="w-full bg-[#1e212d] border border-[#2a2e3b] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#6366f1]" />
				</div>

				<div>
					<label class="block text-xs text-[#6b7280] uppercase tracking-wider mb-1">Type</label>
					<select bind:value={editing.type} class="w-full bg-[#1e212d] border border-[#2a2e3b] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#6366f1]">
						<option value="image">Image</option>
						<option value="markdown">Markdown</option>
						<option value="text">Text</option>
						<option value="code">Code</option>
					</select>
				</div>

				<div>
					<label class="block text-xs text-[#6b7280] uppercase tracking-wider mb-1">Prompt / Content</label>
					<textarea bind:value={editing.prompt} class="w-full bg-[#1e212d] border border-[#2a2e3b] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] h-32 focus:outline-none focus:border-[#6366f1]"></textarea>
				</div>

				<div>
					<label class="block text-xs text-[#6b7280] uppercase tracking-wider mb-1">Tags (comma separated)</label>
					<input value={editing.tags.join(', ')} oninput={(e) => editing && (editing.tags = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean))} class="w-full bg-[#1e212d] border border-[#2a2e3b] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#6366f1]" />
				</div>

				<div>
					<label class="block text-xs text-[#6b7280] uppercase tracking-wider mb-1">Notes</label>
					<input bind:value={editing.notes} class="w-full bg-[#1e212d] border border-[#2a2e3b] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#6366f1]" />
				</div>

				<div class="flex gap-2 pt-2">
					<button onclick={() => (editing = null)} class="flex-1 px-4 py-2 rounded-lg bg-[#1e212d] text-[#e5e7eb] hover:bg-[#2a2e3b] transition-colors">Cancel</button>
					<button onclick={saveEdit} class="flex-1 px-4 py-2 rounded-lg bg-[#6366f1] text-white font-bold hover:bg-[#4f46e5] transition-colors">Save Changes</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirm -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" onclick={() => (showDeleteConfirm = null)} tabindex="-1">
		<div class="bg-[#161922] border border-[#2a2e3b] w-full max-w-sm p-6 rounded-2xl shadow-xl text-center" onclick={(e) => e.stopPropagation()} role="document">
			<div class="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			</div>
			<h3 class="text-lg font-bold text-[#e5e7eb] mb-2">Delete Prompt?</h3>
			<p class="text-sm text-[#9ca3af] mb-6">This action cannot be undone.</p>
			<div class="flex gap-2">
				<button onclick={() => (showDeleteConfirm = null)} class="flex-1 px-4 py-2 rounded-lg bg-[#1e212d] text-[#e5e7eb] hover:bg-[#2a2e3b] transition-colors">Cancel</button>
				<button onclick={() => showDeleteConfirm && deletePrompt(showDeleteConfirm)} class="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">Delete</button>
			</div>
		</div>
	</div>
{/if}
