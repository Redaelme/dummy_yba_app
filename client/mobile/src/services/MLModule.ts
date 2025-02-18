import { NativeModules } from 'react-native';
const { MLModule } = NativeModules;

interface MlModuleInterface {
  loadModel: (modelPath?: string) => void;

  classify: (text: string) => void;
  onStop: () => void;
  createCalendarEvent: (name: string, location: string) => void;
}

export default MLModule as MlModuleInterface;
