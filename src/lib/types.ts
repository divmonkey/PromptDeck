export interface Prompt {
	id: number;
	type: 'image' | 'markdown' | 'text' | 'code';
	imageUrl?: string;
	title: string;
	description?: string;
	prompt?: string;
	content?: string;
	tags: string[];
	notes?: string;
	likes: number;
	views: number;
	createdAt: string;
	updatedAt: string;
}
