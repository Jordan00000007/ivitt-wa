import { useCallback, useState } from 'react';
import { createAlertMessage } from '../../../redux/store/slice/alertMessage';
import { CommonDeleteDialog } from '../../../component/Dialogs';
import UploadDialog from '../../../component/Dialogs/UploadDialog';
import Menu from '../../../component/Menu';
import MenuItem from '../../../component/Select/StyledMenuItem';
import { getAllProjectsAPI, GetAllProjectsType } from '../../../constant/API';
import { useDispatch } from 'react-redux';
import { customAlertMessage } from '../../../utils/utils';
import { closeLoading, openLoading } from '../../../redux/store/slice/loading';
import { ClassListType } from '../../../component/Select/CreateSearchSelect';
import { setIteration } from '../../../redux/store/slice/currentIteration';
import { useParams } from 'react-router-dom';


export type ClassList = {
  [key: string]: string;
}


type DialogsProps = {
  openUploadDialog: boolean;
  setOpenUploadDialog: (open: boolean) => void;
  anchorMoreButton: null | HTMLElement;
  handleMenuClose: () => void;
  activeIter: string;
  setActiveClassName: (data: string) => void;
  getIterListCallback: () => void;
  combinedClass: ClassListType[];
  searchValue: ClassListType | null;
  setSearchValue: (value: ClassListType | null) => void;
  handleInitData: (data: GetAllProjectsType) => void;
  datasetInfoApiCallback: (id: string) => void;
};

const DatasetDialogs = (props: DialogsProps) => {
  const { searchValue, setSearchValue, combinedClass, handleInitData, getIterListCallback, datasetInfoApiCallback, setActiveClassName, activeIter, anchorMoreButton, handleMenuClose, openUploadDialog, setOpenUploadDialog } = props;
  const { id: datasetId = '', type: dataType = '' } = useParams();
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const MoreMenu = useCallback(() => {
    return (
      <Menu style={{ top: anchorMoreButton?.offsetHeight }} anchorEl={anchorMoreButton} open={Boolean(anchorMoreButton)} onClose={handleMenuClose} >
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
          }}
        >{'Delete Iteration'}
        </MenuItem>
      </Menu>
    );
  }, [anchorMoreButton, handleMenuClose]);

  return (
    <>
      <MoreMenu />
      <CommonDeleteDialog
        open={openDeleteDialog}
        handleClose={() => {
          setOpenDeleteDialog(false);
        }}
        APIAttribute={{
          id: datasetId,
          name: activeIter,
        }}
        type="iteration"
        handleDeleteStart={() => {
          dispatch(openLoading());
        }}
        handleDeleteSuccess={() => {
          getAllProjectsAPI()
            .then(({ data }) => {
              handleInitData(data.data);
              dispatch(setIteration('workspace'));
              setActiveClassName('All');
              dispatch(createAlertMessage(customAlertMessage('success', 'Iteration Deleted')));
            })
            .catch((err) => console.log('DatasetDialog-getAllProjectsAPI-Error', err))
            .finally(() => {
              datasetInfoApiCallback(datasetId);
              getIterListCallback();
              dispatch(closeLoading())
            });
        }}
        handleDeleteFail={(err) => {
          console.log('Delete Iteration Fail:', err.response.data);
          dispatch(closeLoading());
          dispatch(createAlertMessage(customAlertMessage('error', 'Delete Project Fail')));
        }}
      />


      {openUploadDialog &&
        <UploadDialog
          open={openUploadDialog}
          handleClose={() => {
            setOpenUploadDialog(false);
          }}
          id={datasetId}
          dataType={dataType}
          datasetInfoApiCallback={datasetInfoApiCallback}
          handleInitData={handleInitData}
          setActiveClassName={setActiveClassName}
          setOpenUploadDialog={setOpenUploadDialog}
          combinedClass={combinedClass}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

      }

    </>
  );
};

export default DatasetDialogs;
