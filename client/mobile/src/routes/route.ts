import { StackScreenProps } from '@react-navigation/stack';
import { EventSelectedProps } from '../components/Calendar/Agenda/AgendaComponent';
import { IDataPropsResheduling } from '../components/Calendar/RdvList/Rescheduling';
import { IViewMailProps } from '../components/MeetingRequestReceived/ViewMail';

export type RootStackParamList = {
  Authentication: undefined;
  Login: undefined;
  Example: undefined;
  Home: undefined;
  WelcomeBoss: undefined;
  Tabs: undefined;
  ReminderPage: { capacity: number } | undefined;
  CreateMeeting: { capacity: number } | undefined;
  Contact: { openModal: boolean; scheduleId: string; type: string } | undefined;
  UserProfile: undefined;
  SignUpIntroSlider: undefined;
  SignUp: { name: string; lastName: string; mail: string; id: string | undefined } | undefined;
  ForgotPassword: undefined;
  MeetingRequestReceived: { refecth: boolean } | undefined;
  Customization: undefined;
  ViewMail: IViewMailProps;
  ReschedulingModal: undefined;
  CalendarComponent: undefined;
  AgendaOption: undefined;
  DetailEvent: EventSelectedProps;
  ReschedulingCalendar: IDataPropsResheduling;
  EventMirror: { eventId: string; eventType: string; niveau: string };
  UserModeScreen: undefined;
  SubExpired: undefined;
  OnlineBooking: undefined;
  TaskManagerScreen: undefined;

};

export type AuthenticationScreenNavigationProps = StackScreenProps<
  RootStackParamList,
  'Authentication'
>;

export type EventMirrorScreenNavigationProps = StackScreenProps<RootStackParamList, 'EventMirror'>;

export type LoginScreenNavigationProps = StackScreenProps<RootStackParamList, 'Login'>;

export type HomeScreenNavigationProps = StackScreenProps<RootStackParamList, 'Home'>;

export type WelcomeBossScreenNavigationProps = StackScreenProps<RootStackParamList, 'WelcomeBoss'>;

export type TabsScreenNavigationProps = StackScreenProps<RootStackParamList, 'Tabs'>;

export type ReminderNavigationProps = StackScreenProps<RootStackParamList, 'ReminderPage'>;

export type CreateMeetingNavigationProps = StackScreenProps<RootStackParamList, 'CreateMeeting'>;

export type ContactNavigationProps = StackScreenProps<RootStackParamList, 'Contact'>;

export type UserProfileNavigationProps = StackScreenProps<RootStackParamList, 'UserProfile'>;

export type ViewMailNavigationProps = StackScreenProps<RootStackParamList, 'ViewMail'>;

export type ReschedulingModalNavigationProps = StackScreenProps<
  RootStackParamList,
  'ReschedulingModal'
>;

export type ReschedulingCalendarNavigationProps = StackScreenProps<
  RootStackParamList,
  'ReschedulingCalendar'
>;

export type SignUpIntroSliderNavigationProps = StackScreenProps<
  RootStackParamList,
  'SignUpIntroSlider'
>;

export type SignUpNavigationProps = StackScreenProps<RootStackParamList, 'SignUp'>;

export type ForgotPasswordNavigationProps = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

export type MeetingRequestReceivedNavigationProps = StackScreenProps<
  RootStackParamList,
  'MeetingRequestReceived'
>;

export type CustomizationNavigationProps = StackScreenProps<RootStackParamList, 'Customization'>;

export type CalendarComponentProps = StackScreenProps<RootStackParamList, 'CalendarComponent'>;

export type AgendaOptionComponentProps = StackScreenProps<RootStackParamList, 'AgendaOption'>;

export type DetailEventComponentProps = StackScreenProps<RootStackParamList, 'DetailEvent'>;

export type UserModeScreeComponentProps = StackScreenProps<RootStackParamList, 'UserModeScreen'>;

export type SubExpiredComponentProps = StackScreenProps<RootStackParamList, 'SubExpired'>;

export type BookingNavigationProps = StackScreenProps<
    RootStackParamList,
    'OnlineBooking'
>;

export type TaskManagerScreeComponentProps = StackScreenProps<RootStackParamList, 'TaskManagerScreen'>;
