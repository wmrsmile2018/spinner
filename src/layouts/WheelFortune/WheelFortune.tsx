import {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Styled } from './styles';
import { Auth, Spinner } from '../../components';
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react';
import { useMemoOnce } from '../../shared/hooks';
import { useWheelContract } from './hooks/useWheelContract';
import {
  MRT_Table, //import alternative sub-component if we do not want toolbars
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import dayjs from 'dayjs';
import { segColors, segments } from './constants';
import { isEmpty } from 'lodash';
import { fromNano } from 'ton-core';

const columns: MRT_ColumnDef<{
  index: number;
  address: string;
  amount: string;
}>[] = [
  {
    accessorKey: 'colorSeg', //normal accessorKey
    header: 'color',
    size: 20,
  },
  {
    accessorKey: 'name', //normal accessorKey
    header: 'name',
    size: 50,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 100,
  },
  {
    accessorKey: 'amount', //normal accessorKey
    header: 'Amount',
    size: 50,
  },
];

export type WheelFortuneProps = {};

export const WheelFortune: FC<WheelFortuneProps> = () => {
  const [amount, setAmount] = useState('0.1');
  const [tonConnectUI] = useTonConnectUI();
  const {
    contract_address,
    contract_balance,
    is_timer_started,
    contributors_count,
    owner_address,
    timer_address,
    last_winner,
    addresses,
    bets,
    total_sum,
    sendNewOwnerAddress,
    sendNewTimerAddress,
    sendDeposit,
    sendFinishGameRequest,
    timer_end_date,
  } = useWheelContract();

  const wallet = useTonWallet();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);

  const memoizedTimerEndDate = useMemoOnce(timer_end_date);
  const [timer, setTimer] = useState<number | null>(null);
  const [winnerSegment, setWinnerSegment] = useState('');

  const onFinished = (winner: string) => {
    console.log(winner);
  };

  const participants = useMemo(() => {
    if (addresses === 'null') {
      return [];
    }

    return addresses?.trim().split(' ');
  }, [addresses]);

  const amounts = useMemo(() => {
    if (bets === 'null') {
      return [];
    }
    return (
      bets
        ?.trim()
        .split(' ')
        .map((amount) => fromNano(amount)) ?? []
    );
  }, [bets]);

  const data = useMemo(
    () =>
      (participants ?? []).map((item, i) => ({
        colorSeg: (
          <div style={{ background: segColors[i], width: 10, height: 10 }} />
        ),
        index: i,
        address: item,
        amount: amounts[i],
        name: segments[i],
        color: segColors[i],
      })),
    [participants, amount, segments, segColors]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    mrtTheme: () => ({
      baseBackgroundColor: '#5461d8', //change default background color
    }),
    muiTableBodyRowProps: { hover: false, color: '#fff' },
    muiTableProps: {
      sx: {
        fontSize: 10,
        color: '#fff',
        border: '1px solid #fff',
        caption: {
          captionSide: 'top',
        },
      },
    },

    muiTableHeadCellProps: {
      sx: {
        color: '#fff',
        border: '1px solid #fff',
        fontStyle: 'italic',
        fontWeight: 'normal',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        color: '#fff',
        border: '1px solid #fff',
      },
    },
  });

  // useEffect(() => {
  //   console.log('is_timer_started', { is_timer_started, memoizedTimerEndDate });
  // }, [is_timer_started, memoizedTimerEndDate]);

  useEffect(() => {
    console.log('memoizedTimerEndDate, is_timer_started', {
      memoizedTimerEndDate,
      is_timer_started,
    });

    const difTimer = dayjs(memoizedTimerEndDate).diff(dayjs());
    let intervalId: number;

    if (is_timer_started && difTimer > 0) {
      const startSpin = () => {
        const canvasEl = document.getElementById('canvas');

        if (canvasEl) {
          canvasEl.click();
        }
      };

      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev && prev <= 0) {
            clearInterval(intervalId);
            setTimer(null);
            startSpin();
          }
          return dayjs(memoizedTimerEndDate).diff(dayjs());
        });
      }, 10);
      // setTimeout(startSpin, difTimer);
    }
  }, [memoizedTimerEndDate, is_timer_started]);

  const handleChangeAmount: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      setAmount(target.value.toString());
    },
    []
  );

  return (
    <Styled.Container>
      <Styled.Header>
        <Auth />
      </Styled.Header>
      <Styled.Content>
        <Styled.FlexContainer direction='row' gap={8} alignitems='flex-end'>
          <Styled.Label>
            <Styled.InputTitle>Ton Deposite</Styled.InputTitle>
            <Styled.Input onChange={handleChangeAmount} />
          </Styled.Label>
          <Styled.Button onClick={() => sendDeposit(amount.toString())}>
            Submit
          </Styled.Button>
        </Styled.FlexContainer>
        <Styled.FlexContainer direction='row' gap={8} alignitems='flex-end'>
          <Styled.InputTitle>Time until start:</Styled.InputTitle>
          {memoizedTimerEndDate && timer && (
            <Styled.InputTitle>{`${Math.floor(timer / 1000 / 60)}:${Math.floor(
              (timer / 1000) % 60
            )
              .toString()
              .padStart(2, '0')}`}</Styled.InputTitle>
          )}
        </Styled.FlexContainer>
        <MRT_Table table={table} />
        {!isEmpty(data) && (
          <Spinner
            segments={data.map((item) => item.name)}
            segColors={data.map((item) => item.color)}
            winningSegment='Angry'
            onFinished={(winner) => onFinished(winner)}
            primaryColor='white'
            primaryColoraround='#ffffffb4'
            contrastColor='white'
            isOnlyOnce={false}
            size={190}
            upDuration={700}
            downDuration={900}
          />
        )}
      </Styled.Content>
    </Styled.Container>
  );
};
