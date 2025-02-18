/* eslint-disable max-classes-per-file */
import { ApolloError } from 'apollo-server-errors';
import { EntityTypes } from '../../../utils/constants';

export const NO_FREE_SLOT = 'NO_FREE_SLOT';
export const USER_NOT_FOUND = 'USER_NOT_FOUND';
export const O_AUTH_TOKEN_NOT_FOUND = 'O_AUTH_TOKEN_NOT_FOUND';
export const NoFreeSlotFoundErrorName = 'NoFreeSlotFoundError';
export const UNHAUTHORIZED = 'UNHAUTHORIZED';
export const SCHEDULE_NOT_FOUND = 'SCHEDULE_NOT_FOUND';
export class NoFreeSlotFoundError extends ApolloError {
  constructor(
    message = 'Not found',
    key?: string | number | symbol,
    value?: any,
    entity: string = EntityTypes.UNKNOWN,
    code: string = NO_FREE_SLOT,
    properties: Record<string, any> = {},
  ) {
    super(message, code, { ...properties, entity, key, value });

    Object.defineProperty(this, 'name', {
      value: NoFreeSlotFoundErrorName,
      writable: true,
    });
  }
}
export class UnhauthorizedError extends ApolloError {
  constructor(
    message = 'Unhauthorized',
    key?: string | number | symbol,
    value?: any,
    entity: string = EntityTypes.UNHAUTHORIZED,
    code: string = UNHAUTHORIZED,
    properties: Record<string, any> = {},
  ) {
    super(message, code, { ...properties, entity, key, value });

    Object.defineProperty(this, 'name', {
      value: UNHAUTHORIZED,
      writable: true,
    });
  }
}

export const SLOT_PROPOSAL_TRIAL_EXCEEDED = 'SLOT_PROPOSAL_TRIAL_EXCEEDED';
export const SlotProposalTrialExceededErrorName = 'SlotProposalTrialExceededError';
export class SlotProposalTrialExceededError extends ApolloError {
  constructor(
    message: string,
    entity: string = EntityTypes.SCHEDULE,
    properties: Record<string, any> = {},
  ) {
    super(message, SLOT_PROPOSAL_TRIAL_EXCEEDED, { ...properties, entity });

    Object.defineProperty(this, 'name', {
      value: SlotProposalTrialExceededErrorName,
      writable: true,
    });
  }
}
