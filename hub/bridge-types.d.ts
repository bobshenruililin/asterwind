/** Local, reviewed media only. Video is optional and must remain silent. */
export type StillBridge = { kind: 'still'; src: string; mime: 'image/webp' | 'image/png' | 'image/jpeg' };
export type VideoBridge = {
  kind: 'video'; src: string; mime: 'video/mp4' | 'video/webm'; audio: 'silent';
  stallTimeoutMs: number; maxPlaybackMs: number;
};
export interface BridgeManifest { schemaVersion: 1; transition: StillBridge | VideoBridge; fallback: StillBridge }
export interface BridgeResult { reason: 'ended' | 'still' | 'reduced-motion' | 'invalid' | 'play-rejected' | 'error' | 'stalled' | 'timeout' }
