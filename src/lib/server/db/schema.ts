import { relations } from 'drizzle-orm';
import {
	integer,
	sqliteTable,
	text,
	type AnySQLiteColumn
} from 'drizzle-orm/sqlite-core';

import { user } from './auth.schema';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1),
	parentTaskId: text('parent_task_id').references(
		(): AnySQLiteColumn => task.id
	),
	userId: text('user_id').references(() => user.id)
});

export const goal = sqliteTable('goal', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	userId: text('user_id')
		.references(() => user.id)
		.notNull()
});

export const habit = sqliteTable('habit', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.references(() => user.id)
		.notNull(),
	title: text('title').notNull(),
	description: text('description'),
	frecuency: text('frecuency')
});

export const dailyPlan = sqliteTable('daily_plan', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.references(() => user.id)
		.notNull(),
	date: integer('date', { mode: 'timestamp_ms' }).notNull()
});

export const dailyPlanItem = sqliteTable('daily_plan_item', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	dailyPlanId: text('daily_plan_id')
		.references(() => dailyPlan.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	taskId: text('task_id').references(() => task.id, { onDelete: 'cascade' }),
	habitId: text('habit_id').references(() => habit.id, { onDelete: 'cascade' }),
	order: integer('order').notNull(),
	completed: integer('completed', { mode: 'boolean' }).default(false).notNull()
});

export const focusSession = sqliteTable('focus_session', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	habitId: text('habit_id').references(() => habit.id, {
		onDelete: 'set null'
	}),
	taskId: text('task_id').references(() => task.id, { onDelete: 'set null' }),
	status: text('status', { enum: ['working', 'break', 'completed'] }).notNull(),
	duration: integer('duration').notNull(),
	startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
	completedAt: integer('completed_at', { mode: 'timestamp_ms' })
});

export const userProfile = sqliteTable('user_profile', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	xp: integer('xp').default(0).notNull(),
	points: integer('points').default(0).notNull()
});

// export const reward = sqliteTable();
// Relations

export const taskRelations = relations(task, ({ many, one }) => ({
	subtasks: many(task, { relationName: 'subtasks' }),
	parentTask: one(task, {
		fields: [task.parentTaskId],
		references: [task.id],
		relationName: 'subtasks'
	}),
	dailyPlanItem: many(dailyPlanItem)
}));

export const userProfileRelations = relations(userProfile, ({ one }) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id]
	})
}));

export * from './auth.schema';
