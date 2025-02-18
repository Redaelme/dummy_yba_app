import React, { createContext, useContext } from 'react';
import {useNotifications} from "../../hooks/useNotifications";

// Interface to represent the result of requesting notification permissions
interface NotificationPermissionResult {
    status: 'granted' | 'denied' | 'blocked';
    token?: string;
}
// Define the shape of the notification context
interface NotificationContextType {
    requestPermissions: () => Promise<NotificationPermissionResult>;
    handleTokenUpdate: (token: string) => Promise<void>;
    openNotificationSettings: () => Promise<void>;
    isInitialized: boolean;
}

// Create a context with an undefined initial value
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider component to wrap the app and provide notification context.
 * @param children - The child components that will have access to the notification context.
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const notificationService = useNotifications();

    return (
        <NotificationContext.Provider value={notificationService}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Custom hook to access the notification context.
 * Ensures the hook is used within a NotificationProvider.
 */
export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};
