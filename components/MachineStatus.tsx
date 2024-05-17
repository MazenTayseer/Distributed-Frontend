import "@styles/machines-loader.css";
import { useState, useEffect } from "react";
import config from "@config";

type MachineStatusProps = {
  host: string;
};

const MachineStatus = ({ host }: MachineStatusProps) => {
  const [status, setstatus] = useState("loading");

  const getStatus = async () => {
    try {
      setstatus("loading");
      const response = await fetch(`${config.apiUrl}/check_ssh/${host}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }

      const data = await response.json();
      setstatus(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = () => {
    getStatus();
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <div className='block w-full p-6 bg-main border border-gray-200 rounded-lg shadow text-center'>
      <h5 className='mb-6 text-2xl font-bold tracking-tight'>{host}</h5>
      {status === "loading" ? (
        <p className='text-gray-700 text-xl font-semibold'>
          <span className='loader'></span>
        </p>
      ) : status === "Successful" ? (
        <p className='text-green-600 text-xl font-semibold'>Machine is On</p>
      ) : (
        <p className='text-red-600 text-xl font-semibold'>Machine is Off</p>
      )}
      <button
        className='bg-black text-white p-2 rounded-lg shadow font-semibold mt-3'
        onClick={handleRefresh}
      >
        Refresh
      </button>
    </div>
  );
};

export default MachineStatus;
