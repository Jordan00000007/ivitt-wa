import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { apiHost } from '../../../constant/API/APIPath';
import { BBoxInfoType, DataType, getEvaluateAPI, uploadEvalImagesAPI } from '../../../constant/API';
import { createAlertMessage } from '../../../redux/store/slice/alertMessage';
import { selectIteration } from '../../../redux/store/slice/currentIteration';
import { customAlertMessage } from '../../../utils/utils';
import { EvaluateBox, PreviewImg, PreviewImgContainer, RightCardsBlock, StyledBtnOutline, SubTitle, UploadLabel } from '../../pageStyle';
import CircularProgress from '@mui/material/CircularProgress';
import { DataContent, DataWrapper } from '../modelStyle';
import { WsContext } from '../../../layout/logIn/LoginLayout';
import { ImageWHProps, useDraw } from '../../label/hook/useLabelPage';
import { MainContext } from '../../Main';
import CanvasDraw from '../../dataset/components/CanvasDraw';
import ClickArrow from '../../../component/ClickArrow/ClickArrow';



export type EvalDataType = {
  [key: string]: DataType[]
};

export const EvaluateBlock = () => {
  const dispatch = useDispatch();
  const { id: datasetId = '', type: dataType = '' } = useParams();
  const { combinedClass } = useContext(MainContext);
  const currentIter = useSelector(selectIteration).iteration;
  const errorRef = useRef<any | null>(null);
  const { convertId } = useContext(WsContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [evaluateData, setEvaluateData] = useState<EvalDataType>({});
  const [displayUrl, setDisplayUrl] = useState<string>('');
  const [imgNameList, setImgNameList] = useState<string[]>([]);
  const [evaluateIndex, setEvaluateIndex] = useState<number>(0);
  const [boxInfo, setBoxInfo] = useState<BBoxInfoType[]>([]);
  const [imgInfo, setImgInfo] = useState<ImageWHProps>({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });
  const { draw } = useDraw(imgInfo, boxInfo, combinedClass);



  const handleImageLoad = (event: any) => {
    setImgInfo({
      width: event.target.clientWidth,
      height: event.target.clientHeight,
      naturalWidth: event.target.naturalWidth,
      naturalHeight: event.target.naturalHeight
    })
  }

  const handelClear = () => {
    setEvaluateData({})
    setDisplayUrl('')
    setImgNameList([])
    setEvaluateIndex(0)
  }


  const makeBboxInfo = useCallback(() => {

    const boxList = evaluateData[imgNameList[evaluateIndex]].map((info) => {

      return {
        class_name: info.class,
        class_id: combinedClass.filter((v) => v.name === info.class)[0].class_id || '0',
        bbox: info.bbox,
        color_id: combinedClass.filter((v) => v.name === info.class)[0].color_id || '0',
        color_hex: combinedClass.filter((v) => v.name === info.class)[0].color_hex || ''
      }
    })
    setBoxInfo(boxList)
  }, [combinedClass, evaluateData, evaluateIndex, imgNameList])


  const getEvaluateResult = useCallback(() => {
    getEvaluateAPI(datasetId, {
      iteration: currentIter,
      threshold: 0.1
    })
      .then(({ data }) => {
        setEvaluateData(data.data.detections);
      })
      .catch(({ response }) => {
        errorRef.current = true;
        dispatch(createAlertMessage(customAlertMessage('error', response.data.message ? response.data.message : 'Internal server error')));
        handelClear();
      })
      .finally(() => {
        setLoading(false)
      })

  }, [currentIter, datasetId, dispatch])


  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files) {
      handelClear()
      return;
    }

    if (e.target.files.length > 10) {
      dispatch(createAlertMessage(customAlertMessage('error', 'Exceed the maximum number of 10 images.')));
      return;
    }

    const fileList = e.target.files;

    if (fileList.length === 0) {
      handelClear()
      return;
    } else {
      setLoading(true);
      errorRef.current = null;
    }


    const formData = new FormData();
    formData.append("iteration", currentIter);

    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      formData.append("file", file);
    }

    uploadEvalImagesAPI(datasetId, formData)
      .then(({ data }) => {
        const nameList = data.data.eval_img.map((url) => url.split("/").pop() || '')
        setImgNameList(nameList)

        if (data.data.eval_img && data.data.eval_img.length > 0) {
          const imgPath = data.data.eval_img[0].replace("./", '')
          const path2 = imgPath.split("/").pop();
          const final = imgPath.replace(String(path2), '');
          setDisplayUrl(final)
          setLastUpdateTime(new Date().getTime())
        }
        getEvaluateResult()

      })
      .catch((err) => console.log('UPLOAD-ERR', err))
  }, [currentIter, datasetId, dispatch, getEvaluateResult])


  const handelArrowStyle = useCallback((type: string, evaluateIndex: number, imgNameList: string[]) => {
    if (Object.keys(evaluateData).length > 0 && imgNameList.length > 1) {
      if (type === 'right') {
        if (evaluateIndex === imgNameList.length - 1) return true;
        else return false;
      } else {
        if (evaluateIndex === 0) return true;
        else return false
      }
    }
    return true;
  }, [evaluateData])

  const handelEvaluateBoxStyle = useCallback(() => {
    if (displayUrl || loading) {
      if (errorRef.current) {
        return 'flex';
      } else {
        return 'none';
      }
    } else return 'flex';

  }, [displayUrl, loading])

  const evaluateDataDisplay = useCallback(() => {
    if (Object.keys(evaluateData).length < 1) return <></>;
    else {
      return (
        <>
          <PreviewImgContainer style={{ height: 'fit-content' }}>
            <CanvasDraw
              id={String(evaluateIndex)}
              draw={draw}
              width={imgInfo.width}
              height={imgInfo.height}
              boxInfo={boxInfo}
            />

            <PreviewImg
              src={`${apiHost}/display_img/${displayUrl}${imgNameList[evaluateIndex]}?t=${lastUpdateTime}`}
              loading="lazy"
              onLoad={handleImageLoad}
            />

          </PreviewImgContainer>
          <DataWrapper>
            {evaluateData[imgNameList[evaluateIndex]] ?
              evaluateData[imgNameList[evaluateIndex]].length === 0 ?
                <DataContent>{`No detection data.`}</DataContent>
                :
                evaluateData[imgNameList[evaluateIndex]].map((data, index) =>
                  dataType === 'classification' ? //,index: ${JSON.stringify(data.index)}
                    <DataContent key={index}>{`class: ${JSON.stringify(data.class)}, index: ${JSON.stringify(data.index)}, confidence: ${JSON.stringify(data.confidence)}`}</DataContent>
                    :
                    <DataContent key={index}>{`class: ${JSON.stringify(data.class)}, confidence: ${JSON.stringify(data.confidence)}, bbox: ${JSON.stringify(data.bbox)} `}</DataContent>
                )
              : null
            }
          </DataWrapper>
        </>
      )
    }

  }, [evaluateData, evaluateIndex, draw, imgInfo.width, imgInfo.height, boxInfo, displayUrl, imgNameList, lastUpdateTime, dataType])



  useEffect(() => {
    if (dataType === 'classification' || Object.keys(evaluateData).length === 0 || imgNameList.length === 0) return;
    if (Object.keys(evaluateData).length === imgNameList.length) {
      makeBboxInfo()
    }

  }, [dataType, evaluateData, imgNameList.length, makeBboxInfo]);


  return (
    <RightCardsBlock style={{ position: 'relative' }}>
      <SubTitle style={{ height: '30px' }}>Evaluate
        {/* 有URL才顯示沒有不顯示 */}
        <StyledBtnOutline
          className={Object.keys(evaluateData).length > 0 && imgNameList.length > 0 ? '' : 'hide'}
          onClick={handelClear}>
          Clear
        </StyledBtnOutline>
      </SubTitle>
      <ClickArrow
        wrapWidth={'416px'}
        wrapHeight={'270px'}
        leftInfo={{
          hide: handelArrowStyle('left', evaluateIndex, imgNameList),
          clickFunction: () => {
            if (evaluateIndex === 0) return;
            setEvaluateIndex((curr) => curr - 1);
          }
        }}
        rightInfo={{
          hide: handelArrowStyle('right', evaluateIndex, imgNameList),
          clickFunction: () => {
            if (evaluateIndex === imgNameList.length - 1) return;
            setEvaluateIndex((curr) => curr + 1);
          }
        }}
      />
      <EvaluateBox style={{ display: handelEvaluateBoxStyle() }}>
        <UploadLabel className={convertId === '' ? '' : 'disabled'}>Upload
          <input style={{ display: 'none' }} id="input" type="file" multiple={true} accept="image/*" onChange={(e) => { handleFileChange(e) }}
            onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
          ></input>
        </UploadLabel>
      </EvaluateBox>


      <EvaluateBox style={{ display: loading ? 'flex' : 'none' }}>
        <CircularProgress sx={{ color: 'grey.500', display: 'flex' }} color="inherit" />
      </EvaluateBox>

      {evaluateDataDisplay()}
    </RightCardsBlock >
  );
};
