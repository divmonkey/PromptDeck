<script lang="ts">
	let { message = '', show = false }: { message?: string; show?: boolean } = $props();
</script>

{#if show}
	<div class="toast">
		<div class="toast__box">
			<svg xmlns="http://www.w3.org/2000/svg" class="toast__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span class="toast__message">{message}</span>
		</div>
	</div>
{/if}
