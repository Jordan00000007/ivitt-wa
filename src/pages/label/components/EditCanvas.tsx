import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BBoxInfoType, ResGetImgLabelType, UpdateBBoxInfoType, updateBboxAPI } from '../../../constant/API';
import { selectCardClassType } from '../../dataset/Dataset';
import { calcCanvasRate } from '../../../utils/utils';
import { ImageProps, LabelPageContext } from '../LabelPage';
import { StyledCanvas } from '../labelStyle';
import { MainContext } from '../../Main';
import { ClassListType } from '../../../component/Select/CreateSearchSelect';


export type ImageWHProps = {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

type CanvasProps = {
  canvasId: string;
  boxInfo: BBoxInfoType[];
  currentClass: selectCardClassType;
  imgInfo: ImageProps;
  combinedClass: ClassListType[];
  searchValue: ClassListType | null;
  annotationList: ResGetImgLabelType;
  setAnnotationList: (data: ResGetImgLabelType) => void;
  datasetInfoApiCallback: (datasetId: string, isLabelPage?: boolean) => void;
};

export type CanvasType = {
  x: number;
  y: number;
  w: number;
  h: number;
  x1: number;
  y1: number;
  isNew?: boolean;
};

type DrawInfoType = {
  class_id: string,
  class_name: string,
  bbox: CanvasType,
  color_id: string,
  color_hex: string
  isNew?: boolean,
};

export type RecPointsType = {
  arcX: number,
  arcY: number
};

export type NewRecStartType = {
  newStartX: number,
  newStartY: number,
};

export type CursorType = {
  isActive: boolean,
  cursorNW: 'sw-resize' | 'nw-resize' | '',
  //cursorNW:  '',
  drawing: boolean;
};

const pointOffset = 10;
const lineOffset = 5;
let isDown = false;
let startX: any | null = 0;
let startY: any | null = 0;
let dragTarget: CanvasType | null = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  x1: 0,
  y1: 0
}

let newRec: NewRecStartType = {
  newStartX: 0,
  newStartY: 0
}

const tempInitial = {
  class_id: '',
  class_name: '',
  color_id: '',
  color_hex: '',
  isNew: false,
  bbox: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    x1: 0,
    y1: 0
  },
}

const EditCanvas = (props: CanvasProps) => {
  const { canvasId, boxInfo, imgInfo, combinedClass, searchValue, setAnnotationList } = props;
  const indexRef = useRef<any | null>(null);
  const canvasRef = useRef<any | null>(null);
  const { datasetId } = useContext(MainContext);
  const canvas = canvasRef.current;
  const { targetIcon, setTargetIcon, actionIcon, setActionIcon, setIsChanged } = useContext(LabelPageContext);
  const [direction, setDirection] = useState<string>('');
  const [cursorStyle, setCursorStyle] = useState<CursorType>({
    isActive: false,
    cursorNW: '',
    drawing: targetIcon === 'draw'
  });

  const [tempRec, setTempRec] = useState<DrawInfoType>(tempInitial);

  const x_rate1 = imgInfo.width / imgInfo.naturalWidth;
  const y_rate1 = imgInfo.height / imgInfo.naturalHeight;


  const boxes = useMemo(() => {
    const new_DrawDataArr: DrawInfoType[] = [];

    for (let boxIndex in boxInfo) {
      const bbox = boxInfo[boxIndex].bbox;

      if (imgInfo && boxInfo.length > 0) {
        const { bboxData } = calcCanvasRate({
          width: imgInfo.width,
          height: imgInfo.height,
          naturalWidth: imgInfo.naturalWidth,
          naturalHeight: imgInfo.naturalHeight
        }, bbox)

        new_DrawDataArr.push(
          {
            class_id: boxInfo[boxIndex].class_id,
            class_name: boxInfo[boxIndex].class_name,
            bbox: { x: bboxData.x, y: bboxData.y, x1: bboxData.x1, y1: bboxData.y1, w: bboxData.width, h: bboxData.height },
            color_id: boxInfo[boxIndex].color_id,
            color_hex: boxInfo[boxIndex].color_hex
          }
        )
      }
    }
    return new_DrawDataArr;
  }, [boxInfo, imgInfo]);

  ///////////////////////////////// UTILS /////////////////////////////////////

  const handelCursor = useCallback(() => {
    if (cursorStyle.isActive) {
      return cursorStyle.cursorNW === '' ? 'move' : cursorStyle.cursorNW === 'sw-resize' ? 'sw-resize' : 'nw-resize';
    }
    if (cursorStyle.drawing) return 'crosshair';

    return 'default';

  }, [cursorStyle])


  const countNames = (dataList: any, tempList?: any) => {
    const result: any = {};

    for (let i = 0; i < dataList.length; i++) {
      const { class_name } = dataList[i];
      if (result.hasOwnProperty(class_name)) {
        result[class_name]++;
      }
      else {
        result[class_name] = 1;
      };
    };

    if (result) {
      for (const key in result) {
        tempList[key]['nums'] = result[key]
      }
    }

    return tempList;
  };

  const findName: any = combinedClass.filter((item) => {
    if (item.name === searchValue?.name) return {
      class_id: item.class_id,
      color_id: item.color_id,
      color_hex: item.color_hex,
      name: item.name
    };
    else return '';
  })

  const countPoints = useCallback((recData: CanvasType) => {

    return [
      {
        arcX: recData.x,
        arcY: recData.y
      },
      {
        arcX: recData.x + recData.w,
        arcY: recData.y
      },
      {
        arcX: recData.x,
        arcY: recData.y + recData.h
      },
      {
        arcX: recData.x + recData.w,
        arcY: recData.y + recData.h
      }
    ];
  }, []);

  ///////////////////////////////// DRAW /////////////////////////////////////
  const drawCircle = useCallback((ctx: any, style: string) => {
    ctx.fillStyle = style;
    const pointsArr = countPoints(boxes[indexRef.current].bbox);

    for (let point of pointsArr) {
      ctx.beginPath();
      ctx.arc(point.arcX, point.arcY, 5, 0, 2 * Math.PI)
      ctx.fill();
    };
  }, [boxes, countPoints]);

  const drawRect = useCallback((ctx: any, info: CanvasType, index: number, style: string, drawNew?: boolean) => {
    const { x, y, w, h } = info;
    ctx.lineWidth = 3;
    ctx.strokeStyle = style;

    if (index === indexRef.current || drawNew) {
      drawNew ? ctx.setLineDash([5, 4]) : ctx.setLineDash([10, 6]);
      ctx.strokeRect(x, y, w, h);
    } else {
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);
    }
  }, []);

  const draw = useCallback((ctx: any) => {
    ctx.clearRect(0, 0, imgInfo.width, imgInfo.height);
    boxes.map((info, index) => {
      drawRect(ctx, info.bbox, index, info.color_hex)
      if (index === indexRef.current) {
        drawCircle(ctx, info.color_hex);
      }
    });

  }, [boxes, drawCircle, drawRect, imgInfo.height, imgInfo.width]);

  const drawNew = useCallback((ctx: any, mouseX: number, mouseY: number) => {
    if (!searchValue?.name) return;
    else {
      ctx.clearRect(0, 0, imgInfo.width, imgInfo.height);

      const tempRecData = {
        x: Math.round(newRec.newStartX),
        y: Math.round(newRec.newStartY),
        w: Math.round(mouseX - newRec.newStartX),
        h: Math.round(mouseY - newRec.newStartY),
        x1: Math.round(newRec.newStartX + (mouseX - newRec.newStartX)),
        y1: Math.round(newRec.newStartY + (mouseY - newRec.newStartY))
      }

      setTempRec({
        class_id: findName[0].class_id,
        class_name: searchValue ? searchValue.name : '',
        isNew: true,
        bbox: tempRecData,
        color_id: findName[0].color_id,
        color_hex: findName[0].color_hex
      });

      draw(ctx);
      drawRect(ctx, tempRecData, 0, findName[0].color_hex, true);
    }
  }, [draw, drawRect, findName, imgInfo.height, imgInfo.width, searchValue]);

  const findCurrentArea = useCallback((mouseX: number, mouseY: number) => {
    const pointsArr = countPoints(boxes[indexRef.current].bbox);
    let Top_Left = pointsArr[0];
    let Bottom_Right = pointsArr[3];


    const widthNegative = boxes[indexRef.current].bbox.w <= 0;
    const heightNegative = boxes[indexRef.current].bbox.h <= 0;

    //WH都是正數或都是負數
    const WH_Same = ((!widthNegative && !heightNegative) || (widthNegative && heightNegative));
    //WH一正數一負數
    const WH_Different = ((widthNegative && !heightNegative) || ((!widthNegative && heightNegative)));

    // 'Top_Left' |'Bottom_Right' = nw-resize
    // 'Top_Right'| 'Bottom_Left' = sw-resize

    if (Top_Left.arcX - pointOffset < mouseX && mouseX < Top_Left.arcX + pointOffset) {
      if (Top_Left.arcY - pointOffset < mouseY && mouseY < Top_Left.arcY + pointOffset) {
        setDirection('Top_Left');
        if (WH_Same) setCursorStyle((curr) => { return { ...curr, cursorNW: 'nw-resize' } });
        if (WH_Different) setCursorStyle((curr) => { return { ...curr, cursorNW: 'sw-resize' } });

      } else if (Bottom_Right.arcY - pointOffset < mouseY && mouseY < Bottom_Right.arcY + pointOffset) {
        setDirection('Bottom_Left');
        if (WH_Same) setCursorStyle((curr) => { return { ...curr, cursorNW: 'sw-resize' } });
        if (WH_Different) setCursorStyle((curr) => { return { ...curr, cursorNW: 'nw-resize' } });
      }
      return true;
    } else if (Bottom_Right.arcX - pointOffset < mouseX && mouseX < Bottom_Right.arcX + pointOffset) {
      if (Top_Left.arcY - pointOffset < mouseY && mouseY < Top_Left.arcY + pointOffset) {
        setDirection('Top_Right');
        if (WH_Same) setCursorStyle((curr) => { return { ...curr, cursorNW: 'sw-resize' } });
        if (WH_Different) setCursorStyle((curr) => { return { ...curr, cursorNW: 'nw-resize' } });
      } else if (Bottom_Right.arcY - pointOffset < mouseY && mouseY < Bottom_Right.arcY + pointOffset) {
        setDirection('Bottom_Right');
        if (WH_Same) setCursorStyle((curr) => { return { ...curr, cursorNW: 'nw-resize' } });
        if (WH_Different) setCursorStyle((curr) => { return { ...curr, cursorNW: 'sw-resize' } });
      }
      return true;
    } else {
      setDirection('');
      setCursorStyle((curr) => { return { ...curr, cursorNW: '' } });
      return false;
    }

  }, [boxes, countPoints])

  const hoverPoints = (mouseX: number, mouseY: number) => {
    if (!boxes[indexRef.current]) return false;
    return findCurrentArea(mouseX, mouseY);
  }

  ///////////////////////////////// UPDATE DATA /////////////////////////////////////
  const handelSave = useCallback((updateData: UpdateBBoxInfoType[]) => {

    if (imgInfo.imgName) {
      updateBboxAPI(datasetId,
        {
          image_name: imgInfo.imgName,
          box_info: updateData
        }
      )
        .then(({ status }) => {
          // console.log('updateBboxAPI-res', status);
        })
        .catch(({ response }) => {
          console.log('updateBboxAPI-Error', response.data);
        })
    }
  }, [datasetId, imgInfo.imgName])


  ///////////////////////////////// MOUSE EVENT /////////////////////////////////////
  // identify the click event in the rectangle
  const hitBox = (x: number, y: number, ctx: any, type: 'hit' | 'hover') => {
    if (targetIcon === 'draw') return false;

    let isTarget = false;
    let inList = [];
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];

      const isInTarget = x >= box.bbox.x + (box.bbox.w - Math.abs(box.bbox.w)) / 2 - lineOffset &&
        x <= box.bbox.x + (box.bbox.w + Math.abs(box.bbox.w)) / 2 + lineOffset
        && y >= box.bbox.y + (box.bbox.h - Math.abs(box.bbox.h)) / 2 - lineOffset &&
        y <= box.bbox.y + (box.bbox.h + Math.abs(box.bbox.h)) / 2 + lineOffset

      if (isInTarget) inList.push(i);
      if (type === 'hover') {
        setCursorStyle((curr) => { return { ...curr, isActive: false } });
      }
    }

    if (inList.length > 0) {
      const i = inList.indexOf(indexRef.current) > -1 ? inList.indexOf(indexRef.current) : 0
      setCursorStyle((curr) => { return { ...curr, isActive: true } });
      hoverPoints(x, y);
      if (type === 'hit') {
        dragTarget = boxes[inList[i]].bbox;
        isTarget = true;
        indexRef.current = inList[i];
        draw(ctx);
      }
    }
    return isTarget;
  };

  const handleMouseDown = (e: any) => {
    if (canvas) {
      const context = canvas.getContext('2d');
      startX = Math.round(e.nativeEvent.offsetX) - Math.round(canvas.clientLeft);
      startY = Math.round(e.nativeEvent.offsetY) - Math.round(canvas.clientTop);
      isDown = hitBox(startX, startY, context, 'hit');

      newRec = {
        newStartX: startX,
        newStartY: startY
      }
    }
  };

  const handleMouseMove = (e: any) => {
    const context = canvas.getContext('2d');
    const mouseX = Math.round(e.nativeEvent.offsetX) - Math.round(canvas.clientLeft);
    const mouseY = Math.round(e.nativeEvent.offsetY) - Math.round(canvas.clientTop);

    if (isDown) {
      const dx = mouseX - startX;//水平方向的縮放因子
      const dy = mouseY - startY;//垂直方向的縮放因子

      startX = mouseX;
      startY = mouseY;


      if (dragTarget && direction === '' && targetIcon !== 'draw') {
        dragTarget.x += dx;
        dragTarget.y += dy;
        dragTarget.x1 = dragTarget.w + dragTarget.x
        dragTarget.y1 = dragTarget.h + dragTarget.y
        if (canvas) draw(context);
      } else {
        const pointsArr = countPoints(boxes[indexRef.current].bbox);
        if (!dragTarget) return;

        if (direction === 'Top_Left' || direction === 'Bottom_Left') {
          dragTarget.x = mouseX;
          if (direction === 'Top_Left') {
            dragTarget.y = mouseY;
            dragTarget.w = pointsArr[3].arcX - mouseX;
            dragTarget.h = pointsArr[3].arcY - mouseY;
          } else {
            dragTarget.y = pointsArr[0].arcY;
            dragTarget.w = pointsArr[1].arcX - mouseX;
            dragTarget.h = mouseY - pointsArr[1].arcY
          }
          dragTarget.x1 = dragTarget.w + dragTarget.x
          dragTarget.y1 = dragTarget.h + dragTarget.y
        }

        if (direction === 'Top_Right' || direction === 'Bottom_Right') {
          dragTarget.x = pointsArr[0].arcX;
          if (direction === 'Top_Right') {
            dragTarget.y = mouseY;
            dragTarget.w = mouseX - pointsArr[2].arcX;
            dragTarget.h = pointsArr[2].arcY - mouseY;
          } else {
            dragTarget.y = pointsArr[0].arcY;
            dragTarget.w = mouseX - pointsArr[0].arcX;
            dragTarget.h = mouseY - pointsArr[0].arcY;
          }
          dragTarget.x1 = dragTarget.w + dragTarget.x
          dragTarget.y1 = dragTarget.h + dragTarget.y
        }

        if (canvas) draw(context);
      }

    } else {
      let canvasCoords = canvas.getBoundingClientRect();
      const x = e.pageX - canvasCoords.left
      const y = e.pageY - canvasCoords.top
      hitBox(x, y, context, 'hover');
    }

    if (targetIcon === 'draw' && newRec.newStartX !== 0 && newRec.newStartX !== 0) {
      drawNew(context, mouseX, mouseY)
    }
  };

  const handleMouseUp = () => {
    dragTarget = null;
    isDown = false;

    newRec = {
      newStartX: 0,
      newStartY: 0
    };

    if (targetIcon === 'draw' && tempRec.bbox.x > 0) {
      if (!tempRec.bbox.x1 || !tempRec.bbox.y1) return;
      //push to current array
      boxes.push(tempRec);

      //push in origin
      boxInfo.push(
        {
          class_id: tempRec.class_id,
          class_name: tempRec.class_name,
          bbox: [
            tempRec.bbox.x,
            tempRec.bbox.y,
            tempRec.bbox.x1,
            tempRec.bbox.y1
          ],
          color_id: tempRec.color_id,
          color_hex: tempRec.color_hex
        }
      )
      setTempRec(tempInitial);

      //在draw裡面代表有畫，代表有新增
      const tempAnnotation: Record<string, any> = {};
      boxes.map((box) => {
        tempAnnotation[box.class_name] = {
          class_id: box.class_id,
          class_name: box.class_name,
          color_id: box.color_id,
          color_hex: box.color_hex,
        }
      })
      const test = countNames(boxes, tempAnnotation)
      setAnnotationList(test);
      setIsChanged(true)
    }

    const updateData: UpdateBBoxInfoType[] = boxes.map((box) => {
      return {
        class_id: box.class_id,
        class_name: box.class_name,
        bbox: [
          box.bbox.x / x_rate1,
          box.bbox.y / y_rate1,
          box.bbox.x1 / x_rate1,
          box.bbox.y1 / y_rate1
        ]
      }
    })

    handelSave(updateData);

  };

  const handleMouseOut = () => {
    dragTarget = null;
  };


  const handleDelete = useCallback(() => {
    boxes.splice(indexRef.current, 1)
    boxInfo.splice(indexRef.current, 1)
    const updateData: BBoxInfoType[] = boxes.map((box) => {
      return {
        class_id: box.class_id,
        class_name: box.class_name,
        bbox: [
          box.bbox.x / x_rate1,
          box.bbox.y / y_rate1,
          box.bbox.x1 / x_rate1,
          box.bbox.y1 / y_rate1
        ],
        color_id: box.class_id,
        color_hex: box.color_hex
      }
    })

    const tempAnnotation: Record<string, any> = {};
    boxes.map((box) => {
      tempAnnotation[box.class_name] = {
        class_id: box.class_id,
        class_name: box.class_name,
        color_id: box.color_id,
        color_hex: box.color_hex,
      }
    })
    const test = countNames(boxes, tempAnnotation)
    setAnnotationList(test);

    handelSave(updateData);
    setIsChanged(true)

  }, [boxInfo, boxes, handelSave, setAnnotationList, setIsChanged, x_rate1, y_rate1]);


  const handleKeyDown = useCallback((event: any) => {
    if (event.keyCode === 46 && indexRef.current !== null) handleDelete()
  }, [handleDelete])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      setActionIcon('');
    };
  }, [handleKeyDown, setActionIcon]);

  useEffect(() => {
    if (actionIcon === 'delete' && indexRef.current !== null) handleDelete();
    return (() => {
      setActionIcon('');
    })
  }, [actionIcon, handleDelete, setActionIcon])

  useEffect(() => {
    if (boxInfo?.length === 0 || !imgInfo.width || !imgInfo.height) return;
    const context = canvas.getContext('2d');
    if (canvas) {
      draw(context);
    }

    return () => {
      if (indexRef.current !== null) indexRef.current = null;
      setDirection('');
      setCursorStyle((curr) => { return { ...curr, cursorNW: '' } });
      context.clearRect(0, 0, imgInfo.width, imgInfo.height);
    }
  }, [boxInfo?.length, canvas, draw, imgInfo.height, imgInfo.width])

  useEffect(() => {
    if (!imgInfo.width || !imgInfo.height) return;
    if (targetIcon === 'draw') {
      indexRef.current = null;
      const context = canvas.getContext('2d');
      if (canvas) {
        draw(context);
      }

      if (searchValue?.name !== undefined) {
        setCursorStyle((curr) => { return { ...curr, isActive: false, drawing: true } });
      }
      else {
        setTargetIcon('target');
      }
    } else {
      setCursorStyle((curr) => { return { ...curr, drawing: false } });
    }

  }, [canvas, draw, imgInfo.height, imgInfo.width, searchValue?.name, setTargetIcon, targetIcon])

  useEffect(() => {
    //換圖片就設回false
    setIsChanged(false)
  }, [canvasId, setIsChanged])


  return (
    <StyledCanvas
      id={canvasId}
      ref={canvasRef}
      height={imgInfo.height}
      width={imgInfo.width}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      cursorStyle={handelCursor()}
    />
  );
};


export default EditCanvas;

