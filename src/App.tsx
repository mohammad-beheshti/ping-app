import { Button, Center, Space, Text } from '@mantine/core';
import { useState } from 'react';
import { DropCsv } from './components/DropCsv';
import { useLocalStorage } from '@mantine/hooks';
import IPing from './types/IPing';
import { parseCSV } from './utils/parseCsv';
import { PingTable } from './components/PingTable';

export default function App() {
  const [data, setData] = useLocalStorage<IPing[]>(
    {
      key: 'ping-data',
      defaultValue: [],
    },
  );
  const [error, setError] = useState<Error | null>(null);
  const onDrop = async (files: File[]) => {
    try {
      setError(null);
      setData((await parseCSV(files[0])).sort((a, b) => a.sequence - b.sequence));
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
        return;
      }
      setError(new Error('Error while parsing CSV'));
    }
  };
  const onClear = () => {
    setData([]);
  };

  if (!data.length)
    return (
      <Center style={{ flexDirection: 'column', height: '100%' }}>
        <DropCsv
          mb='xs'
          onDrop={onDrop}
          onReject={() => setError(new Error('Some files were rejected'))}
        />
        {error && (
          <Text size='md' weight='bolder' color='red'>
            {error.message}
          </Text>
        )}
      </Center>
    );
  return (
    <Center style={{ flexDirection: 'column', height: '100%', padding: '2rem' }}>
      <PingTable data={data} />
      <Space my='sm' />
      <Button onClick={onClear}>Clear</Button>
    </Center>
  );
}

