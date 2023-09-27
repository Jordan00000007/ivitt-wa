import { ReactNode, HTMLAttributes, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { OverflowHide } from '../../pages/pageStyle';
import { convertUnit } from '../../utils/utils';
import StyledTooltip from '../Tooltip';


const Card = styled.button<{ active: boolean, isSlider: boolean }>`
  width: 153px !important;
  height: 60px;
  box-shadow: 0px 0px 4px #CACBD733;
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.h5};
  color: ${(props) => (props.active ? props.theme.color.onColor_1 : props.theme.color.onColor_2)};
  background-color: ${(props) => (props.active ? props.theme.color.base_2 : props.theme.color.base_2)};
  border: 2px solid ${(props) => (props.active ? props.theme.color.highlight_1 : props.theme.color.divider)};
  border-radius: 12px;
  margin-bottom: 8px;
  margin-right: ${(props) => (props.isSlider ? '0' : '8px')};

  &:hover{
    border: 2px solid ${(props) => (props.theme.color.highlight_1)};
    border-radius: 12px;
    box-shadow: 2px 2px 8px #00000021;
    color:${(props) => props.theme.color.onColor_1}
  }

  &:disabled{
    cursor: not-allowed;
  }
`;

const Wrap = styled.div`
 display: flex;
 justify-content: space-between;
 padding: 0 8px;
`;

const CardTitle = styled(OverflowHide)`
  font-size: ${(props) => props.theme.typography.h5};
  width: 70px;
`;

const Value = styled(OverflowHide)`
  padding-left: 6px;
`;


type DatasetSelectBtnProps = {
  text: string;
  number: number;
  active: boolean;
  isSlider: boolean;
  activeClassName: string;
  children?: ReactNode;
  disabled?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const DatasetSelectBtn = (props: DatasetSelectBtnProps) => {
  const { activeClassName, text, number, disabled, active, isSlider, children, ...restProps } = props;
  const textRef = useRef<any | null>(null);

  const isOverflowActive = useCallback((event: HTMLDivElement | null) => {
    if (event) {
      if (event.offsetWidth < event.scrollWidth) return true;
      else return false;
    }
  }, []);



  return (
    <Card active={active} isSlider={isSlider} disabled={disabled} {...restProps}>
      <Wrap>
        <StyledTooltip place='top' title={isOverflowActive(textRef.current) ? text : ''}>
          <CardTitle ref={textRef}>{text}</CardTitle>
        </StyledTooltip>
        <Value>{convertUnit(number)}</Value>
      </Wrap>
    </Card>
  );
};

export default DatasetSelectBtn;
