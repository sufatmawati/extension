// import { createInscription } from '@leather-wallet/models';
import { type InscriptionResponseHiro, createInscriptionHiro } from '@leather-wallet/query';

export const mockInscriptionResponse1: InscriptionResponseHiro = {
  address: 'bc1pwrmewwprc8k8l2k63x4advg0nx0jk50xzqnee996lm87mcuza7kq6drg2k',
  // addressIndex: 0,
  content_length: 55,
  content_type: 'image/png',
  curse_type: '',
  genesis_address: '',
  genesis_block_hash: '',
  genesis_block_height: 0,
  genesis_fee: '11130',
  genesis_timestamp: 0,
  genesis_tx_id: '',
  id: 'ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202i0',
  location: 'ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202:0:0',
  mime_type: '',
  number: 10875335,
  offset: '200',
  output: '/output/ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202:0',
  recursive: false,
  recursion_refs: '',
  sat_coinbase_height: 0,
  sat_ordinal: '',
  sat_rarity: '',
  timestamp: 1696185309000,
  tx_id: '5c3206e2d7655758e4db05a251571bbc902db7e5c1a1e6f99ca7d6e71bde450b',
  value: '10000',
};

export const mockInscription1 = createInscriptionHiro(mockInscriptionResponse1);

export const mockInscriptionResponse2: InscriptionResponseHiro = {
  address: 'bc1pwrmewwprc8k8l2k63x4advg0nx0jk50xzqnee996lm87mcuza7kq6drg2k',
  // addressIndex: 0,
  content_length: 55,
  content_type: 'image/png',
  curse_type: '',
  genesis_address: '',
  genesis_block_hash: '',
  genesis_block_height: 0,
  genesis_fee: '11130',
  genesis_timestamp: 0,
  genesis_tx_id: '',
  id: 'ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202i0',
  location: 'ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202:0:0',
  mime_type: '',
  number: 10875335,
  offset: '600',
  output: '/output/ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202:0',
  recursive: false,
  recursion_refs: '',
  sat_coinbase_height: 0,
  sat_ordinal: '',
  sat_rarity: '',
  timestamp: 1696185309000,
  tx_id: '42e90f6c10331d9409225015875decd1793406b3b7ee8f9d17b0abc8c4080c98',
  value: '10000',
};

export const mockInscription2 = createInscriptionHiro(mockInscriptionResponse2);

export const mockInscriptionResponsesList = [
  {
    address: 'bc1q530dz4h80kwlzywlhx2qn0k6vdtftd93c499yq',
    id: 'a5ab63799f0bbd2571d1b90de9ebff815f7526787e27263d2f604e22f9118d0ci0',
    content_length: 55,
    content_type: 'text/plain;charset=utf-8',
    curse_type: null,
    genesis_address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
    genesis_block_hash: '00000000000000000003fb85f8ae82f194786416cf699961b04d2953fbbd63d4',
    genesis_block_height: 792337,
    genesis_fee: '5738',
    genesis_timestamp: 1685595657000,
    genesis_tx_id: 'a5ab63799f0bbd2571d1b90de9ebff815f7526787e27263d2f604e22f9118d0c',
    location: '58d44000884f0ba4cdcbeb1ac082e6c802d300c16b0d3251738e8cf6a57397ce:0:0',
    mime_type: 'text/plain',
    number: 10371348,
    offset: '0',
    output: '58d44000884f0ba4cdcbeb1ac082e6c802d300c16b0d3251738e8cf6a57397ce:0',
    recursive: false,
    recursion_refs: null,
    sat_coinbase_height: 287150,
    sat_ordinal: '1242877032342951',
    sat_rarity: 'common',
    timestamp: 1696185309000,
    tx_id: '58d44000884f0ba4cdcbeb1ac082e6c802d300c16b0d3251738e8cf6a57397ce',
    value: '546',
  },
];
export const mockInscriptionsList = mockInscriptionResponsesList.map(createInscriptionHiro);
