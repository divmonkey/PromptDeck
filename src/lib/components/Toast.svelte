<script lang="ts">
	let { message = '', show = false }: { message?: string; show?: boolean } = $props();
</script>

{#if show}
	<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none">
		<div class="px-6 py-3 bg-[#0a0c12] border border-[#6366f1]/60 rounded-xl shadow-2xl shadow-black/40 flex items-center gap-3 animate-toast-in">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span class="text-sm font-medium text-[#e5e7eb]">{message}</span>
		</div>
	</div>
{/if}

<style>
	@keyframes toast-in {
		0% { opacity: 0; transform: scale(0.9) translateY(8px); }
		100% { opacity: 1; transform: scale(1) translateY(0); }
	}
	.animate-toast-in {
		animation: toast-in 0.25s ease-out forwards;
	}
</style>
