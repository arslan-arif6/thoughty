import { RecordingPresets, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { audioService } from "./AudioService";

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const state = useAudioRecorderState(recorder);

  const start = async () => {
    const granted = await audioService.requestPermission();
    if (!granted) throw new Error("Microphone permission denied");
    await audioService.prepareSession();
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stop = async () => {
    await recorder.stop();
    await audioService.endSession();
    return recorder.uri;
  };

  return { start, stop, recording: state.isRecording };
}
