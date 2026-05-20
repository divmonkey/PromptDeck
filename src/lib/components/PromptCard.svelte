<script lang="ts">
	import type { Prompt } from '$lib/types';
	import { onMount } from 'svelte';

	let { prompt }: { prompt: Prompt } = $props();

	let showFull = $state(false);
	let likes = $state(0);
	let views = $state(0);

	$effect(() => {
		likes = prompt.likes;
		views = prompt.views;
	});
	let canLike = $state(true);
	let timeLeft = $state(0);

	onMount(() => {
		const lastLiked = localStorage.getItem(`like_${prompt.id}`);
		if (lastLiked) {
			const diff = Date.now() - parseInt(lastLiked);
			if (diff < 86400000) {
				canLike = false;
				timeLeft = Math.ceil((86400000 - diff) / 1000);
				const interval = setInterval(() => {
					timeLeft--;
					if (timeLeft <= 0) {
						canLike = true;
						clearInterval(interval);
					}
				}, 1000);
			}
		}
	});

	async function toggleLike() {
		if (!canLike) return;
		const sessionId = crypto.randomUUID();
		const res = await fetch(`/api/prompts/${prompt.id}/like`, {
			method: 'POST',
			headers: { 'x-session-id': sessionId }
		});
		if (res.ok) {
			const data = await res.json();
			likes = data.likes;
			canLike = false;
			localStorage.setItem(`like_${prompt.id}`, Date.now().toString());
			timeLeft = 86400;
			const interval = setInterval(() => {
				timeLeft--;
				if (timeLeft <= 0) {
					canLike = true;
					clearInterval(interval);
				}
			}, 1000);
		}
	}

	async function incrementView() {
		const res = await fetch(`/api/prompts/${prompt.id}/view`, { method: 'POST' });
		if (res.ok) {
			const data = await res.json();
			views = data.views;
		}
	}

	function copyPrompt() {
		navigator.clipboard.writeText(prompt.prompt || prompt.content || '');
	}

	function formatTime(s: number) {
		const h = Math.floor(s / 3600);
		const m = Math.floor((s % 3600) / 60);
		const sec = s % 60;
		return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
	}
</script>

{#if showFull}
	<button type="button" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-default" onclick={() => (showFull = false)} onkeydown={(e) => e.key === 'Escape' && (showFull = false)}>
		<img src={prompt.imageUrl} alt={prompt.title} class="max-h-[90vh] rounded-lg pointer-events-none" />
	</button>
{/if}

<div class="prompt-card flex flex-col h-full">
	{#if prompt.imageUrl}
		<div class="aspect-[4/3] w-full overflow-hidden bg-[#1e212d] relative group flex-shrink-0">
			<img src={prompt.imageUrl} alt={prompt.title} class="w-full h-full object-cover" />
			<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
				<button
					type="button"
					aria-label="View full image"
					onclick={() => {
						showFull = true;
						incrementView();
					}}
					class="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</button>
				<button type="button" aria-label="Copy prompt" onclick={copyPrompt} class="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<div class="p-4 flex flex-col flex-grow">
		<h3 class="font-bold text-[#e5e7eb] mb-2 truncate">{prompt.title}</h3>
		<div class="bg-black/30 border border-[#2a2e3b] rounded p-2 text-xs text-[#9ca3af] mb-4 flex-grow font-mono relative group/prompt">
			<p class="line-clamp-4 pr-6">{prompt.prompt || prompt.content || 'No prompt content.'}</p>
			<button
				type="button"
				aria-label="Copy prompt"
				onclick={copyPrompt}
				class="absolute top-1.5 right-1.5 p-1 rounded bg-[#2a2e3b]/60 text-[#6b7280] opacity-0 group-hover/prompt:opacity-100 hover:text-[#e5e7eb] hover:bg-[#6366f1] transition-all"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
			</button>
		</div>
		<div class="flex items-center justify-between pt-4 border-t border-[#2a2e3b]/50 mt-auto">
			<button
				onclick={toggleLike}
				class="flex items-center gap-1 transition-colors {canLike ? 'text-[#6b7280] hover:text-[#6366f1]' : 'text-[#4b5563] cursor-not-allowed'}"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill={canLike ? 'none' : 'currentColor'} viewBox="0 0 24 24" stroke="currentColor">
					<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
				</svg>
				<span class="font-condensed text-sm">{likes}</span>
				{#if !canLike}<span class="text-[10px] ml-1">{formatTime(timeLeft)}</span>{/if}
			</button>
			<span class="text-xs text-[#6b7280]"><span class="font-condensed">{views}</span> views</span>
		</div>
	</div>
</div>
