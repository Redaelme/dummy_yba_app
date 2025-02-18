import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useEffect } from 'react';

export const ForegoundLink = () => {
  const handleDynamicLink = (link: { url: string }) => {
    // Handle dynamic link inside your own application
    if (link.url === 'https://invertase.io/offer') {
      // ...navigate to your offers screen
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  return null;
};
