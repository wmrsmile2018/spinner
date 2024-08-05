import { MRT_ColumnDef } from 'material-react-table';

export const segments = [
  'addax',
  'goat',
  'guinea pig',
  'jackal',
  'beaver',
  'boar',
  'lemur',
  'capybara',
  'ape',
  'mare',
  'salamander',
  'stallion',
  'bumble bee',
  'whale',
  'starfish',
  'mink',
  'yak',
  'lynx',
  'lovebird',
  'ewe',
];
export const segColors = [
  '#EE4040',
  '#F0CF50',
  '#815CD1',
  '#3DA5E0',
  '#34A24F',
  '#F9AA1F',
  '#EC3F3F',
  '#FF9000',
  '#d2d68f',
  '#94fe1d',
  '#c96ddf',
  '#bdf4d8',
  '#2f2a5b',
  '#1a9dc6',
  '#f75d0e',
  '#2c92e8',
  '#d95bf3',
  '#5cf87a',
  '#8cd0f2',
  '#4f0d73',
  '#8fc120',
];

export const columns: MRT_ColumnDef<{
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
    accessorKey: 'addressEl',
    header: 'Address',
    size: 100,
  },
  {
    accessorKey: 'amount', //normal accessorKey
    header: 'Amount',
    size: 50,
  },
];
