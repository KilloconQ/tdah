<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'ghost';

	let {
		variant = 'primary' as Variant,
		type = 'button',
		class: className = '',
		children,
		...props
	}: {
		variant?: Variant;
		type?: HTMLButtonElement['type'];
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const base =
		'font-semibold py-3 px-4 rounded-lg transition-all active:scale-95 cursor-pointer';
	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-white hover:opacity-90',
		ghost: 'text-muted hover:text-text'
	};
</script>

<button {type} class="{base} {variants[variant]} {className}" {...props}>
	{@render children?.()}
</button>
