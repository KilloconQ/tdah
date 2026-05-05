<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header>
		<div
			class="flex items-center justify-between border-b border-border bg-surface px-4 py-3 text-sm text-muted"
		>
			<p>
				{data.user.name}
				{data.profile?.xp ?? 0} XP · {data.profile?.points ?? 0} pts
			</p>
			<form method="POST" action="/logout">
				<Button type="submit" variant="ghost">Salir</Button>
			</form>
		</div>
	</header>
	<main class="flex-1 pb-16">
		{@render children()}
	</main>

	<nav
		class="fixed bottom-0 flex w-full justify-evenly border-t border-border bg-surface px-4 py-3 font-medium text-muted"
	>
		<a href={resolve('/dashboard')}>Hoy</a>
		<a href={resolve('/task-list')}>Tareas</a>
		<a href={resolve('/habits')}>Hábitos</a>
	</nav>
</div>
