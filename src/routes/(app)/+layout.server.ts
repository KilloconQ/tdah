import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userProfile } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	let profile = await db.query.userProfile.findFirst({
		where: (t, { eq }) => eq(t.userId, event.locals.user!.id)
	});

	if (!profile) {
		await db.insert(userProfile).values({
			userId: event.locals.user.id,
			xp: 0,
			points: 0
		});

		profile = await db.query.userProfile.findFirst({
			where: (t, { eq }) => eq(t.userId, event.locals.user!.id)
		});
	}

	return { user: event.locals.user, profile };
};
