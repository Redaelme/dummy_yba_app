import { Kind } from 'graphql';
import { scalarType } from 'nexus';

export const DateScalar = scalarType({
  name: 'DateTime',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return new Date(value).getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
