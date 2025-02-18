import { makeSchema } from 'nexus';
import * as path from 'path';
import * as types from './graphql';

export const schema = makeSchema({
  types,
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
  contextType: {
    module: path.join(__dirname, '../types/contextType.ts'),
    export: 'Context',
  },
  outputs: {
    schema: path.join(__dirname, '../schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
});
