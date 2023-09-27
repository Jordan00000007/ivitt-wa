import { DeletePhotoContainer, DeletePhotoInner, SelectAllBtn, SelectCancelBtn, SelectDeleteBtn, SelectedCount, SelectedTitle } from '../datasetStyle';
import { ActionContainer } from '../../../component/Dialogs/commonDialogsStyle';
import { SubTitle } from '../../pageStyle';
import { useCallback, useContext, useState } from 'react';
import { DeleteListItemType, IdSelectMapType } from '../Dataset';
import { deleteAllDatasetImgAPI, deleteDatasetImgAPI } from '../../../constant/API';
import { useDispatch } from 'react-redux';
import { closeLoading, openLoading } from '../../../redux/store/slice/loading';
import { MainContext } from '../../Main';
import { createAlertMessage } from '../../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../../utils/utils';
import { setDisableBtn } from '../../../redux/store/slice/disableBtn';

type DeletePhotoTabProps = {
  selectImgTotal: number;
  selectPhotoList: number[];
  setSelectPhotoList: (data: React.SetStateAction<any[]>) => void;
  setCurrIndex: (data: number | any) => void;
  setIdSelectMap: (data: IdSelectMapType) => void;
  imgDataListLength: number;
  setOpenDeleteTab: (data: boolean) => void;
  initDeleteData: {
    delInfo: Record<number, DeleteListItemType>;
  }
};


const DeletePhotoTab = (props: DeletePhotoTabProps) => {
  const { initDeleteData, setOpenDeleteTab, imgDataListLength, selectImgTotal, setCurrIndex, selectPhotoList, setSelectPhotoList, setIdSelectMap } = props;
  const { datasetInfoApiCallback, datasetId, dataType, activeClassName } = useContext(MainContext);
  const dispatch = useDispatch();
  const [allTrue, setTrue] = useState(true);




  const convertDeleteListData = (activeClassName: string, delInfo: Record<number, DeleteListItemType>, selectPhotoList: any[], type: string) => {
    const nameList: string[] = [];
    const clsInfo: Record<string, string> = {};
    const deleteImgInfo: Record<string, string[]> = {};
    const clsDeleteImgInfo: Record<string, string[]> = {};

    selectPhotoList.map((ind) => {
      const selectedName = delInfo[ind].name;
      const selectedUrl = delInfo[ind].url;
      const type = selectedUrl.split("/")[3];
      clsInfo[selectedName] = type;
      if (selectedName) nameList.push(selectedName);
    })


    if (type === 'classification' && activeClassName === "All") {
      Object.entries(clsInfo).map(([key, value]) => {
        if (clsDeleteImgInfo[value] === undefined) {
          clsDeleteImgInfo[value] = [key]
        } else {
          clsDeleteImgInfo[value].push(key)
        }
      })
      return {
        data: {
          image_info: clsDeleteImgInfo
        }
      }

    } else {
      deleteImgInfo[activeClassName] = nameList;
      return {
        data: {
          image_info: deleteImgInfo
        }
      }
    }
  };

  const handelSelectDelList = useCallback((type?: 'cancel') => {
    const selectListMap: Record<number, boolean> = {};

    const totalArr = Array.from({ length: imgDataListLength }, (v, index) => {
      if (allTrue && type !== 'cancel') {
        selectListMap[index] = true;
      } else {
        selectListMap[index] = false;
        setSelectPhotoList([])
      }
      return index;
    });

    if (allTrue) {
      setSelectPhotoList(totalArr);
    }

    if (type === 'cancel') {
      setSelectPhotoList([]);
      setOpenDeleteTab(false);
    } else {
      setOpenDeleteTab(true);
    }

    setIdSelectMap(selectListMap)

  }, [allTrue, imgDataListLength, setIdSelectMap, setOpenDeleteTab, setSelectPhotoList]);

  const handelQuitDeleteTab = useCallback(() => {
    setSelectPhotoList([]);
    setOpenDeleteTab(false);
    setCurrIndex(0);
    dispatch(setDisableBtn(false));
    setIdSelectMap({})
  }, [dispatch, setCurrIndex, setIdSelectMap, setOpenDeleteTab, setSelectPhotoList])


  //deleteAPI
  const deleteImgCallback = useCallback(() => {
    convertDeleteListData(activeClassName, initDeleteData.delInfo, selectPhotoList, dataType)
    dispatch(openLoading());
    deleteDatasetImgAPI(datasetId, convertDeleteListData(activeClassName, initDeleteData.delInfo, selectPhotoList, dataType))
      .then(({ data }) => {
        datasetInfoApiCallback(datasetId);
        dispatch(createAlertMessage(customAlertMessage('success', 'Deleted')));
      })
      .catch(({ response }) => {
        dispatch(createAlertMessage(customAlertMessage('error', 'Delete image(s) error')))
        console.log('deleteImgCallback-Error', response.data.message)
      })
      .finally(() => {
        handelQuitDeleteTab();
        dispatch(closeLoading());
      })

  }, [activeClassName, dataType, datasetId, datasetInfoApiCallback, dispatch, handelQuitDeleteTab, initDeleteData.delInfo, selectPhotoList])

  const deleteAllImgCallback = useCallback(() => {
    dispatch(openLoading());
    deleteAllDatasetImgAPI(datasetId)
      .then(({ data }) => {
        datasetInfoApiCallback(datasetId);
        dispatch(createAlertMessage(customAlertMessage('success', 'Deleted')));
      })
      .catch(({ response }) => {
        dispatch(createAlertMessage(customAlertMessage('error', 'Delete images error')))
        console.log('deleteALLImgCallback-Error', response.data.message)
      })
      .finally(() => {
        handelQuitDeleteTab();
        dispatch(closeLoading());
      })

  }, [datasetId, datasetInfoApiCallback, dispatch, handelQuitDeleteTab]);



  const handelDelete = () => {
    if (selectPhotoList.length === imgDataListLength && activeClassName === 'All') deleteAllImgCallback();
    else deleteImgCallback();
  }


  return (
    <DeletePhotoContainer>
      <SubTitle style={{ marginBottom: '16px' }}>
        Delete image
        <SelectAllBtn
          onClick={() => {
            handelSelectDelList()
            setTrue((curr) => !curr)
          }}
          className={''}>
          {allTrue ? 'Select all' : 'Deselect all'}

        </SelectAllBtn>
      </SubTitle>

      <DeletePhotoInner>
        <SelectedTitle>
          Selected
        </SelectedTitle>

        <SelectedCount>
          {selectPhotoList ? selectPhotoList.length : 0}/{selectImgTotal}
        </SelectedCount>

      </DeletePhotoInner>
      <ActionContainer>
        <SelectCancelBtn
          style={{ marginRight: '16px' }}
          onClick={() => {
            setCurrIndex(0);
            handelSelectDelList('cancel');
          }}
        > Cancel
        </SelectCancelBtn>
        <SelectDeleteBtn
          onClick={() => handelDelete()}
          disabled={selectPhotoList.length === 0}
        >Delete</SelectDeleteBtn>
      </ActionContainer>
    </DeletePhotoContainer>
  );
};


export default DeletePhotoTab;

