import { useCallback, useEffect, useState, MouseEvent, useContext, useRef } from "react";
import styled from 'styled-components';
import ProjectCard from '../../component/Card/ProjectCard';
import { getAllProjectsAPI, GetAllProjectsType,importAPI } from "../../constant/API";
import { apiHost, socketHost } from "../../constant/API/APIPath";
import { EmptyWrapper, ProjectContainer, StyledBtnRed, Title, Wrapper } from "../pageStyle";
import { allProjectsType, useAddProjectList } from "./hook/useAllProjects";
import CardPageDialogs from "./CardDialogs";
import AlertMessage from "../../component/AlertMessage";
import Loading from "../../component/Loading";
import CustomWebSocket from "../../component/CustomWebSocket";
import CustomToast from "../../components/Alerts/CustomToast";
import { setIteration } from "../../redux/store/slice/currentIteration"
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "../../redux/store/slice/currentTab";
import { setHasIteration } from "../../redux/store/slice/hasIteration";
import { selectIsTraining } from "../../redux/store/slice/isTraining";
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';



import MoreButtonGlobal from '../../component/Buttons/MoreButtonGlobal';


const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top:12px;
`;

const EmptyText = styled.div`
  color: ${props => props.theme.color.onColor_1};
  font-size:  ${props => props.theme.typography.h2};
  font-weight: 500;
`;

const EmptyTextSub = styled.div`
  color: ${props => props.theme.color.onColor_2};
  font-size:  ${props => props.theme.typography.h5};
  font-weight: 500;
`;



export type ProjectsPropsType = {
    noInitData: boolean;
    initData: allProjectsType[],
    handleInitData: (data: GetAllProjectsType) => void;
};

function Projects(props: ProjectsPropsType) {
    const dispatch = useDispatch();
    const { initData, handleInitData, noInitData } = props;
    const trainingStatus = useSelector(selectIsTraining).isTraining;

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [showExportItem, setShowExportItem] = useState(false);
    const [anchorMoreButton, setAnchorMoreButton] = useState<null | HTMLElement>(null);
    const [anchorMoreButtonGlobal, setAnchorMoreButtonGlobal] = useState<null | HTMLElement>(null);
    const [currentTarget, setCurrentTarget] = useState({
        id: '',
        name: '',
    });

    const linkRef=useRef<HTMLAnchorElement>(null);
    const fileRef=useRef<HTMLInputElement>(null);
    const toastRef=useRef<any>(null);

    const handleMenuClose = useCallback(() => {
        setAnchorMoreButton(null);
        setAnchorMoreButtonGlobal(null);
    }, [setAnchorMoreButton, setAnchorMoreButtonGlobal]);

    const handleImportClick = useCallback(() => {

        console.log('handle import click');

        if (fileRef.current)  fileRef.current.click();


    }, []);

    // type FileEvent = ChangeEvent<HTMLInputElement> & {
    //     target: EventTarget & { files: FileList };
    //   };

    const handleFileChange= useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (event) => {
       
            

        if (event.currentTarget.files) {

            // dispatch(resetFileName());

            const file = event.currentTarget.files[0];

            
            const formData = new FormData();
            console.log('--- file name ---');
            console.log(event.currentTarget.files[0]);
            formData.append('custom_name ', event.currentTarget.files[0]);
           

            // dispatch(openLoading())
            importAPI(formData)
                .then(({data}) => {
    
                    console.log('import result')
                    console.log(data)
                    //dispatch(createAlertMessage(customAlertMessage('convert', 'Import task start')));
                    //toastRef.current.setMessage(0,'aaa','aaa')
       
                })
                .catch(({ response }) => {
                    dispatch(createAlertMessage(customAlertMessage('error', response.data.message ? response.data.message : 'Internal server error')));
    
                })
                .finally(() => {
                   // dispatch(closeLoading());
                   if (fileRef.current) fileRef.current.value="";
                })
           

        }


    }, []);

    const handleMoreButtonGlobalClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
            setAnchorMoreButtonGlobal(event.currentTarget);
        },
        [setAnchorMoreButtonGlobal]
    );

    const handleRefreshPage =() =>{

        getAllProjectsAPI()
        .then(({ data }) => {
            handleInitData(data.data);
            
        })
        .catch((err) => console.log('getAllProjectsAPI-Error', err))
       

    }

    const handleExportMessage=(myType:number,myMessage:string,myId:string)=>{

        if (toastRef.current) toastRef.current.setMessage(myType,myMessage,myId)

    }

    const handleImportMessage=(myType:number,myMessage:string,myId:string)=>{

        if (toastRef.current) toastRef.current.setMessage(myType,myMessage,myId)

    }

    const handleFileDownload = (myFileName: string, myUrl: string) => {

        console.log('handle file download', myFileName)

        const link = document.createElement('a');
        link.href = myUrl;
        link.setAttribute(
            'download',
            myFileName,
        );
        // Append to html link element page
        document.body.appendChild(link);
        link.click();
        link.remove();

      

    }

    useEffect(() => {
        dispatch(setIteration('workspace'));
        dispatch(setCurrentTab("Dataset"));
        dispatch(setHasIteration(false));
        // dispatch(setClassAndNumber({}));
    }, [dispatch]);

    useEffect(() => {
        //因為是在model的hook改成done的，離開model頁面就不會改，就不會觸發拉資料，改成doing是在一train就會改
        //當再度回到projects這頁就會觸發
        //原本在main寫的延遲觸發也不需要了，因為重新進來就會重拉資料了
        if (trainingStatus === 'doing' || trainingStatus === 'done' || trainingStatus === 'stop') {
            getAllProjectsAPI()
                .then(({ data }) => {
                    handleInitData(data.data);
                })
                .catch(({ response }) => {
                    console.log('DatasetDialog-getAllProjectsAPI-Error', response.data)
                })
        }
    }, [handleInitData, trainingStatus]);

    const confirmInitData = (initData: allProjectsType[]) => {
        const checkList = initData?.length === 0;

        if (checkList) return (
            <EmptyWrapper>
                <EmptyText>Ready to start your AI journey?</EmptyText>
                <EmptyTextSub>Click "Add" at the top right to create your AI project.</EmptyTextSub>
            </EmptyWrapper>
        )

        else return (
            <CardWrapper>
                {initData.sort((a, b) => b.createTime - a.createTime ).map((info, index) => (
                    <ProjectCard
                        key={info.name && info.createTime ? info.name.concat(info.createTime.toString()) : index}
                        data={info}
                        setAnchorMoreButton={setAnchorMoreButton}
                        setShowExportItem={setShowExportItem}
                        targetProject={(data) => {
                            setCurrentTarget({
                                id: data.id,
                                name: data.name,
                            })
                        }} />
                ))}
            </CardWrapper>
        )
    };



    //如果API或network問題要顯示
    if (noInitData) return (
        <EmptyWrapper>
            <ErrorOutlineIcon sx={{ fontSize: '64px' }} />
            <EmptyText>Network or server problem occurs.</EmptyText>
        </EmptyWrapper>
    );

    if (initData.length === 0) return <></>;

    return (
        <>
            <ProjectContainer noOverFlow={false}>
                <Wrapper>
                    <AlertMessage />
                    <Loading />
                    <Title>
                        <div style={{position:'relative',width:128,height:38}}>
                            <div style={{position:'absolute',left:-3,top:0,fontFamily:'Roboto Medium',width:126,height:36,letterSpacing:'normal'}}>
                                All Projects
                            </div> 
                        </div>
                        
                        <div style={{ width: 120 }} className="d-flex flex-row justify-content-end gap-2">
                            <MoreButtonGlobal
                                onClick={(e) => {
                                    console.log('more button global click...')
                                    handleMoreButtonGlobalClick(e);

                                    //if (targetProject) targetProject(data);
                                }}
                            />
                            <StyledBtnRed onClick={() => { setOpenAddDialog(true) }}>Add</StyledBtnRed>
                        </div>
                    </Title>
                    {confirmInitData(initData)}
                </Wrapper>
            </ProjectContainer>

            <CardPageDialogs
                currentProject={currentTarget}
                anchorMoreButton={anchorMoreButton}
                anchorMoreButtonGlobal={anchorMoreButtonGlobal}
                openAddDialog={openAddDialog}
                setOpenAddDialog={setOpenAddDialog}
                handleMenuClose={handleMenuClose}
                handleInitData={handleInitData}
                showExportItem={showExportItem}
                handleImportClick={handleImportClick}
            />

            <CustomWebSocket onSuccess={handleRefreshPage} onExportMessage={handleExportMessage} onImportMessage={handleImportMessage}></CustomWebSocket>
            <input type="file" name="files" onChange={handleFileChange} ref={fileRef} style={{ visibility: 'hidden', width: '0px', height: '0px' }} />
            <CustomToast ref={toastRef}></CustomToast>
                                
        </>
    );
}

export default Projects;