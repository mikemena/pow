import { Program } from '../types/programTypes';

export type RootStackParamList = {
  Programs: undefined;
  ProgramsList: { refetchPrograms?: boolean };
  ProgramDetails: { program: Program };
  CreateProgram: undefined;
  EditProgram: { program: Program };
  ExerciseSelection: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}