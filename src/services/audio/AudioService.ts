import { requestRecordingPermissionsAsync, setAudioModeAsync } from "expo-audio";

export class AudioService {
  async requestPermission(): Promise<boolean> {
    const permission = await requestRecordingPermissionsAsync();
    return permission.granted;
  }

  async prepareSession(): Promise<void> {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }

  async endSession(): Promise<void> {
    await setAudioModeAsync({ allowsRecording: false });
  }
}

export const audioService = new AudioService();
