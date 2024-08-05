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
import { useMemoOnce } from '../../shared/hooks';
import { useWheelContract } from './hooks/useWheelContract';
import { MRT_Table, useMaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
import { segColors, segments, columns } from './constants';
import { isEmpty } from 'lodash';
import { fromNano } from 'ton-core';

export type WheelFortuneProps = {};

export const WheelFortune: FC<WheelFortuneProps> = () => {
  const [amount, setAmount] = useState('0.1');
  const {
    is_timer_started,
    last_winner,
    addresses,
    bets,
    sendDeposit,
    timer_end_date,
  } = useWheelContract();

  const memoizedTimerEndDate = useMemoOnce(timer_end_date);
  const [timer, setTimer] = useState<number | null>(null);
  const [readyToSpin, setReadyToSpin] = useState(false);
  const [winnerSegment, setWinnerSegment] = useState('');

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
        addressEl: (
          <p
            style={{
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {item}
          </p>
        ),
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

  useEffect(() => {
    const difTimer = dayjs(memoizedTimerEndDate).diff(dayjs());
    let intervalId: number;

    if (is_timer_started && difTimer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev && prev <= 0) {
            clearInterval(intervalId);
            setTimer(null);
            setReadyToSpin(true);
            setWinnerSegment('');
          }
          return dayjs(memoizedTimerEndDate).diff(dayjs());
        });
      }, 100);
    }
  }, [memoizedTimerEndDate, is_timer_started]);

  const handleChangeAmount: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      setAmount(target.value.toString());
    },
    []
  );
  const addressWinner = useMemo(
    () => data.find((item) => item.address === last_winner),
    [last_winner, data]
  );

  useEffect(() => {
    if (addressWinner && readyToSpin) {
      setReadyToSpin(false);
      setWinnerSegment(addressWinner.address);
      const canvasEl = document.getElementById('canvas');

      if (canvasEl) {
        canvasEl.click();
      }
    }
  }, [addressWinner]);

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
          {is_timer_started && timer && (
            <Styled.InputTitle>{`${Math.floor(timer / 1000 / 60)}:${Math.floor(
              (timer / 1000) % 60
            )
              .toString()
              .padStart(2, '0')}`}</Styled.InputTitle>
          )}
        </Styled.FlexContainer>
        <MRT_Table table={table} />
        {winnerSegment && (
          <Styled.FlexContainer direction='row' gap={8}>
            <Styled.InputTitle>Winner:</Styled.InputTitle>
            <Styled.InputTitle>{winnerSegment}</Styled.InputTitle>
          </Styled.FlexContainer>
        )}
        {!isEmpty(data) && (
          <Spinner
            segments={data.map((item) => item.name)}
            segColors={data.map((item) => item.color)}
            winningSegment={addressWinner?.name}
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
