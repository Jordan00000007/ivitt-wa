import styled, { CSSProperties } from 'styled-components';
import { OverflowHide } from '../../pages/pageStyle';


const Label = styled.div`
  min-width: 200px;
  min-height: 40px;
  border-bottom: 2px solid  ${props => props.theme.color.divider};
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 10px;
  font-size: ${(props) => props.theme.typography.body1};
  color: ${props => props.theme.color.onColor_1};
  font-weight: 500;
`;


const TextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const LabelColor = styled.div<{ color: string }>`
  min-width: 20px;
  min-height: 20px;
  border-radius: 6px;
  margin-right: 10px;
  background-color: ${(props) => (props.color ? props.color : props.theme.color.base_3)};
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

const AnnotationLabel = (props: TagProps) => {
  const { text, value, color, style } = props;

  return (
    <Label style={style}>
      <LabelColor color={color} />
      <TextContainer>
        <LabelText>{text}</LabelText>
        <LabelText style={{ fontWeight: 'bolder' }}>{value}</LabelText>
      </TextContainer>
    </Label>
  );
};

export default AnnotationLabel;