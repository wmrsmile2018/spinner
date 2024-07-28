import { getHttpEndpoint } from '@orbs-network/ton-access';
import { useEffect, useState } from 'react';
import { TonClient } from 'ton';

export function useTonClient() {
  const [client, setClient] = useState<TonClient>();

  useEffect(() => {
    (async () => {
      const client = new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      });

      setClient(client);
    })();
  }, []);

  return client;
}
