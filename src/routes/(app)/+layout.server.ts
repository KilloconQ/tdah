import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { PageServerLoad } from '../demo/better-auth/$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/demo/better-auth/login');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/demo/better-auth/login');
	}
};
