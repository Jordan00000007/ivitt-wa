import { styled } from "@mui/material/styles";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 6,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#E0E1E6"
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#57B8FF"
  }
}));

type ProgressBarProps = {
  value: number;
};

const ProgressBar = (props: ProgressBarProps) => {
  const { value } = props;

  return (
    <BorderLinearProgress variant="determinate" value={value} />
  );
}




export default ProgressBar;