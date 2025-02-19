export const getAudioUrl = (address: string, emotionId: string) => {
  return `https://firebasestorage.googleapis.com/v0/b/nusic-ai-agent.firebasestorage.app/o/${encodeURIComponent(
    `user-voice-samples/${address}/${emotionId}.mp3`
  )}?alt=media`;
};
