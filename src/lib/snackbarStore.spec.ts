import { describe, it, expect, vi, beforeEach } from 'vitest';
import { snackbarStore } from './snackbarStore.svelte';

describe('snackbarStore', () => {
	beforeEach(() => {
		snackbarStore.snacks = [];
	});

	it('should add a snack and auto-dismiss after duration', () => {
		vi.useFakeTimers();
		snackbarStore.show('Test message', 'success', 4000);
		expect(snackbarStore.snacks.length).toBe(1);
		expect(snackbarStore.snacks[0].message).toBe('Test message');
		expect(snackbarStore.snacks[0].type).toBe('success');

		vi.advanceTimersByTime(4000);
		expect(snackbarStore.snacks.length).toBe(0);
		vi.useRealTimers();
	});

	it('should support multiple snacks', () => {
		snackbarStore.show('First', 'info');
		snackbarStore.show('Second', 'warning');
		expect(snackbarStore.snacks.length).toBe(2);
		expect(snackbarStore.snacks[0].message).toBe('First');
		expect(snackbarStore.snacks[1].message).toBe('Second');
	});

	it('should dismiss manually', () => {
		snackbarStore.show('To dismiss', 'error');
		const id = snackbarStore.snacks[0].id;
		snackbarStore.dismiss(id);
		expect(snackbarStore.snacks.length).toBe(0);
	});
});
