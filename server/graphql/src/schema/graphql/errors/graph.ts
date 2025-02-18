import { ApolloError } from 'apollo-server-errors';
import { UNKNOWN_ERROR } from '.';
import { EntityTypes } from '../../../utils/constants';

export const GraphErrorName = 'GraphError';
export class GraphError extends ApolloError {
  constructor(
    code: string = UNKNOWN_ERROR,
    message: string = 'Graph Error',
    entity: string = EntityTypes.UNKNOWN,
    properties: Record<string, any> = {},
  ) {
    super(message, code, { ...properties, entity });

    Object.defineProperty(this, 'name', {
      value: GraphErrorName,
      writable: true,
    });
  }
}
