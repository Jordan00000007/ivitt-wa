import styled from 'styled-components';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';



const IconConvert = ({ title }: { title: string }) => {
  const name = title;
  if (name === 'Precision') return (<TaskAltIcon style={{ color: '#16272E', fontSize: '28px' }} />);
  if (name === 'Recall') return (<OutlinedFlagRoundedIcon style={{ color: '#16272E', fontSize: '28px' }} />);
  else return (<InsightsOutlinedIcon style={{ color: '#16272E', fontSize: '28px' }} />);
}

const Card = styled.div`
  width: 218px;
  height: 140px;
  background-color: ${props => props.theme.color.base_2};
  border: 1px solid ${props => props.theme.color.divider};
  border-radius: 12px;
  padding: 16px 20px; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-family: 'Roboto', sans-serif;
`;


const DataCardTitle = styled.div`
  display: flex;
  justify-content: space-between;
  height: 20px;
  font-weight: 500;
  font-size: ${props => props.theme.typography.body2};
  color: ${props => props.theme.color.onColor_2};
`;

const Data = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 60px;
  height: 43px;
  font-size: ${props => props.theme.typography.h1};
  color: ${props => props.theme.color.onColor_1};
  font-weight: 500;
`;

const BarBackground = styled.div<{ barColor: string, value: number }>`
  display: flex;
  justify-content: flex-start;
  width: 178px;
  height: 12px;
  border-radius: 100px;
  background-color: ${props => props.theme.color[props.barColor]}36;
  margin-top: 19px;
  position: relative;

  &::before {
    content: '';
    border-radius: 100px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: calc(${props => props.value} * 1.78px);
    height: 11.5px;
    background-color: ${props => props.theme.color[props.barColor]};
  }
`;


type DataCardProps = {
  title: string;
  value: number;
  barColor: string;
};

const ModelCard = (props: DataCardProps) => {

  const { title, value, barColor } = props;
  return (
    <>
      <Card>
        <DataCardTitle>{title}
          <IconConvert title={title} />
        </DataCardTitle>
        <Data>{value}%</Data>
        <BarBackground barColor={barColor} value={value} />
      </Card>
    </>
  );
};

export default ModelCard;
