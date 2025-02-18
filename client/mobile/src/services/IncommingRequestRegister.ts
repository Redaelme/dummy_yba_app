// import { IFCMTypeMessageData } from '../types';
import { IRegister } from './Register';

/**
 *
 *  With NavigationRegister the navigation props of @react-navigation is availible any where
 *
 */

type IncomingRequest = {
  incoming: (refetch: boolean) => void;
};
export class IncomingRequestRegisterRegister extends IRegister {
  private incoming: any;

  constructor(name: string) {
    super(name);
  }

  setIncomingRequestRegister(incoming: any) {
    this.incoming = incoming;
  }

  getIncomingRequestRegister() {
    return this.incoming as IncomingRequest;
  }

  refetch(refetch: true) {
    try {
      this.incoming(true);
    } catch (error) {}
  }
}
