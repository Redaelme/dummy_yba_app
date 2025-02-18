// import { IFCMTypeMessageData } from '../types';
import { IRegister } from './Register';

/**
 *
 *  With NavigationRegister the navigation props of @react-navigation is availible any where
 *
 */

type StopListen = {
  removeListener: (type: string, params: any) => void;
};
export class CtxRegister extends IRegister {
  private ctx: any;

  // eslint-disable-next-line no-useless-constructor
  constructor(name: string) {
    super(name);
  }

  setCtx(ctx: any) {
    this.ctx = ctx;
  }

  getCtx() {
    return this.ctx as any;
  }
}
