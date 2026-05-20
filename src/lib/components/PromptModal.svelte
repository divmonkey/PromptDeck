<script lang="ts">
	import type { Prompt } from '$lib/types';
	let { show = false, onClose, onSave }: { show: boolean; onClose: () => void; onSave: (formData: FormData) => void } = $props();

	let title = $state('');
	let promptText = $state('');
	let tags = $state('');
	let imageFile = $state<File | null>(null);

	function submit() {
		const formData = new FormData();
		formData.append('data', JSON.stringify({ title, prompt: promptText, tags: tags.split(',').map((t) => t.trim()) }));
		if (imageFile) formData.append('imageFile', imageFile);
		onSave(formData);
		onClose();
		title = '';
		promptText = '';
		tags = '';
		imageFile = null;
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()} tabindex="-1">
		<div class="bg-[#161922] border border-[#2a2e3b] w-full max-w-lg p-6 rounded-2xl shadow-xl" onclick={(e) => e.stopPropagation()} role="document">
			<h2 class="text-xl font-bold mb-4">Create New Prompt</h2>
			<div class="flex flex-col gap-4">
				<input bind:value={title} placeholder="Title" class="bg-[#1e212d] p-3 rounded-lg border border-[#2a2e3b] text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1]" />
				<textarea bind:value={promptText} placeholder="Prompt content..." class="bg-[#1e212d] p-3 rounded-lg border border-[#2a2e3b] text-[#e5e7eb] placeholder-[#6b7280] h-32 focus:outline-none focus:border-[#6366f1]"></textarea>
				<input bind:value={tags} placeholder="Tags (comma separated)" class="bg-[#1e212d] p-3 rounded-lg border border-[#2a2e3b] text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1]" />
				<input type="file" accept="image/*" onchange={(e) => (imageFile = (e.target as HTMLInputElement).files?.[0] || null)} class="bg-[#1e212d] p-2 rounded-lg border border-[#2a2e3b] text-[#9ca3af]" />
				<div class="flex gap-2">
					<button onclick={onClose} class="flex-1 px-4 py-2 rounded-lg bg-[#1e212d] text-[#e5e7eb] hover:bg-[#2a2e3b] transition-colors">Cancel</button>
					<button onclick={submit} class="flex-1 px-4 py-2 rounded-lg bg-[#6366f1] text-white font-bold hover:bg-[#4f46e5] transition-colors">Save</button>
				</div>
			</div>
		</div>
	</div>
{/if}
