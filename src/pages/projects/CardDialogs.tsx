import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AddProjectDialog, CommonDeleteDialog, CommonRenameDialog } from '../../component/Dialogs';
import Menu from '../../component/Menu';
import MenuItem from '../../component/Select/StyledMenuItem';
import { getAllProjectsAPI, GetAllProjectsType } from '../../constant/API';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { openLoading, closeLoading } from '../../redux/store/slice/loading'
import { customAlertMessage } from '../../utils/utils';


type CurrentType = {
  [key: string]: string
}

type DialogsProps = {
  openAddDialog: boolean;
  setOpenAddDialog: (open: boolean) => void;
  anchorMoreButton: null | HTMLElement;
  handleMenuClose: () => void;
  handleInitData: (data: GetAllProjectsType) => void;
  currentProject: CurrentType;
};

const CardPageDialogs = (props: DialogsProps) => {
  const { anchorMoreButton, handleMenuClose, openAddDialog, setOpenAddDialog, currentProject, handleInitData } = props;
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const dispatch = useDispatch();

  const MoreMenu = useCallback(() => {
    return (

      <Menu style={{ top: anchorMoreButton?.offsetHeight }} anchorEl={anchorMoreButton} open={Boolean(anchorMoreButton)} onClose={handleMenuClose} >
        <MenuItem
          onClick={() => {
            setOpenRenameDialog(true);
            handleMenuClose();
          }}
        >
          {'Rename'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
          }}
        >
          {'Delete'}
        </MenuItem>
      </Menu>
    );
  }, [anchorMoreButton, handleMenuClose]);



  return (
    <>
      <MoreMenu />
      <CommonRenameDialog
        open={openRenameDialog}
        handleClose={() => {
          setOpenRenameDialog(false);
        }}
        handleInitData={handleInitData}
        projectId={currentProject.id}
        currentProjectName={currentProject.name}
      />
      <CommonDeleteDialog
        open={openDeleteDialog}
        handleClose={() => {
          setOpenDeleteDialog(false);
        }}
        APIAttribute={{
          id: currentProject.id,
          name: currentProject.name,
        }}
        type="project"
        handleDeleteStart={() => {
          dispatch(openLoading())
        }}
        handleDeleteSuccess={() => {
          getAllProjectsAPI()
            .then(({ data }) => {
              handleInitData(data.data);
              dispatch(createAlertMessage(customAlertMessage('success', 'Project Deleted')))
            })
            .catch((err) => console.log('CardDialog-Delete-Error', err))
            .finally(() => dispatch(closeLoading()))
        }}
        handleDeleteFail={({ response }) => {
          console.log('Delete Project Fail:', response.data.message);
          dispatch(closeLoading());
          dispatch(createAlertMessage(customAlertMessage('error', 'Delete Project Fail')));
        }}
      />
      {openAddDialog &&
        <AddProjectDialog
          open={openAddDialog}
          handleClose={() => {
            setOpenAddDialog(false);
          }}
          handleInitData={handleInitData}
        />
      }
    </>

  );
};

export default CardPageDialogs;
