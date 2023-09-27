
import Dialog, { DialogProps } from '../../../component/Dialogs/Dialog'
import { Title, ActionContainer, StyledButton, StyledButtonRed } from '../../../component/Dialogs/commonDialogsStyle';
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import InputTextField from '../../../component/Input/InputTextField';
import { ContentWrapper, DeleteIcon, Row, StyledLabelColor } from '../labelStyle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { RenameClassType, deleteClassAPI, renameClassAPI } from '../../../constant/API';
import { MainContext, selectCardClassType } from '../../Main';
import { SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createAlertMessage } from '../../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../../utils/utils';
import StyledTooltip from '../../../component/Tooltip';
import { ClassListType } from '../../../component/Select/CreateSearchSelect';
import { useParams } from 'react-router-dom';
import { selectIteration } from '../../../redux/store/slice/currentIteration';
import { getImgUrlList } from '../../dataset/components/SliderCard';
import { selectProjectData } from '../../../redux/store/slice/projectData';


type EditClassDialogProps = DialogProps & {
  setOpenEditClass: (data: boolean) => void;
  currentClass: selectCardClassType;
  currIndex: number;
  setCurrIndex: Dispatch<SetStateAction<number>>;
  getImgLabelAPICallback: () => void;
  searchValue: ClassListType | null;
  setSearchValue: (value: ClassListType | null) => void;
  classList: ClassListType[];
  setImgDataList: (data: string[]) => void;
};


const EditClassDialog = (props: EditClassDialogProps) => {
  const { setImgDataList, classList, searchValue, setSearchValue, getImgLabelAPICallback, currIndex, setCurrIndex, open, handleClose, setOpenEditClass, currentClass, ...restProps } = props;
  const dispatch = useDispatch();
  const currentIter = useSelector(selectIteration).iteration;
  const projectData = useSelector(selectProjectData).projectData;
  const workspaceInfo = projectData['workspace']
  const { id: datasetId = '', type: dataType = '' } = useParams();
  const { datasetInfoApiCallback, activeClassName, setActiveClassName } = useContext(MainContext);
  const [deleteClass, setDeleteClass] = useState<string[]>([]);
  const [newClassList, setNewClassList] = useState<ClassListType[]>(classList.map(d => ({ ...d })));

  const renewData = useCallback((newName?: string) => {
    datasetInfoApiCallback(datasetId, true);

    setTimeout((() => {
      if (dataType === 'object_detection') {
        getImgLabelAPICallback();
      }

      if (dataType === 'classification' && newName) {
        const reqData = {
          iteration: currentIter,
          class_name: activeClassName === 'All' ? activeClassName : newName
        }
        getImgUrlList(datasetId, reqData).then((data) => {
          if (data) setImgDataList(data);
        })
      }

      dispatch(createAlertMessage(customAlertMessage('success', `Change success`)));
    }), 500)

  }, [activeClassName, currentIter, dataType, datasetId, datasetInfoApiCallback, dispatch, getImgLabelAPICallback, setImgDataList])


  const toDeleteClass = useCallback((deleteItem: string) => {
    return (
      deleteClassAPI(datasetId, deleteItem)
        .then(({ data }) => {
          if (activeClassName !== 'All' && activeClassName === deleteItem) {
            setActiveClassName('All');
            setCurrIndex(0)
          }
          if (deleteItem === searchValue?.name) setSearchValue(null);
        })
        .catch(({ response }) => {
          console.log("CLS-DELETE-ERROR", response.data.message)
          dispatch(createAlertMessage(customAlertMessage('error', 'Delete failed')));
        })
        .finally(() => {
          setDeleteClass([]);
        })
    )

  }, [activeClassName, datasetId, dispatch, searchValue?.name, setActiveClassName, setCurrIndex, setSearchValue])

  const toRenameClass = useCallback((renameItem: RenameClassType) => {
    return (
      renameClassAPI(datasetId, renameItem)
        .then(() => {
          renewData(renameItem.new_name);
          if (renameItem.new_name && activeClassName !== 'All' && activeClassName === renameItem.class_name) setActiveClassName(renameItem.new_name);
          if (renameItem.new_name && renameItem.class_name === searchValue?.name) setSearchValue({ name: renameItem.new_name });

          setCurrIndex(currIndex)
        })
        .catch(({ response }) => {
          console.log("CLS-RENAME-ERROR", response.data.message)
          dispatch(createAlertMessage(customAlertMessage('error', 'Rename failed')));
        })
    )
  }, [activeClassName, currIndex, datasetId, dispatch, renewData, searchValue?.name, setActiveClassName, setCurrIndex, setSearchValue])

  const manageAPIPerformance = useCallback(async (list: any, type: 'delete' | 'rename') => {
    try {
      for (let item of list) {
        if (type === 'delete') await toDeleteClass(item);
        else await toRenameClass(item)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setOpenEditClass(false)
      if (type === 'delete') renewData();
    }
  }, [renewData, setOpenEditClass, toDeleteClass, toRenameClass])

  const getRenameList = (renameList: ClassListType[]) => {
    const renameArr = renameList.map(({ name, inputValue }) => {
      return {
        class_name: name,
        new_name: inputValue,
      }
    });
    return renameArr;
  }

  const handleEditClassSave = useCallback(() => {
    const renameList = newClassList.filter(({ name, inputValue }) => name !== inputValue);
    //以delete為主，做完才做rename，不然同時做會白頁
    //Delete
    if (deleteClass.length > 0) {
      manageAPIPerformance(deleteClass, 'delete')
        .then(() => {
          if (renameList.length > 0) {
            manageAPIPerformance(getRenameList(renameList), 'rename')
          }
        })
    }

    //Rename 如果只有rename就單獨做
    if (renameList.length > 0 && deleteClass.length === 0) {
      manageAPIPerformance(getRenameList(renameList), 'rename')
    }

  }, [deleteClass, manageAPIPerformance, newClassList]);


  const handleCancel = useCallback(() => {
    setNewClassList(classList);
    handleClose();
    setDeleteClass([]);
  },
    [classList, handleClose, setNewClassList]
  );

  const handleOnChange = (e: SelectChangeEvent<string>, index: number) => {
    setNewClassList((state) => {
      const clone = [...state]
      clone[index].inputValue = e.target.value
      return clone
    })
  };

  const toRemove = useCallback((target: string, index: number) => {

    setNewClassList((state) => {
      const clone = [...state]
      clone.splice(index, 1);
      return clone
    })

    setDeleteClass([...deleteClass, target])

  }, [deleteClass]);


  useEffect(() => {
    setNewClassList(classList.map(d => ({ ...d })));
  }, [classList])

  useEffect(() => {
    if (open) {
      datasetInfoApiCallback(datasetId, true);
    }
  }, [datasetId, datasetInfoApiCallback, open])


  return (
    <Dialog style={{ width: '500px', maxHeight: '465px', margin: '30px 40px', overflow: 'hidden' }}
      open={open} handleClose={() => handleCancel()} {...restProps}>
      <Title style={{ marginBottom: '4px' }}>Edit classes</Title>

      <ContentWrapper>
        {newClassList.length !== 0 ?
          newClassList.map(({ name, class_id, color_hex, inputValue = '' }, index) =>
            <Row key={name + class_id}>
              <StyledLabelColor color={`${color_hex}`} />
              <InputTextField
                name={name}
                key={name + class_id + '_input'}
                labelName={''}
                value={inputValue}
                onChange={(e) => {
                  handleOnChange(e, index)
                }}
              />
              <StyledTooltip place='right'
                title={workspaceInfo?.classInfo[name]?.nums !== 0 ? `The class is not allowed to delete if it's applied to at least one image.` : ''}
              >
                <DeleteIcon
                  className={workspaceInfo?.classInfo[name]?.nums !== 0 ? 'disabled' : ''}
                  onClick={() => toRemove(name, index)}>
                  <DeleteForeverIcon />
                </DeleteIcon>
              </StyledTooltip>

            </Row>)
          :
          <div style={{ marginTop: '12px' }}>No classes</div>
        }
      </ContentWrapper>

      <ActionContainer>
        <StyledButton type='button' onClick={() => handleCancel()}>
          Cancel
        </StyledButton>
        <StyledButtonRed style={{ marginBottom: '0' }} onClick={() => handleEditClassSave()}>Save</StyledButtonRed>
      </ActionContainer>
    </Dialog >
  );
};

export default EditClassDialog;


