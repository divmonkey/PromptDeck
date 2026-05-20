<script lang="ts">
	import { onMount } from 'svelte';
	import PromptGrid from '$lib/components/PromptGrid.svelte';
	import PromptModal from '$lib/components/PromptModal.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import type { Prompt } from '$lib/types';

	let prompts = $state<Prompt[]>([]);
	let allPrompts = $state<Prompt[]>([]);
	let tags = $state<string[]>([]);
	let search = $state('');
	let selectedType = $state('all');
	let selectedTag = $state('all');
	let showModal = $state(false);
	let loading = $state(true);

	// Toast state
	let toastMessage = $state('');
	let toastShow = $state(false);
	let toastTimer: ReturnType<typeof setTimeout> | null = null;

	function showToast(message: string) {
		toastMessage = message;
		toastShow = true;
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toastShow = false;
		}, 2000);
	}

	// Drag-scroll refs
	let typeRow: HTMLDivElement | null = $state(null);
	let tagRow: HTMLDivElement | null = $state(null);
	let isDragging = false;
	let startX = 0;
	let scrollLeft = 0;
	let activeRow: HTMLDivElement | null = null;

	function startDrag(e: MouseEvent | TouchEvent, row: HTMLDivElement) {
		isDragging = true;
		activeRow = row;
		const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
		startX = pageX - row.offsetLeft;
		scrollLeft = row.scrollLeft;
		row.style.cursor = 'grabbing';
		row.style.userSelect = 'none';
	}

	function endDrag() {
		if (!activeRow) return;
		isDragging = false;
		activeRow.style.cursor = 'grab';
		activeRow.style.userSelect = '';
		activeRow = null;
	}

	function doDrag(e: MouseEvent | TouchEvent) {
		if (!isDragging || !activeRow) return;
		e.preventDefault();
		const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
		const x = pageX - activeRow.offsetLeft;
		const walk = (x - startX) * 1.5;
		activeRow.scrollLeft = scrollLeft - walk;
	}

	async function loadPrompts() {
		loading = true;
		const params = new URLSearchParams();
		if (selectedType !== 'all') params.set('type', selectedType);
		if (selectedTag !== 'all') params.set('tag', selectedTag);
		if (search) params.set('search', search);
		const res = await fetch(`/api/prompts?${params}`);
		prompts = await res.json();
		loading = false;
	}

	async function loadAllPrompts() {
		const res = await fetch('/api/prompts');
		allPrompts = await res.json();
	}

	async function loadTags() {
		const res = await fetch('/api/tags');
		tags = await res.json();
	}

	async function createPrompt(formData: FormData) {
		await fetch('/api/prompts', { method: 'POST', body: formData });
		await loadAllPrompts();
		await loadPrompts();
	}

	function selectType(value: string) {
		selectedType = value;
		selectedTag = 'all';
		loadPrompts();
	}

	const filteredTags = $derived(() => {
		if (selectedType === 'all') return tags;
		const set = new Set<string>();
		for (const p of allPrompts) {
			if (p.type === selectedType) {
				for (const t of p.tags) set.add(t);
			}
		}
		return Array.from(set).sort();
	});

	onMount(() => {
		loadPrompts();
		loadTags();
		loadAllPrompts();
	});

	const types = [
		{ value: 'all', label: 'All' },
		{ value: 'image', label: 'Image' },
		{ value: 'markdown', label: 'Markdown' },
		{ value: 'text', label: 'Text' },
		{ value: 'code', label: 'Code' }
	];
</script>

<svelte:head>
	<title>PromptDeck</title>
</svelte:head>

<svelte:window onmouseup={endDrag} onmousemove={doDrag} ontouchend={endDrag} ontouchmove={doDrag} />

<Toast message={toastMessage} show={toastShow} />

<div class="min-h-screen bg-[#0f1117] bg-dashboard">
	<!-- Header -->
	<header class="border-b border-[#2a2e3b]/40 bg-[#0f1117]/60 backdrop-blur-md sticky top-0 z-40">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<div class="w-9 h-9 rounded-lg bg-[#6366f1] flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h1 class="text-2xl font-condensed font-bold tracking-tight text-[#e5e7eb] uppercase">PromptDeck</h1>
				</div>

				<div class="flex-1 max-w-md hidden sm:block">
					<div class="relative">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<input
							bind:value={search}
							oninput={() => loadPrompts()}
							placeholder="Search prompts..."
							class="w-full bg-[#161922] border border-[#2a2e3b] rounded-lg pl-10 pr-4 py-2 text-sm text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] transition-colors"
						/>
					</div>
				</div>

				<a
					href="/admin"
					class="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white text-sm font-medium rounded-lg hover:bg-[#4f46e5] transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
					</svg>
					<span class="hidden sm:inline">Login</span>
				</a>
			</div>

			<!-- Mobile search -->
			<div class="mt-3 sm:hidden">
				<div class="relative">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						bind:value={search}
						oninput={() => loadPrompts()}
						placeholder="Search prompts..."
						class="w-full bg-[#161922] border border-[#2a2e3b] rounded-lg pl-10 pr-4 py-2 text-sm text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1]"
					/>
				</div>
			</div>
		</div>
	</header>

	<!-- Filters -->
	<div class="glass-bar">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
			<!-- Type row -->
			<div
				bind:this={typeRow}
				class="flex items-center gap-3 overflow-hidden cursor-grab select-none"
				onmousedown={(e) => startDrag(e, typeRow!)}
				ontouchstart={(e) => startDrag(e, typeRow!)}
				role="region"
				aria-label="Type filter"
			>
				<span class="text-xs text-[#6b7280] uppercase tracking-wider font-medium whitespace-nowrap shrink-0">Type</span>
				{#each types as t}
					<button
						onclick={() => selectType(t.value)}
						class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 {selectedType === t.value ? 'bg-[#6366f1] text-white' : 'bg-[#1e212d] text-[#9ca3af] hover:text-[#e5e7eb]'}">
						{t.label}
					</button>
				{/each}
			</div>

			<!-- Tag row -->
			{#if filteredTags().length > 0}
				<div
					bind:this={tagRow}
					class="flex items-center gap-3 mt-2 overflow-hidden cursor-grab select-none"
					onmousedown={(e) => startDrag(e, tagRow!)}
					ontouchstart={(e) => startDrag(e, tagRow!)}
					role="region"
					aria-label="Tag filter"
				>
					<span class="text-xs text-[#6b7280] uppercase tracking-wider font-medium whitespace-nowrap shrink-0">Tags</span>
					<button
						onclick={() => { selectedTag = 'all'; loadPrompts(); }}
						class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 {selectedTag === 'all' ? 'bg-[#6366f1] text-white' : 'bg-[#1e212d] text-[#9ca3af] hover:text-[#e5e7eb]'}">
						All
					</button>
					{#each filteredTags() as tag}
						<button
							onclick={() => { selectedTag = tag; loadPrompts(); }}
							class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 {selectedTag === tag ? 'bg-[#6366f1] text-white' : 'bg-[#1e212d] text-[#9ca3af] hover:text-[#e5e7eb]'}">
							{tag}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if loading}
			<div class="flex items-center justify-center py-20">
				<div class="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
			</div>
		{:else}
			<div class="mb-4 flex items-center justify-between">
				<p class="text-sm text-[#6b7280]">
					<span class="font-condensed text-lg text-[#e5e7eb]">{prompts.length}</span> prompt{prompts.length === 1 ? '' : 's'}
				</p>
			</div>
			<PromptGrid {prompts} onCopy={() => showToast('Prompt copied to clipboard')} />
		{/if}
	</main>
</div>

<PromptModal show={showModal} onClose={() => (showModal = false)} onSave={createPrompt} />
