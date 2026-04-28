<script lang="ts">
	let { form } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
	<form method="post" action="?/register" class="w-full max-w-sm">
		<label for="name" class="text-sm font-medium text-gray-700">Username:</label
		>
		<input
			type="text"
			id="name"
			name="name"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			required
		/>

		<label for="email" class="text-sm font-medium text-gray-700">Email:</label>
		<input
			type="email"
			id="email"
			name="email"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			required
		/>

		<label for="password" class="text-sm font-medium text-gray-700"
			>Password:</label
		>
		<input
			type="password"
			id="password"
			name="password"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			required
		/>

		<button
			type="submit"
			class="my-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
			>Registrarse</button
		>
	</form>
</div>
