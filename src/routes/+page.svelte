<script lang="ts">
	import { onMount } from 'svelte';
	import PromptGrid from '$lib/components/PromptGrid.svelte';
	import PromptModal from '$lib/components/PromptModal.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import { showSnackbar } from '$lib/snackbarStore';
	import type { Prompt } from '$lib/types';

	let prompts = $state<Prompt[]>([]);
	let allPrompts = $state<Prompt[]>([]);
	let tags = $state<string[]>([]);
	let search = $state('');
	let selectedType = $state('all');
	let selectedTag = $state('all');
	let showModal = $state(false);
	let loading = $state(true);

	function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
		showSnackbar(message, type);
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

<Snackbar />

<div class="page-dashboard hero-bg">
	<!-- Header -->
	<header class="site-header">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<img src="/images/PromptDeck.png" alt="PromptDeck" class="brand-logo-img" />
					<h1 class="brand-name">PromptDeck</h1>
				</div>

				<div class="search-wrap hidden sm:block">
					<svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						bind:value={search}
						oninput={() => loadPrompts()}
						placeholder="Search prompts..."
						class="search-input"
					/>
				</div>

				<a href="/admin" class="login-btn login-btn--fancy">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
					</svg>
					<span class="hidden sm:inline">Login</span>
				</a>
			</div>

			<!-- Mobile search -->
			<div class="search-wrap search-wrap--mobile sm:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					bind:value={search}
					oninput={() => loadPrompts()}
					placeholder="Search prompts..."
					class="search-input"
				/>
			</div>
		</div>
	</header>

	<!-- Filters -->
	<div class="glass-bar">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
			<!-- Type row -->
			<div
				bind:this={typeRow}
				class="filter-row scrollbar-hide"
				onmousedown={(e) => startDrag(e, typeRow!)}
				ontouchstart={(e) => startDrag(e, typeRow!)}
				role="region"
				aria-label="Type filter"
			>
				<span class="filter-label">Type</span>
				{#each types as t}
					<button
						onclick={() => selectType(t.value)}
						class="filter-pill {selectedType === t.value ? 'filter-pill--active' : ''}">
						{t.label}
					</button>
				{/each}
			</div>

			<!-- Tag row -->
			{#if filteredTags().length > 0}
				<div
					bind:this={tagRow}
					class="filter-row mt-2 scrollbar-hide"
					onmousedown={(e) => startDrag(e, tagRow!)}
					ontouchstart={(e) => startDrag(e, tagRow!)}
					role="region"
					aria-label="Tag filter"
				>
					<span class="filter-label">Tags</span>
					<button
						onclick={() => { selectedTag = 'all'; loadPrompts(); }}
						class="filter-pill {selectedTag === 'all' ? 'filter-pill--active' : ''}">
						All
					</button>
					{#each filteredTags() as tag}
						<button
							onclick={() => { selectedTag = tag; loadPrompts(); }}
							class="filter-pill {selectedTag === tag ? 'filter-pill--active' : ''}">
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
				<div class="spinner"></div>
			</div>
		{:else}
			<div class="mb-4 flex items-center justify-between">
				<p class="results-count">
					<span class="results-count__number">{prompts.length}</span> prompt{prompts.length === 1 ? '' : 's'}
				</p>
			</div>
			<PromptGrid {prompts} onCopy={() => showToast('Prompt copied to clipboard')} onToast={(msg) => showToast(msg)} />
		{/if}
	</main>
</div>

<PromptModal show={showModal} onClose={() => (showModal = false)} onSave={createPrompt} />
