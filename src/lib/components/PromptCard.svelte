<script lang="ts">
	import type { Prompt } from '$lib/types';
	import { onMount } from 'svelte';

	let { prompt, onCopy }: { prompt: Prompt; onCopy?: () => void } = $props();

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
		onCopy?.();
	}

	function triggerRipple(e: MouseEvent) {
		const btn = e.currentTarget as HTMLButtonElement;
		const rect = btn.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		const ring = document.createElement('span');
		ring.className = 'ripple-ring';
		ring.style.width = ring.style.height = `${size}px`;
		ring.style.left = `${e.clientX - rect.left - size / 2}px`;
		ring.style.top = `${e.clientY - rect.top - size / 2}px`;
		btn.appendChild(ring);
		setTimeout(() => ring.remove(), 600);
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
					onclick={(e) => {
						triggerRipple(e);
						showFull = true;
						incrementView();
					}}
					class="ripple-btn p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</button>
				<button
					type="button"
					aria-label="Copy prompt"
					onclick={(e) => {
						triggerRipple(e);
						copyPrompt();
					}}
					class="ripple-btn p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<div class="p-4 flex flex-col flex-grow">
		<h3 class="font-bold text-[#e5e7eb] mb-2 truncate">{prompt.title}</h3>
		<div class="prompt-box border border-[#2a2e3b] rounded-lg p-3 text-xs text-[#9ca3af] mb-4 flex-grow font-mono relative group/prompt">
			<div class="flex justify-between items-start gap-2">
				<p class="line-clamp-4">{prompt.prompt || prompt.content || 'No prompt content.'}</p>
				<button
					type="button"
					aria-label="Copy prompt"
					onclick={(e) => {
						triggerRipple(e);
						copyPrompt();
					}}
					class="ripple-btn shrink-0 p-1.5 rounded-md bg-[#1e212d] border border-[#2a2e3b] text-[#6b7280] opacity-0 group-hover/prompt:opacity-100 hover:text-[#e5e7eb] hover:border-[#6366f1] hover:bg-[#6366f1]/10 transition-all"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
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
