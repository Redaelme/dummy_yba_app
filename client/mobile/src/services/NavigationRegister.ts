// import { IFCMTypeMessageData } from '../types';
import { IRegister } from './Register';

/**
 *
 *  With NavigationRegister the navigation props of @react-navigation is availible any where
 *
 */

type Navigation = {
  navigate: (screen: string, params: any) => void;
};
export class NavigationRegister extends IRegister {
  private navigation: any;

  constructor(name: string) {
    super(name);
  }

  setNavigation(navigation: any) {
    this.navigation = navigation;
  }

  getNavigation() {
    return this.navigation as Navigation;
  }

  goToContact(data?: any) {
    try {
      let scheduleId = '';
      if (data) {
        scheduleId = data.scheduleId;
      }
      this.navigation.navigate('Contact', { openModal: true, ...data, scheduleId });
    } catch (error) {}
  }
  goToMeetingRequestReceived() {
    try {
      this.navigation.navigate('MeetingRequestReceived', { refetch: true });
    } catch (error) {}
  }
}
