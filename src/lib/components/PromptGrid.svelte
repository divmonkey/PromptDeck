<script lang="ts">
	import PromptCard from './PromptCard.svelte';
	import type { Prompt } from '$lib/types';

	let { prompts }: { prompts: Prompt[] } = $props();
</script>

<div class="prompt-grid">
	{#each prompts as prompt (prompt.id)}
		<PromptCard {prompt} />
	{:else}
		<div class="col-span-full py-20 flex flex-col items-center justify-center text-[#6b7280] gap-4">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.022.547l-2.387 4.774a1 1 0 001.205 1.205l4.774-2.387a2 2 0 011.022-.547l2.387-.477a6 6 0 013.86.517l.318-.158a6 6 0 003.86-.517l1.531-.306a2 2 0 011.022.547l2.387 4.774a1 1 0 001.205-1.205l-2.387-4.774zM12 11a3 3 0 100-6 3 3 0 000 6z" />
			</svg>
			<p class="text-sm">No prompts found matching your search.</p>
		</div>
	{/each}
</div>
