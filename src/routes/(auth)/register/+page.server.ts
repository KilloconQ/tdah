import { fail, redirect } from '@sveltejs/kit';

import { APIError } from 'better-auth/api';

import { auth } from '$lib/server/auth.js';

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name,
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
