<script lang="ts">
	import { resolve } from '$app/paths';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header></header>
	<main class="flex-1 pb-16">
		{@render children()}
	</main>

	<nav class="fixed bottom-0 flex w-full justify-evenly border-t bg-white py-3">
		<a href={resolve('/dashboard')}>Hoy</a>
		<a href={resolve('/task-list')}>Tareas</a>
		<a href={resolve('/habits')}>Hábitos</a>
	</nav>
</div>
