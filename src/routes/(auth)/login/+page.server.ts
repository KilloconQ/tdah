import { auth } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

import { APIError } from 'better-auth/api';

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL: '/dashboard'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		return redirect(302, '/dashboard');
	}
};
