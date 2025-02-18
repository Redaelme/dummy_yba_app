import { extendType, inputObjectType, nonNull, list, objectType, stringArg } from 'nexus';

import resolvers from "../resolvers";

export const Task = objectType({
  name: 'Task',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.int('duration');
    t.nullable.string('tag');
    t.nullable.string('status');
    t.nullable.string('notes');
    t.nullable.string('timezone');
    t.nullable.string('startTime');
    t.nullable.string('endTime');
    t.nonNull.string('deadline');
    t.nonNull.string('title');
    t.nonNull.string('mode');
    t.nullable.string('assignedTo');
    t.nullable.string('participants');
    t.nullable.string('endDate');
    t.nullable.string('priority');
    t.nullable.string('startDate');
    t.nullable.string('parentTaskId');
    t.nullable.int('progress');
    t.nullable.string('updatedAt');
    t.nullable.string('createdAt');
    t.nullable.string('userId');
    t.nullable.string('scheduleId');
    t.list.field('subtasks', {
      type: 'Task',
      resolve: async (parent, _args, context) => {
        return context.prisma.task.findMany({
          where: {
            parentTaskId: parent.id,
          },
        });
      },
    });
  },
});

export const SubtaskInput = inputObjectType({
  name: 'SubtaskInput',
  definition(t) {
    t.nonNull.string('duration');
    t.nonNull.string('assignedTo');
    t.nonNull.string('endDate');
    t.nonNull.string('deadline');
    t.nonNull.string('participants');
    t.nonNull.string('priority');
    t.nonNull.string('startDate');
    t.nonNull.string('title');
  },
});

export const TaskInput = inputObjectType({
  name: 'TaskInput',
  definition(t) {
    t.nonNull.string('tag');
    t.nonNull.string('deadline');
    t.nonNull.string('duration');
    t.nonNull.string('assignedTo');
    t.nonNull.string('endDate');
    t.nonNull.string('participants');
    t.nonNull.string('priority');
    t.nonNull.string('startDate');
    t.nonNull.string('title');
    t.nonNull.string('mode');
    t.list.nonNull.field('subtasks', { type: 'SubtaskInput' });
  },
});

export const TaskMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTask', {
      type: 'Task',
      args: {
        data: nonNull('TaskInput'),
      },
      resolve: resolvers.Mutation.createTask,
    });
    t.field('deleteTask', {
      type: 'Task',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.removeTask,
    });
    t.field('updateTask', {
      type: 'Task',
      args: {
        id: nonNull(stringArg()),
        data: nonNull('TaskInput'),
      },
      resolve: resolvers.Mutation.updateTask,
    });
  },
});

export const TaskQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getAllUserTasks', {
      type: 'Task',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getAllUserTasks,
    });
    t.field('getTaskById', {
      type: 'Task',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getTaskById,
    });
  },
});