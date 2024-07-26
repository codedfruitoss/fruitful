import { atom } from 'jotai';

const lablesListAtom = atom([
  { name: 'Personal', color: '#1f3d5e' },
  { name: 'Office', color: '#1f3d5e' },
  { name: 'Default', color: '#f477e4' },
]);
const selectedLabelAtom = atom<{ name: string; color: string }>({
  name: 'Default',
  color: '#f477e4',
});

export { lablesListAtom, selectedLabelAtom };
