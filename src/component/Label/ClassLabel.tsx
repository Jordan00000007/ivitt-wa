import styled, { CSSProperties } from 'styled-components';
import { OverflowHide } from '../../pages/pageStyle';




const Label = styled.div<{ color: string }>`
  min-width: 200px;
  min-height: 40px;
  border: 2px solid ${(props) => (props.color ? props.color : props.theme.color.vivid_1)};
  border-radius: 9px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 10px;
  font-size: ${(props) => props.theme.typography.body1};
  color: ${props => props.theme.color.onColor_1};
  font-weight: 500;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height:100%;
    background-color: ${(props) => (props.color ? props.color : props.theme.color.vivid_1)};
  } 
`;


const LabelText = styled(OverflowHide)`
  margin-left: 6px;
`;


type TagProps = {
  text: string;
  value: string | number;
  color: string;
  style?: CSSProperties;
};

const ClassLabel = (props: TagProps) => {
  const { text, value, color, style } = props;
  return (
    <Label color={color} style={style}>
      <LabelText>{text}</LabelText>
      <LabelText>{value}</LabelText>
    </Label>
  );
};

export default ClassLabel;