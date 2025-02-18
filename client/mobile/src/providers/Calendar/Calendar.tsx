import React, { createContext, FC } from 'react';
import { useState } from 'react';

type dataType = '3days' | 'week' | 'day' | 'custom' | 'month';

export interface AgendaInterface {
  calendarMode: dataType;
  setCalendarMode: React.Dispatch<React.SetStateAction<dataType>>;
}

export const CalendarModeContext = createContext<AgendaInterface>({
  calendarMode: '3days',
  setCalendarMode: () => {},
});

export const CalendarProvider: FC = ({ children }) => {
  const [calendarMode, setCalendarMode] = useState<dataType>('3days');
  return (
    <CalendarModeContext.Provider value={{ calendarMode, setCalendarMode }}>
      {children}
    </CalendarModeContext.Provider>
  );
};
