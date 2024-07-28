import { useEffect, useState } from 'react';
import { Address, OpenedContract } from 'ton-core';
import { toNano } from 'ton-core';
import {
  useAsyncInitialize,
  useTonClient,
  useTonConnect,
} from '../../../shared/hooks';
import { MainContract } from '../contract';

export function useWheelContract() {
  const client = useTonClient();

  const { sender } = useTonConnect();
  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    is_timer_started: boolean;
    contributors_count: number;
    recent_sender: string;
    owner_address: string;
    timer_address: String;
    addresses: string;
    bets: string;
    total_sum: number;
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse('EQB-dYLdlRQFYL1NO-EpOU7SC61uQPlNhaFLY3MvfHCcLLnc')
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      var addressesString = 'null';
      if (val.addresses != null) {
        addressesString = val.addresses.toString();
      }
      var betsString = 'null';
      if (val.bets != null) {
        betsString = val.bets.toString();
      }
      setContractData({
        is_timer_started: val.is_timer_started,
        contributors_count: val.number,
        recent_sender: val.recent_sender.toString(),
        owner_address: val.owner_address.toString(),
        timer_address: val.timer_address.toString(),
        addresses: addressesString,
        bets: betsString,
        total_sum: val.total_sum,
      });
      const { balance } = await mainContract.getBalance();
      setBalance(balance);
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    is_timer_started: contractData?.is_timer_started,
    contributors_count: contractData?.contributors_count,
    recent_sender: contractData?.recent_sender,
    owner_address: contractData?.owner_address,
    timer_address: contractData?.timer_address,
    addresses: contractData?.addresses,
    bets: contractData?.bets,
    total_sum: contractData?.total_sum,
    sendNewOwnerAddress: (ownerAddress: string) => {
      return mainContract?.sendNewOwnerAddress(
        sender,
        toNano('0.05'),
        Address.parse(ownerAddress)
      );
    },
    sendNewTimerAddress: (timerAddress: string) => {
      return mainContract?.sendNewTimerAddress(
        sender,
        toNano('0.05'),
        Address.parse(timerAddress)
      );
    },
    sendDeposit: (amount?: string) => {
      return mainContract?.sendDeposit(sender, toNano(amount ?? 0.1));
    },
    sendFinishGameRequest: () => {
      return mainContract?.sendFinishGameRequest(sender, toNano('0.06'));
    },
  };
}
