import { useCallback, useEffect, useState } from "react";
import styled from 'styled-components';
import ProjectCard from '../../component/Card/ProjectCard';
import { getAllProjectsAPI, GetAllProjectsType } from "../../constant/API";
import { EmptyWrapper, ProjectContainer, StyledBtnRed, Title, Wrapper } from "../pageStyle";
import { allProjectsType, useAddProjectList } from "./hook/useAllProjects";
import CardPageDialogs from "./CardDialogs";
import AlertMessage from "../../component/AlertMessage";
import Loading from "../../component/Loading";
import { setIteration } from "../../redux/store/slice/currentIteration"
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "../../redux/store/slice/currentTab";
import { setHasIteration } from "../../redux/store/slice/hasIteration";
import { selectIsTraining } from "../../redux/store/slice/isTraining";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
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
  const [anchorMoreButton, setAnchorMoreButton] = useState<null | HTMLElement>(null);
  const [currentTarget, setCurrentTarget] = useState({
    id: '',
    name: '',
  });
  const handleMenuClose = useCallback(() => {
    setAnchorMoreButton(null);
  }, [setAnchorMoreButton]);


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
        {initData.sort((a, b) => a.createTime - b.createTime).map((info, index) => (
          <ProjectCard
            key={info.name && info.createTime ? info.name.concat(info.createTime.toString()) : index}
            data={info}
            setAnchorMoreButton={setAnchorMoreButton}
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
          <Title>All Project
            <StyledBtnRed onClick={() => { setOpenAddDialog(true) }}>Add</StyledBtnRed>
          </Title>
          {confirmInitData(initData)}
        </Wrapper>
      </ProjectContainer>

      <CardPageDialogs
        currentProject={currentTarget}
        anchorMoreButton={anchorMoreButton}
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
        handleMenuClose={handleMenuClose}
        handleInitData={handleInitData}
      />
    </>
  );
}

export default Projects;