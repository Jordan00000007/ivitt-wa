import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { BBoxInfoType } from '../../../constant/API';
import { selectCurrentTab } from '../../../redux/store/slice/currentTab';
import styled from 'styled-components';

type CanvasProps = {
  id: string;
  draw: (ctx: any) => void;
  width: number;
  height: number;
  boxInfo: BBoxInfoType[];
};


export const StyledCanvas = styled.canvas`
  position: absolute; 
  z-Index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`;


const CanvasDraw = (props: CanvasProps) => {
  const { id, draw, width, height, boxInfo } = props;
  const currentTab = useSelector(selectCurrentTab).tab;
  const canvasRef = useRef<any | null>(null);
  const canvas = canvasRef.current;


  useEffect(() => {
    if (boxInfo?.length === 0 || !width || !height || !canvas) return;

    const context = canvas.getContext('2d');
    draw(context);


    return () => {
      context.clearRect(0, 0, width, height);
    }

  }, [boxInfo, draw, height, width, canvasRef, currentTab, canvas])


  return (
    <StyledCanvas
      id={id}
      ref={canvasRef}
      height={height}
      width={width}
    />
  );
};


export default CanvasDraw;

