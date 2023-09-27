import styled from 'styled-components';
import { ActiveRedGrayBtn } from '../../component/Buttons/ButtonStyle';
import { ArrowBtn } from '../dataset/components/SliderCard';

export const Left = styled.div`
  width: 60%;
`;

export const CardWrapper = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: space-between;
  padding-bottom: 20px;
  width: 696px;
`;

export const CardsBlock = styled.div`
  display: flex;
  width: 696px;
  height: 343px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.color.divider};
  background-color: ${props => props.theme.color.base_2};
`;

export const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  border-right: 1px solid ${props => props.theme.color.divider};
  width: 100%;
  height: 100%;
  overflow: hidden;
`;


export const BtnWrapper = styled.div`
  display: flex; 
  justify-content: flex-start;
  align-items: center;
`
export const SwitchChartBtn = styled(ActiveRedGrayBtn)`
  height: 24px;
  width: 50px;
  padding: 0;
`

export const SpanWrapper = styled.div`
  height: 256px;
  overflow-y: auto;
  overflow-x: hidden;


   /* width */
  *::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  *::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
    margin: 2px;
    border-radius: 10px;
    background: ${(props) => props.theme.color.divider}60;
    box-shadow: -2px 3px 6px ${(props) => props.theme.color.divider}50;
  }

  /* Handle */
  *::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.color.divider};
    border-radius: 10px;
  }
`;

export const LogContent = styled.div`
  padding-bottom: 4px;
  white-space:pre-line;
  display: block;
  width: 100%;
`

export const TrainLogSpan = styled.div`
  padding-bottom: 8px;
  white-space:normal;
  display: block;
  height: 48px;
  width: 100%;
`


export const TrainLogWrapper = styled(SpanWrapper)`
  display: flex;
  flex-direction: column-reverse;
`;


//Evaluate
export const DataWrapper = styled.div`
  width: 422px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;

  &:hover{
    width: 428px;
    overflow-y: auto;
  }

   /* width */
   *::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  *::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
    margin: 2px;
    border-radius: 10px;
    background: ${(props) => props.theme.color.divider}60;
    box-shadow: -2px 3px 6px ${(props) => props.theme.color.divider}50;
  }

  /* Handle */
  *::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.color.divider};
    border-radius: 10px;
  }
`;

export const DataContent = styled.div`
  white-space:pre-line;
  display: block;
  width: 100%;
  `

export const StyledArrowBtn = styled(ArrowBtn)`
  width: 10px;
  height: 10px;
  position: absolute;  
  top: -10%;  
  bottom: 0;   
  margin: auto;
  right: ${({ type }) => (type === "right" ? "8px" : "unset")};
  left: ${({ type }) => (type === "left" ? "8px" : "unset")};

  &:hover {
    border-top: 2px solid ${props => props.theme.color.onColor_1};
    border-right: 2px solid ${props => props.theme.color.onColor_1};
  }

  &.hide {
    visibility: hidden;
    display: none;
    pointer-events: none;
  }

  //取消disable狀態
  /* &.disable {
    border-top: 2px solid ${props => props.theme.color.divider};
    border-right: 2px solid ${props => props.theme.color.divider};
  } */
`;