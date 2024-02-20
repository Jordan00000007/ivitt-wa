import React, { useCallback, useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddProjectDialog, CommonDeleteDialog, CommonRenameDialog, CommonExportDialog } from '../../component/Dialogs';
import Menu from '../../component/Menu';
import MenuItem from '../../component/Select/StyledMenuItem';
import { getAllProjectsAPI, GetAllProjectsType } from '../../constant/API';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { openLoading, closeLoading } from '../../redux/store/slice/loading'
import { customAlertMessage } from '../../utils/utils';
import { selectHasIteration } from "../../redux/store/slice/hasIteration"

type CurrentType = {
    [key: string]: string
}

type DialogsProps = {
    openAddDialog: boolean;
    setOpenAddDialog: (open: boolean) => void;
    anchorMoreButton: null | HTMLElement;
    anchorMoreButtonGlobal: null | HTMLElement;
    handleMenuClose: () => void;
    handleInitData: (data: GetAllProjectsType) => void;
    currentProject: CurrentType;
    showExportItem: boolean;
    handleImportClick: ()=>void;
};

const CardPageDialogs = (props: DialogsProps) => {
    const { anchorMoreButton, anchorMoreButtonGlobal, handleMenuClose, openAddDialog, setOpenAddDialog, currentProject, handleInitData, showExportItem, handleImportClick } = props;
    const [openRenameDialog, setOpenRenameDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [openImportDialog, setOpenImportDialog] = useState(false);


    const hasIteration = useSelector(selectHasIteration).hasIteration;

    const dispatch = useDispatch();

    const MoreMenu = useCallback(() => {

        return (

            <>
                {
                    (anchorMoreButton !== null) &&
                    <Menu anchorEl={anchorMoreButton} open={Boolean(anchorMoreButton)} onClose={handleMenuClose} anchorReference="anchorEl" anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                    >

                        {
                            showExportItem &&
                            <MenuItem
                                onClick={() => {
                                    setOpenExportDialog(true);
                                    handleMenuClose();
                                }}

                            >
                                {'Export'}
                            </MenuItem>

                        }
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
                }

                {
                    (anchorMoreButtonGlobal !== null) &&
                    <Menu anchorEl={anchorMoreButtonGlobal} open={Boolean(anchorMoreButtonGlobal)} onClose={handleMenuClose} anchorReference="anchorEl" anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                    >
                        
                        <MenuItem
                            onClick={() => {
                                //setOpenImportDialog(true);
                                handleImportClick();
                                handleMenuClose();
                            }}
                        >
                            {'Import'}
                        </MenuItem>
                    </Menu>
                }
            </>
            

        );

    }, [anchorMoreButton, anchorMoreButtonGlobal, handleMenuClose, hasIteration]);



    return (
        <>
            <MoreMenu />
            <CommonExportDialog
                open={openExportDialog}
                handleClose={() => {
                    setOpenExportDialog(false);
                }}
                handleInitData={handleInitData}
                projectId={currentProject.id}
                currentProjectName={currentProject.name}
            />
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
