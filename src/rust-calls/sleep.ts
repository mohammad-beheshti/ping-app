import {invoke} from "@tauri-apps/api";

export default async function sleep(ms: number): Promise<void> {
  await invoke("sleep", {ms});
}
