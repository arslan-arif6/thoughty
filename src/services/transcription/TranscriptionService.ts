export interface TranscriptionService {
  transcribe(audioUri: string): Promise<string | null>;
}

export class UnavailableTranscriptionService implements TranscriptionService {
  async transcribe(_audioUri: string): Promise<string | null> {
    return null;
  }
}

export const transcriptionService = new UnavailableTranscriptionService();
