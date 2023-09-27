import styled, { CSSProperties } from 'styled-components';
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';

const StatusWrapper = styled.div`
  position: absolute;
  top: 4px;
  left: 76px;
  color: #979CB5CC;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.typography.caption};

`;

const StatusText = styled.div`
  width: 100%;
  margin-left: 6px;
`;


type TagProps = {
  isSaving: boolean;
  style?: CSSProperties;
};

const StatusMessage = (props: TagProps) => {
  const { isSaving, style } = props;
  return (
    <StatusWrapper style={style}>
      {isSaving ?
        <>
          <HistoryToggleOffRoundedIcon />
          <StatusText>Saving...</StatusText>
        </>
        :
        <>
          <CheckCircleOutlineSharpIcon />
          <StatusText>Updated to the latest.</StatusText>
        </>
      }
    </StatusWrapper>
  );
};

export default StatusMessage;