import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClassListType } from '../../../component/Select/CreateSearchSelect';
import { addClassAPI, BBoxInfoType, getBboxAPI, GetBBoxType } from '../../../constant/API';
import { createAlertMessage } from '../../../redux/store/slice/alertMessage';
import { selectColorBar } from '../../../redux/store/slice/colorBar';
import { setSelectedClass } from '../../../redux/store/slice/selectedClass';
import { calcCanvasRate, customAlertMessage } from '../../../utils/utils';


export const useGetBoxInfo = (datasetId: string, dataType: string, currPath: GetBBoxType, imgDataList: string[]) => {
  const [boxInfo, setBoxInfo] = useState<BBoxInfoType[]>([]);

  useEffect(() => {
    if (dataType !== 'classification' && imgDataList.length > 0 && currPath.image_path !== undefined && currPath.image_path !== `undefined`) {
      getBboxAPI(datasetId, currPath)
        .then(({ data }) => {
          setBoxInfo(data.data.box_info);
        })
        .catch(({ response }) => console.log(response.data.message));
    }

    return () => {
      //在return清掉boxInfo, draw才不會用到stale state去畫
      setBoxInfo([])
    }
  }, [currPath, dataType, datasetId, imgDataList.length, setBoxInfo])

  return {
    boxInfo
  };
}


export type ImageWHProps = {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

export type canvasType = {
  x: number;
  y: number;
  w: number;
  h: number;
};


export const useDraw = (imgInfo: ImageWHProps, boxData: BBoxInfoType[], combinedClass: ClassListType[]) => {
  const colorBar = useSelector(selectColorBar).colorBar;

  const draw = useCallback((ctx: any) => {
    ctx.lineWidth = 3;
    const drawDataArr: canvasType[] = [];

    for (let boxIndex in boxData) {
      const bbox = boxData[boxIndex].bbox;
      const colorId = boxData[boxIndex].color_id
      const class_name = boxData[boxIndex].class_name
      ctx.strokeStyle = colorBar[colorId];

      if (imgInfo && boxData.length > 0) {
        const { bboxData } = calcCanvasRate({
          width: imgInfo.width,
          height: imgInfo.height,
          naturalWidth: imgInfo.naturalWidth,
          naturalHeight: imgInfo.naturalHeight
        }, bbox)

        ctx.strokeRect(bboxData.x, bboxData.y, bboxData.width, bboxData.height);
        // ctx.font = "25px roboto";
        // ctx.strokeText(class_name, bboxData.x+6, bboxData.y+24);
        drawDataArr.push({ x: bboxData.x, y: bboxData.y, w: bboxData.width, h: bboxData.height })
      }
    }

    return drawDataArr

  }, [boxData, colorBar, imgInfo])

  return {
    draw,
  };
}


export const useCanvas = (draw: (ctx: any) => void) => {
  const canvasRef = useRef<any | null>(null);

  useEffect(() => {

    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d');
      draw(context)
    }

  }, [draw])

  return canvasRef
}

export const useAddNewClass = (datasetId: string, classList: ClassListType[]) => {
  const dispatch = useDispatch();

  const updateList = useCallback((theNewClass: string, colorId: number) => {
    //讓redux資料設為新的value
    dispatch(setSelectedClass(theNewClass))
    classList.push({ name: theNewClass, color_id: String(colorId) })
  }, [classList, dispatch])

  const addClassAPICallback = useCallback((theNewClass: string, colorId: number) => {
    return addClassAPI(datasetId, { class_name: theNewClass, color_id: colorId, color_hex:'' })
      .then((res) => {
        if (res.status === 200) {
          updateList(theNewClass, colorId)
          dispatch(createAlertMessage(customAlertMessage('success', 'Create class success')));
          return true
        }
        return false
      })
      .catch(({ response }) => {
        console.log('addClassAPI-Error!', response.data.message)
        dispatch(createAlertMessage(customAlertMessage('error', 'Create class fail')));
      })

  }, [dispatch, datasetId, updateList])


  return {
    updateList,
    addClassAPICallback
  };
}



