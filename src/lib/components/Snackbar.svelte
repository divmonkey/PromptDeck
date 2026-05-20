<script lang="ts">
	interface SnackbarItem {
		id: number;
		message: string;
		type: 'success' | 'error' | 'warning' | 'info';
		duration: number;
	}

	let snacks = $state<SnackbarItem[]>([]);
	let idCounter = 0;

	export function showSnackbar(
		message: string,
		type: SnackbarItem['type'] = 'info',
		duration = 4000
	) {
		const id = ++idCounter;
		snacks = [...snacks, { id, message, type, duration }];
		setTimeout(() => dismiss(id), duration);
	}

	function dismiss(id: number) {
		snacks = snacks.filter((s) => s.id !== id);
	}

	const typeStyles = {
		success: 'snackbar--success',
		error: 'snackbar--error',
		warning: 'snackbar--warning',
		info: 'snackbar--info'
	};

	const typeIcons = {
		success: `<svg class="snackbar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
		error: `<svg class="snackbar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
		warning: `<svg class="snackbar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
		info: `<svg class="snackbar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
	};
</script>

{#if snacks.length > 0}
	<div class="snackbar-container">
		{#each snacks as snack (snack.id)}
			<div class="snackbar {typeStyles[snack.type]}" role="alert">
				<div class="snackbar__content">
					{@html typeIcons[snack.type]}
					<span class="snackbar__message">{snack.message}</span>
				</div>
				<button
					type="button"
					class="snackbar__close"
					onclick={() => dismiss(snack.id)}
					aria-label="Dismiss"
				>
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<!-- Progress bar -->
				<div class="snackbar__progress" style="animation-duration: {snack.duration}ms"></div>
			</div>
		{/each}
	</div>
{/if}
