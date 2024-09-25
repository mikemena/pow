import { Program } from '../types/programTypes';

export type RootStackParamList = {
  Programs: undefined;
  ProgramsList: undefined;
  ProgramDetails: { program: Program };
  CreateProgram: undefined;
  EditProgram: { program: Program };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
