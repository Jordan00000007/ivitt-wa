import { useState, useCallback, MouseEvent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ProjectTag from '../ProjectTag'
import DataCard from './DataCard';
import MoreButton from '../Buttons/MoreButton';
import { OverflowHide } from '../../pages/pageStyle';
import StyledTooltip from '../Tooltip';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useNavigate } from 'react-router-dom';
import { allProjectsType } from '../../pages/projects/hook/useAllProjects';
import { convertUnit } from '../../utils/utils';
import { apiHost } from '../../constant/API/APIPath';

const Card = styled.div`
  width: 282px;
  height: 352px;
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.color.divider};
  border-radius: 12px;
  cursor: pointer;
  background: ${props => props.theme.color.base_2};
  &:hover{
     box-shadow: 1px 1px 8px #0000001A;
     border: 1px solid #16272E3D;
     
  }
`;

const ProjectName = styled(OverflowHide)`
  font-weight: 500;
  font-size: ${props => props.theme.typography.h4};
  max-width: 200px;
  cursor: default;
  text-transform: capitalize;
`

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2px;
`

const CoverPhotoFrame = styled.div`
  width: 250px;
  height: 170px;
  margin: 8px 0;
  position: relative;
`;

const CoverPhoto = styled.img`
  max-height: 100%;  
  max-width: 100%; 
  width: auto;
  height: auto;
  position: absolute;  
  top: 0;  
  bottom: 0;  
  left: 0;  
  right: 0;  
  margin: auto;
`;

const NoCoverPhoto = styled.div`
  width: 250px;
  height: 170px;
  margin: 12px 0;
  border: 1px solid ${props => props.theme.color.base_3};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.color.base_3};
  color: ${props => props.theme.color.onColor_2};
`;

export const NoImgIcon = styled(InsertPhotoOutlinedIcon)`
  stroke: #ffffff;
  stroke-width: 0.5;
  font-size: 36px !important;
`

const DataCardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

type ProjectCardProps = {
  data: allProjectsType;
  setAnchorMoreButton: (open: null | HTMLElement) => void;
  targetProject: (data: any) => void;
};


const ProjectCard = (props: ProjectCardProps) => {
  const { data, setAnchorMoreButton, targetProject } = props;
  const textRef = useRef<HTMLDivElement>(null);
  const [overflowActive, setOverflowActive] = useState(false);
  const navigate = useNavigate();

  const isOverflowActive = useCallback((event: HTMLDivElement | null) => {
    if (event) {
      return event.offsetWidth < event.scrollWidth;
    }
  }, []);

  const handleMoreButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setAnchorMoreButton(event.currentTarget);
    },
    [setAnchorMoreButton]
  );

  useEffect(() => {
    if (isOverflowActive(textRef.current)) {
      setOverflowActive(true);
      return;
    }
    setOverflowActive(false);
  }, [isOverflowActive]);

  return (
    <>
      <Card
        onClick={() => {
          navigate(`/main/${data.type}/${data.id}`);
        }}>
        <Head>
          <StyledTooltip place='top' title={overflowActive ? data.name : ''}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -8],
                  },
                },
              ],
            }}
          >
            <ProjectName ref={textRef}>{data.name}</ProjectName>
          </StyledTooltip>
          <MoreButton
            onClick={(e) => {
              handleMoreButtonClick(e);
              if (targetProject) targetProject(data);
            }}
          />
        </Head>
        <ProjectTag className={'blue'} text={data.platform} />
        <ProjectTag className={'green'} text={data.type} />
        {!data.coverImg ?
          <NoCoverPhoto><NoImgIcon /></NoCoverPhoto>
          : <CoverPhotoFrame>
            <CoverPhoto src={`${apiHost}${data.coverImg}`} />
          </CoverPhotoFrame>
        }
        <DataCardWrapper >
          <DataCard
            title={'Dataset'}
            singleNumber={false}
            dataset1={convertUnit(data.effectImgNum)}
            dataset2={convertUnit(data.totalImgNum)}
          />
          <DataCard title={'Model'} singleNumber={true} model={data.iteration} />
        </DataCardWrapper>
      </Card>
    </>
  );
};



export default ProjectCard;