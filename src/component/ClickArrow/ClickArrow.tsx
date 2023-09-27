import styled from 'styled-components';
import ArrowIcon from './ArrowIcon';
import { useState } from 'react';


type ArrowInfo = {
  hide: boolean;
  clickFunction: () => void;
};

type ClickArrowProps = {
  leftInfo: ArrowInfo;
  rightInfo: ArrowInfo;
  wrapWidth: string;
  wrapHeight: string;
};


export const ArrowBtnWrap = styled.div<{ width: string, height: string }>`
  position: relative;
  width: ${props => props.width};
  height: ${props => props.height};
`;



const ArrowBtn = styled.div<{ direction: string }>`
  cursor: pointer;
  width: 22px;
  height: 80px;
  position: absolute;  
  top: 100px; 
  left:  ${(props) => (props.direction === 'left' ? "-5.5%" : "100%")};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &.hide {
    visibility: hidden;
    pointer-events: none;
  }
`;


const ClickArrow = (props: ClickArrowProps) => {
  const { leftInfo, rightInfo, wrapWidth, wrapHeight } = props;
  const [RHovered, setRHovered] = useState<string>('');
  const [LHovered, setLHovered] = useState<string>('');


  return (
    <div style={{ position: 'relative', width: wrapWidth, maxHeight: wrapHeight }}>
      <ArrowBtn
        className={leftInfo.hide ? 'hide' : ''}
        onMouseEnter={() => setRHovered('true')}
        onMouseLeave={() => setRHovered('')}
        onClick={leftInfo.clickFunction}
        direction={'left'}
      >
        <ArrowIcon direction={'left'} hovered={RHovered} />
      </ArrowBtn>

      <ArrowBtn
        className={rightInfo.hide ? 'hide' : ''}
        onMouseEnter={() => setLHovered('true')}
        onMouseLeave={() => setLHovered('')}
        onClick={rightInfo.clickFunction}
        direction={'right'}
      >
        <ArrowIcon direction={'right'} hovered={LHovered} />
      </ArrowBtn>
    </div>
  );
};

export default ClickArrow;  
