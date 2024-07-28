import { ChangeEventHandler, FC, useCallback, useMemo, useState } from 'react';
import { Styled } from './styles';
import { Auth, Spinner } from '../../components';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTonConnect } from '../../shared/hooks';
import { useWheelContract } from './hooks/useWheelContract';
import WebApp from '@twa-dev/sdk';
import {
  MRT_Table, //import alternative sub-component if we do not want toolbars
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';

const columns: MRT_ColumnDef<{
  index: number;
  address: string;
  amount: string;
}>[] = [
  {
    accessorKey: 'index', //access nested data with dot notation
    header: 'Index',
    size: 30,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 150,
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
    recent_sender,
    owner_address,
    timer_address,
    addresses,
    bets,
    total_sum,
    sendNewOwnerAddress,
    sendNewTimerAddress,
    sendDeposit,
    sendFinishGameRequest,
  } = useWheelContract();

  // console.log('useMainContract()', useWheelContract());

  const { connected } = useTonConnect();

  const showAlert = () => {
    WebApp.showAlert('Hey there!');
  };

  const segments = ['Happy', 'Angry', 'Sad', 'Frustration', 'Emptyness'];
  const segColors = [
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000',
  ];
  const onFinished = (winner: string) => {
    console.log(winner);
  };

  const participants = useMemo(() => {
    const data = addresses?.split('\n') ?? [];
    if (addresses !== 'null' && data?.length === 1) {
      return data;
    }

    return addresses?.split('\n').slice(1, addresses.length) ?? [];
  }, [addresses]);

  const amounts = useMemo(() => {
    return bets?.split('\n').slice(1, bets.length) ?? [];
  }, [bets]);

  const table = useMaterialReactTable({
    columns,
    data: participants.map((item, i) => ({
      index: i,
      address: item,
      amount: amounts[i],
    })), //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
    // renderCaption: ({ table }) =>
    //   `Here is a table rendered with the lighter weight MRT_Table sub-component, rendering ${
    //     table.getRowModel().rows.length
    //   } rows.`,
  });

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
        <MRT_Table table={table} />
        <Spinner
          segments={segments}
          segColors={segColors}
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
      </Styled.Content>
    </Styled.Container>
  );
};
