export interface StepScreenProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setswipeScroll?: React.Dispatch<React.SetStateAction<boolean>>;
}
