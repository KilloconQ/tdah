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
	parentTaskId: text('parentTaskId').references((): AnySQLiteColumn => task.id)
});

export const goal = sqliteTable('goal', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	userId: text('userId')
		.references(() => user.id)
		.notNull()
});

export const habit = sqliteTable('habit', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description')
});

export const dailyPlan = sqliteTable('dailyPlan', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.references(() => user.id)
		.notNull(),
	date: integer('date', { mode: 'timestamp_ms' }).notNull()
});

export const dailyPlanItem = sqliteTable('dailyPlanItem', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	dailyPlanId: text('dailyPlanId')
		.references(() => dailyPlan.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	taskId: text('taskId').references(() => task.id, { onDelete: 'cascade' }),
	habitId: text('habitId').references(() => habit.id, { onDelete: 'cascade' }),
	order: integer('order').notNull(),
	completed: integer('completed', { mode: 'boolean' }).default(false).notNull()
});

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

export * from './auth.schema';
