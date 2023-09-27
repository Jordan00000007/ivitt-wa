import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import ClassLabel from '../../../component/Label/ClassLabel';
import { ResGetImgLabelType } from '../../../constant/API';
import { apiHost } from '../../../constant/API/APIPath';
import { StyledArrowBtn } from '../../model/modelStyle';
import { RightCardWrapper, RightCardsBlock, SubTitle, StyledBtnOutline, PreviewImgContainer, PreviewImg } from '../../pageStyle';
import { NoImgIcon } from '../../../component/Card/ProjectCard';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTab, setCurrentTab } from '../../../redux/store/slice/currentTab';
import { MainContext } from '../../Main';
import CanvasDraw from './CanvasDraw';
import { ImageWHProps, useDraw, useGetBoxInfo } from '../../label/hook/useLabelPage';
import { SliderArrow } from '../../label/LabelPage';
import ArrowIcon from '../../../component/ClickArrow/ArrowIcon';
import ClickArrow from '../../../component/ClickArrow/ClickArrow';

const LabelWrapper = styled.div`
  width: 416px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const ArrowBtn = styled.div<{ type: string }>`
  width: 22px;
  height: 80px;
  /* background-color: #ceecb4; */
  cursor: pointer;
  position: absolute;  
  top: 100px;  
  right: ${({ type }) => (type === "right" ? "8px" : "unset")};
  left: ${({ type }) => (type === "left" ? "-5.5%" : "100%")};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PreviewArrowBtnWrap = styled.div`
  background-color: #ceecb4;
  width: 22px;
  height: 80px;
  cursor: pointer;
  position: absolute;  
  top: 100px;  
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PreviewArrowBtn = styled(StyledArrowBtn)`
  top: 135px;  
  right: ${({ type }) => (type === "right" ? "-13px" : "unset")};
  left: ${({ type }) => (type === "left" ? "-13px" : "unset")};
`

type PreviewProps = {
  activeIter: string;
  imgDataList: string[];
  currIndex: number;
  setCurrIndex: Dispatch<SetStateAction<number>>;
  imgLabelData: ResGetImgLabelType;
};


export const filterUnlabeled = (classLabel: ResGetImgLabelType) => {
  const classLabelList = Object.fromEntries(Object.entries(classLabel).filter(([key]) => !key.includes('Unlabeled')));
  return classLabelList;
}

const PreviewBox = (props: PreviewProps) => {
  const { imgLabelData, activeIter, imgDataList, currIndex, setCurrIndex } = props;
  const { datasetId, dataType, combinedClass } = useContext(MainContext);
  const dispatch = useDispatch();
  const currentTab = useSelector(selectCurrentTab).tab;

  const [imgInfo, setImgInfo] = useState<ImageWHProps>({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });


  const currPath = useMemo(() => {
    if (currentTab !== 'Dataset') return { image_path: `undefined` };
    return { image_path: `/${imgDataList[currIndex]}` }
  }, [currIndex, currentTab, imgDataList]);

  const { boxInfo } = useGetBoxInfo(datasetId, dataType, currPath, imgDataList);

  const { draw } = useDraw(imgInfo, boxInfo, combinedClass);

  const handleImageLoad = (event: any) => {
    setImgInfo({
      width: event.target.clientWidth,
      height: event.target.clientHeight,
      naturalWidth: event.target.naturalWidth,
      naturalHeight: event.target.naturalHeight
    })
  }




  if (!imgDataList[currIndex]) return (
    <RightCardWrapper>
      <RightCardsBlock style={{ height: 'fit-content', position: 'relative' }}>
        <SubTitle style={{ marginBottom: '9px' }}>Preview</SubTitle>
        <PreviewImgContainer>
          <NoImgIcon />
        </PreviewImgContainer>
      </RightCardsBlock>
    </RightCardWrapper >
  )

  return (
    <>
      <RightCardWrapper>
        <RightCardsBlock style={{ height: 'fit-content', position: 'relative' }}>
          <SubTitle style={{ marginBottom: '9px' }}>Preview
            <StyledBtnOutline
              onClick={() => {
                dispatch(setCurrentTab("Label"));
              }}
              className={activeIter === 'workspace' ? '' : 'hide'}>
              Label
            </StyledBtnOutline>
          </SubTitle>
          <ClickArrow
            wrapWidth={'416px'}
            wrapHeight={'270px'}
            leftInfo={{
              hide: currIndex === 0,
              clickFunction: () => {
                if (currIndex === 0) return;
                setCurrIndex((curr: number) => curr - 1);
              }
            }}
            rightInfo={{
              hide: currIndex === imgDataList.length - 1,
              clickFunction: () => {
                if (currIndex === imgDataList.length - 1) return;
                setCurrIndex((curr: any) => curr + 1);
              }
            }}
          />
          <PreviewImgContainer>
            <CanvasDraw
              id={String(currIndex)}
              draw={draw}
              width={imgInfo.width}
              height={imgInfo.height}
              boxInfo={boxInfo}
            />
            {currentTab === 'Dataset' && <PreviewImg onLoad={handleImageLoad} src={`${apiHost}/display_img/${imgDataList[currIndex]}`} loading="lazy" />}
          </PreviewImgContainer>

          <LabelWrapper>
            {combinedClass.map(({ name }, index) =>
              imgLabelData[name] ?
                <ClassLabel
                  key={index + name}
                  color={imgLabelData[name].color_hex}
                  text={name}
                  value={imgLabelData[name].nums}
                /> : null
            )}
          </LabelWrapper>
        </RightCardsBlock>
      </RightCardWrapper >
    </>
  );
};


export default PreviewBox;

