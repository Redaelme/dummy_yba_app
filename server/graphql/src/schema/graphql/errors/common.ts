/* eslint-disable max-classes-per-file */
import { ApolloError } from 'apollo-server-errors';
import { EntityTypes } from '../../../utils/constants';

export const NOT_FOUND = 'NOT_FOUND';
export const USER_NOT_FOUND = 'USER_NOT_FOUND';
export const O_AUTH_TOKEN_NOT_FOUND = 'O_AUTH_TOKEN_NOT_FOUND';
export const NotFoundErrorName = 'NotFoundError';
export const UNAUTHENTICATED = 'UNAUTHENTICATED';
export class NotFoundError extends ApolloError {
  constructor(
    message = 'Not found',
    key?: string | number | symbol,
    value?: any,
    entity: string = EntityTypes.UNKNOWN,
    code: string = NOT_FOUND,
    properties: Record<string, any> = {},
  ) {
    super(message, code, { ...properties, entity, key, value });

    Object.defineProperty(this, 'name', {
      value: NotFoundErrorName,
      writable: true,
    });
  }
}

export const WRONG_VALUE = 'WRONG_VALUE';
export const WrongValueErrorName = 'WrongValueError';

export class WrongValueError extends ApolloError {
  // Use this when the user input is wrong

  constructor(
    message = 'Wrong value',
    key: string | number | symbol,
    value: any,
    properties: Record<string, any> = {},
  ) {
    super(message, WRONG_VALUE, { ...properties, key, value });

    Object.defineProperty(this, 'name', { value: WrongValueErrorName });
  }
}

export const ALREADY_EXIST = 'ALREADY_EXIST';
export const AlreadyExistErrorName = 'AlreadyExistError';

export class AlreadyExistError extends ApolloError {
  constructor(
    message = 'Already exist',
    key: string | number | symbol,
    value: any,
    properties: Record<string, any> = {},
    entity: string = EntityTypes.UNKNOWN,
  ) {
    super(message, ALREADY_EXIST, { ...properties, entity, key, value });

    Object.defineProperty(this, 'name', { value: AlreadyExistErrorName });
  }
}

export const INVALID_TOKEN = 'INVALID_TOKEN';
export const InvalidTokenErrorName = 'InvalidTInvalidTokenErroroken';

export class InvalidTokenError extends ApolloError {
  constructor(message: string = 'Invalid Token', properties: Record<string, any> = {}) {
    super(message, INVALID_TOKEN, { ...properties });

    Object.defineProperty(this, 'name', { value: InvalidTokenErrorName });
  }
}

export const SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND';
export const SLOT_NOT_FOUND = 'SLOT_NOT_FOUND';
export const SCHEDULE_NOT_FOUND = 'SCHEDULE_NOT_FOUND';
export const UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR';
export const UnauthorizedErrorName = 'UnauthorizedError';
export class UnauthorizedError extends ApolloError {
  constructor(message: string = 'Unauthorized request') {
    super(message, UNAUTHORIZED_ERROR);
    Object.defineProperty(this, 'name', { value: UnauthorizedErrorName, writable: true });
  }
}
