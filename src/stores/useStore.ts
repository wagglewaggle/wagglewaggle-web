import { createContext, useContext } from 'react';
import { RootStore } from 'stores';

const CreateStore = createContext<null | { MobxStore: RootStore }>(null);
export const useStore = () => useContext(CreateStore) as { MobxStore: RootStore };
export default CreateStore;
