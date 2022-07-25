import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useServersControllerFindAll} from "../queries/apiComponents";
import {pingServer} from "../rust-calls/ping";
const Home = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const {
    data: servers,
    isLoading,
    error: serversFetchError,
  } = useServersControllerFindAll(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    {
      retry: false,
      onError: (error) => {
        if (error.status === 401) {
          navigate("/login");
        }
      },
    },
  );
  const [isPinging, setIsPinging] = useState(false);
  const [pingError, setPingError] = useState<unknown>();
  const pingAllServers = async () => {
    setIsPinging(true);
    if (!servers) {
      return;
    }
    try {
      for (const server of servers) {
        await pingServer(server.ip + ":" + server.port, server.waitInMs);
      }
    } catch (e) {
      setPingError(e);
    }
    setIsPinging(false);
  };

  if (!accessToken) {
    navigate("/login");
  }

  if (serversFetchError || pingError) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-red-500 font-bold text-white text-3xl">
        {`Encountered an error while ${
          serversFetchError && "fetching servers"
        }${pingError && "pinging servers"}`}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-blue-500 font-bold text-white text-3xl">
        Loading...
      </div>
    );
  }

  if (isPinging) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-yellow-500 font-bold text-white text-3xl">
        Pinging...
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 justify-center items-center h-screen w-screen bg-purple-600 ">
      <h1 className="font-bold text-4xl text-white">Ready</h1>
      <button
        type="button"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={pingAllServers}
      >
        Ping
      </button>
      <button
        type="button"
        className="text-white text-xs"
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
