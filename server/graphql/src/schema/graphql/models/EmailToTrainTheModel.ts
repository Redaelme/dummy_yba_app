import { extendType, inputObjectType, list, objectType } from 'nexus';
import resolvers from '../resolvers';

export const EmailToTrainTheModelType = objectType({
  name: 'EmailToTrainTheModelType',
  definition: (t) => {
    t.nonNull.string('id');
    t.string('object');
    t.string('content');
  },
});

export const EmailToTrainTheModelInput = inputObjectType({
  name: 'EmailToTrainTheModelInput',
  definition: (t) => {
    t.string('object');
    t.string('content');
  },
});

export const EmailToTrainTheModelMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('addEmailToTrainTheModel', {
      type: 'Boolean',
      args: { input: list('EmailToTrainTheModelInput') },
      resolve: resolvers.Mutation.addEmailToTrainTheModel,
    });
  },
});
