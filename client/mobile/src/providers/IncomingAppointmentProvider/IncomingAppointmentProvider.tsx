import React, {createContext, FC, useState} from 'react';

interface IncomingAppointment {
  id: string;
  typeMail: string;
  location: string;
  sender: string;
  recipients: string;
  object: string;
  senderFullName: string;
  contents: string;
  dateEntity: string;
  userId: string;
  appointmentStatus: string;
  appointmentUserAction: string;
  htmlBody: string;
  sheduleId: string;
  schedulePriority: string;
  messageId: string;
  lang: string;
}

interface IncomingAppointmentPropsType {
  incomingRequestData: IncomingAppointment[];
  setIncomingRequestData: (incomingRequestData: IncomingAppointment[]) => void;
}

export const IncomingAppointmentContext = createContext<IncomingAppointmentPropsType>({
  incomingRequestData: [],
  setIncomingRequestData: () => {},
});

interface IncomingAppointmentProps {}

const IncomingAppointmentProvider: FC<IncomingAppointmentProps> = (props) => {
  const [incomingRequestData, setIncomingRequestData] = useState<IncomingAppointment[]>([]);
  return (
      <IncomingAppointmentContext.Provider
          value={{
            incomingRequestData,
            setIncomingRequestData
          }}
      >
        {props.children}
      </IncomingAppointmentContext.Provider>
  );
};

export default IncomingAppointmentProvider;
