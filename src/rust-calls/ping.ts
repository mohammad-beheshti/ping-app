import {invoke} from "@tauri-apps/api";
import sleep from "./sleep";

export const pingServer = async (server: string, ttl?: number) => {
  await invoke("ping", {server});
  ttl && (await sleep(ttl));
};
