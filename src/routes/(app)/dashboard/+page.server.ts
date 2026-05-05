import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const tasks = await db.query.task.findMany({
		where: (t, { eq, and }) =>
			and(eq(t.userId, event.locals.user.id), eq(t.status, 'pending')),
		orderBy: (t, { desc }) => desc(t.createdAt)
	});

	return { tasks };
};
