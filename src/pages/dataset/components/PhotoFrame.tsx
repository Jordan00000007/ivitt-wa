import { useRef, useState, useCallback } from 'react';
import { ButtonWrap, EmptySelectIcon, HoverIcon, SelectIcon, PhotoFrame, Photo } from '../datasetStyle';
import { apiHost } from '../../../constant/API/APIPath';
import { DeleteListItemType, IdSelectMapType } from '../Dataset';
import { selectIteration } from '../../../redux/store/slice/currentIteration';
import { useSelector } from 'react-redux';


type PhotoFrameProps = {
  hoveredIndex: number;
  value: DeleteListItemType;
  selectPhotoList: number[];
  setSelectPhotoList: (data: React.SetStateAction<any[]>) => void;
  currIndex: number;
  handleImgClick: (e: any) => void;
  handleImgDoubleClick: (e: any) => void;
  idSelectMap: IdSelectMapType;
  openDeleteTab: boolean;
};


const PhotoFrameItem = (props: PhotoFrameProps) => {
  const { openDeleteTab, hoveredIndex, value, currIndex, selectPhotoList, setSelectPhotoList, handleImgClick,handleImgDoubleClick, idSelectMap } = props;
  const [hoverPhoto, setHoverPhoto] = useState<boolean>(false);
  const currentIter = useSelector(selectIteration).iteration;
  const hoverIndex = useRef<any | null>(null);
  const isWorkspace = currentIter === 'workspace';

  const checkTarget = useCallback((index: number) => {
    if (!selectPhotoList) return;
    if (selectPhotoList.length <= 0) return false;
    else {
      const findIndex = selectPhotoList.findIndex((element: number) => element === index);
      if (findIndex < 0) return false;
      else return true;
    }
  }, [selectPhotoList]);


  const onMouseLeave = () => {
    setHoverPhoto(false);
  };

  const onMouseOver = useCallback((index: number) => {
    hoverIndex.current = index;
    setHoverPhoto(true);
  }, [])


  const onMouseDown = useCallback((index: number) => {
    idSelectMap[index] = idSelectMap[index] ? false : true;

    //如果在SelectPhotoList找不到，就push
    if (!checkTarget(index)) {
      setSelectPhotoList((curr) => {
        const clone = [...curr]
        clone.push(index);

        return clone
      })
    } else {
      setSelectPhotoList((curr) => {
        const clone = [...curr]
        const target = (element: number) => element === index;
        clone.splice(clone.findIndex(target), 1)
        return clone
      })
    }

  }, [checkTarget, idSelectMap, setSelectPhotoList])


  return (
    <>
      {isWorkspace ?
        <PhotoFrame key={hoveredIndex} id={String(hoveredIndex)}
          active={selectPhotoList.length >= 0 && openDeleteTab ? false : hoveredIndex === currIndex}
          
          onMouseLeave={() => onMouseLeave()}
          onMouseOver={() => onMouseOver(hoveredIndex)}
          className={idSelectMap[hoveredIndex] ? 'addBlur' : ''}
          onClick={(e: any) => handleImgClick(e)}
          onDoubleClick={(e: any) => handleImgDoubleClick(e)}
        >
          <ButtonWrap
            show={openDeleteTab}
            onMouseDown={() => onMouseDown(hoveredIndex)}
          >
            <SelectIcon selected={idSelectMap[hoveredIndex]} />
            <HoverIcon show={hoverIndex.current === hoveredIndex && hoverPhoto ? 'true' : 'false'} />
          </ButtonWrap>
          <EmptySelectIcon show={selectPhotoList.length >= 0 && openDeleteTab ? 'true' : 'false'} />
          <Photo src={`${apiHost}/display_img/${value.url}`} alt={`${value.name}`} loading="lazy" />
        </PhotoFrame >
        :
        <PhotoFrame key={hoveredIndex} id={String(hoveredIndex)}
          active={hoveredIndex === currIndex}
          
          onClick={(e: any) => handleImgClick(e)}
         
        >
          <Photo src={`${apiHost}/display_img/${value.url}`} alt={`${value.name}`} loading="lazy" />
        </PhotoFrame >
      }
    </>
  );
};


export default PhotoFrameItem;

