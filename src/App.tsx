import {useCallback, useState} from "react";
import {invoke} from "@tauri-apps/api";

function App() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<unknown>();
  const sleep = async (ms: number) => {
    try {
      await invoke("sleep", {ms});
    } catch (e) {
      setError(e);
    }
  };
  const pingServer = async () => {
    try {
      setSuccess(false);
      setError(undefined);
      await invoke("ping", {server: "81.16.123.94:30011"});
      await sleep(30);
      setSuccess(true);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div className="bg-white w-screen h-screen flex flex-col justify-center items-center">
      <button
        type="button"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        onClick={pingServer}
      >
        Ping
      </button>
      <p>{success ? "Success" : error ? `Error: ${error}` : ""}</p>
    </div>
  );
}

export default App;
