import { Button, Space, Table, Tooltip } from '@mantine/core';
import type IPing from '../types/IPing';
import { pingServer } from '../rust-calls/ping';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { IconBroadcast, IconBroadcastOff } from '@tabler/icons';

function ActionCol({
                     server: {
                       ip,
                       port,
                       waitInMs,
                     },
                     currentlyPinging,
                     onComplete,
                   }: { server: IPing, currentlyPinging?: boolean, onComplete?: () => void }) {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  async function onPing() {
    setError(null);
    setPingResult(null);
    setIsPinging(true);
    try {
      const result = await pingServer(ip + ':' + port, waitInMs);
      setPingResult(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      }
      setError(new Error('Error while pinging'));
    }
    setIsPinging(false);
  }

  useEffect(() => {
    if (currentlyPinging) {
      onPing().then(() => {
        onComplete?.();
      });
    }
  }, [currentlyPinging]);

  return (
    <>
      <td>
        <Tooltip color={error ? 'red' : 'blue'} closeDelay={500}
                 label={error?.message || (isPinging && 'Pinging') || 'Ping'}>
          <Button
            type='button'
            color={error ? 'red' : 'primary'}
            onClick={onPing}
            disabled={isPinging}
          >
            {error ? <IconBroadcastOff /> : isPinging ? <Spinner /> : <IconBroadcast />}
          </Button>
        </Tooltip>
      </td>
      <td>{pingResult}</td>
    </>
  );
}


export function PingTable({ data }: { data: IPing[] }) {
  const [currentlyPinging, setCurrentlyPinging] = useState<number | null>(null);
  const [pingingAll, setPingingAll] = useState(false);

  const rows = data.map((server, idx) => (
    <tr key={idx}>
      <td>{server.sequence}</td>
      <td>{server.ip}</td>
      <td>{server.port}</td>
      <td>{server.waitInMs}</td>
      <ActionCol
        currentlyPinging={idx === currentlyPinging}
        onComplete={pingingAll ? () => setCurrentlyPinging(idx + 1) : undefined}
        server={server}
      />
    </tr>
  ));

  useEffect(() => {
    if (currentlyPinging === null) {
      setPingingAll(false);
    } else if (currentlyPinging === data.length) {
      setPingingAll(false);
      setCurrentlyPinging(null);
    } else {
      setPingingAll(true);
    }
  }, [currentlyPinging]);

  const pingAll = () => {
    setCurrentlyPinging(0);
    setPingingAll(true);
  };


  return (
    <>
      <Table>
        <thead>
        <tr>
          <th>Sequence</th>
          <th>IP</th>
          <th>Port</th>
          <th>Wait in Ms</th>
          <th>Action</th>
          <th>Result</th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Space my='sm' />
      <Button disabled={pingingAll} color='orange' size='xl' p='md' onClick={pingAll}>Ping All</Button>
    </>
  );
}