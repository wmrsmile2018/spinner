import { useEffect, useState } from 'react';
import { TimerContract } from '../contracts/TimerContract';
import { Address, OpenedContract } from 'ton-core';
import { toNano } from 'ton-core';
import {
  useAsyncInitialize,
  useTonClient,
  useTonConnect,
} from '../../../shared/hooks';

export function useTimerContract() {
  const client = useTonClient();

  const { sender } = useTonConnect();
  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    schedule: string;
    timerOwner: string;
    timerCaller: string;
    furthest_schedule: string;
    timer_bounce_address: string;
  }>();

  //   const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new TimerContract(
      Address.parse('EQDtJqDPxPpkNzh7BshU59_fDf_OTIBvRVovZanFAj-J9LS-')
    );
    return client.open(contract) as OpenedContract<TimerContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      var scheduleString = 'null';
      if (val.schedule != null) {
        scheduleString = val.schedule.toString();
      }
      setContractData({
        schedule: scheduleString,
        timerOwner: val.owner.toString(),
        timerCaller: val.caller.toString(),
        furthest_schedule: new Date(val.furthest_schedule * 1000).toString(),
        timer_bounce_address: val.timer_bounce_address.toString(),
      });
      //   const { balance } = await mainContract.getBalance();
      //   setBalance(balance);
      await sleep(10000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    schedule: contractData?.schedule,
    timerOwner: contractData?.timerOwner,
    timerCaller: contractData?.timerCaller,
    furthest_schedule: contractData?.furthest_schedule,
    timer_bounce_address: contractData?.timer_bounce_address,
    sendNewTimerOwnerAddress: (ownerAddress: string) => {
      return mainContract?.sendNewOwnerAddress(
        sender,
        toNano('0.05'),
        Address.parse(ownerAddress)
      );
    },
    sendNewTimerCallerAddress: (callerAddress: string) => {
      return mainContract?.sendNewCallerAddress(
        sender,
        toNano('0.05'),
        Address.parse(callerAddress)
      );
    },
    sendScheduleTimer: () => {
      return mainContract?.sendScheduleTimer(sender, toNano('0.05'));
    },
  };
}
