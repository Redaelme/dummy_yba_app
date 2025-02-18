import {
  ALREADY_EXIST,
  AlreadyExistError,
  AlreadyExistErrorName,
  NOT_FOUND,
  NotFoundError,
  NotFoundErrorName,
  O_AUTH_TOKEN_NOT_FOUND,
  USER_NOT_FOUND,
  WRONG_VALUE,
  WrongValueError,
  WrongValueErrorName,
  InvalidTokenError,
  INVALID_TOKEN,
  InvalidTokenErrorName,
  UnauthorizedError,
  UNAUTHORIZED_ERROR,
  UnauthorizedErrorName,
} from './common';
import { GraphError, GraphErrorName } from './graph';
import {
  NO_FREE_SLOT,
  NoFreeSlotFoundError,
  NoFreeSlotFoundErrorName,
  SlotProposalTrialExceededError,
  SLOT_PROPOSAL_TRIAL_EXCEEDED,
  SlotProposalTrialExceededErrorName,
} from './Shedule';

export {
  AlreadyExistError,
  GraphError,
  NoFreeSlotFoundError,
  NotFoundError,
  WrongValueError,
  InvalidTokenError,
  SlotProposalTrialExceededError,
  UnauthorizedError,
};

export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

export const CodeSet: Set<string> = new Set([
  'INTERNAL_SERVER_ERROR',
  'UNAUTHENTICATED', // User must be authentified to perform the action
  'FORBIDDEN', // User is not allowed to perform the action (ex: need admin right)
  'BAD_USER_INPUT', // Front end input error
  UNAUTHORIZED_ERROR,
  UNKNOWN_ERROR,
  //   Already exists
  ALREADY_EXIST,
  //   Not found
  NOT_FOUND,
  USER_NOT_FOUND,
  O_AUTH_TOKEN_NOT_FOUND,

  //   Value error
  WRONG_VALUE,
  NO_FREE_SLOT,

  // TOKEN ERROR
  INVALID_TOKEN,
  // Schedule
  SLOT_PROPOSAL_TRIAL_EXCEEDED,
]);

const ErrorNameSet: Set<string> = new Set([
  'ApolloError',
  'AuthenticationError',
  'ForbiddenError',
  'PersistedQueryNotFoundError',
  'PersistedQueryNotSupportedError',
  'UserInputError',
  NotFoundErrorName,
  WrongValueErrorName,
  AlreadyExistErrorName,
  GraphErrorName,
  NoFreeSlotFoundErrorName,
  InvalidTokenErrorName,
  SlotProposalTrialExceededErrorName,
  UnauthorizedErrorName,
]);

export default ErrorNameSet;
