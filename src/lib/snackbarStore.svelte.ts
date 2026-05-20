export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarMessage {
	id: number;
	message: string;
	type: SnackbarType;
	duration: number;
}

class SnackbarStore {
	snacks = $state<SnackbarMessage[]>([]);
	private idCounter = 0;

	show(message: string, type: SnackbarType = 'info', duration = 4000) {
		const id = ++this.idCounter;
		this.snacks = [...this.snacks, { id, message, type, duration }];
		setTimeout(() => this.dismiss(id), duration);
	}

	dismiss(id: number) {
		this.snacks = this.snacks.filter((s) => s.id !== id);
	}
}

export const snackbarStore = new SnackbarStore();
