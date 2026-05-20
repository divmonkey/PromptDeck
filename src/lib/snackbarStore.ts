export interface SnackbarMessage {
	id: number;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	duration: number;
}

let listeners: ((snacks: SnackbarMessage[]) => void)[] = [];
let snacks: SnackbarMessage[] = [];
let idCounter = 0;

function notify() {
	for (const cb of listeners) cb([...snacks]);
}

export function subscribe(callback: (snacks: SnackbarMessage[]) => void) {
	listeners.push(callback);
	callback([...snacks]);
	return () => {
		listeners = listeners.filter((cb) => cb !== callback);
	};
}

export function showSnackbar(
	message: string,
	type: SnackbarMessage['type'] = 'info',
	duration = 4000
) {
	const id = ++idCounter;
	snacks = [...snacks, { id, message, type, duration }];
	notify();
	setTimeout(() => dismiss(id), duration);
}

export function dismiss(id: number) {
	snacks = snacks.filter((s) => s.id !== id);
	notify();
}
