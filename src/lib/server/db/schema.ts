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
	description: text('description'),
	priority: integer('priority').notNull().default(1),
	parentTaskId: text('parent_task_id').references(
		(): AnySQLiteColumn => task.id
	),
	goalId: text('goal_id').references(() => goal.id),
	status: text('status', { enum: ['pending', 'completed', 'cancelled'] })
		.notNull()
		.default('pending'),
	userId: text('user_id').references(() => user.id)
});

export const goal = sqliteTable('goal', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description'),
	status: text('status', { enum: ['active', 'completed', 'cancelled'] }),
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
	frequency: text('frequency', {
		enum: ['daily', 'weekly', 'monthly']
	}).notNull(),
	goalId: text('goal_id').references(() => goal.id)
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
	dailyPlanItem: many(dailyPlanItem),
	goal: one(goal, {
		fields: [task.goalId],
		references: [goal.id]
	})
}));

export const userProfileRelations = relations(userProfile, ({ one }) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id]
	})
}));

export const goalRelations = relations(goal, ({ many }) => ({
	tasks: many(task),
	habits: many(habit)
}));

export const habitRelations = relations(habit, ({ many, one }) => ({
	goal: one(goal, {
		fields: [habit.goalId],
		references: [goal.id]
	}),
	dailyPlanItems: many(dailyPlanItem),
	focusSessions: many(focusSession)
}));

export const dailyPlanRelations = relations(dailyPlan, ({ many, one }) => ({
	user: one(user, {
		fields: [dailyPlan.userId],
		references: [user.id]
	}),
	items: many(dailyPlanItem)
}));

export const dailyPlanItemRelations = relations(dailyPlanItem, ({ one }) => ({
	dailyPlan: one(dailyPlan, {
		fields: [dailyPlanItem.dailyPlanId],
		references: [dailyPlan.id]
	}),
	task: one(task, {
		fields: [dailyPlanItem.taskId],
		references: [task.id]
	}),
	habit: one(habit, {
		fields: [dailyPlanItem.habitId],
		references: [habit.id]
	})
}));

export const focusSessionRelations = relations(focusSession, ({ one }) => ({
	user: one(user, {
		fields: [focusSession.userId],
		references: [user.id]
	}),
	task: one(task, {
		fields: [focusSession.taskId],
		references: [task.id]
	}),
	habit: one(habit, {
		fields: [focusSession.habitId],
		references: [habit.id]
	})
}));

export * from './auth.schema';
