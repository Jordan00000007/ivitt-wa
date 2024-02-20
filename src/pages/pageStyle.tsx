import styled from 'styled-components';
import { ButtonOutline, ButtonRed } from '../component/Buttons/ButtonStyle';


export const OverflowHide = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;


export const ProjectContainer = styled.div<{ noOverFlow: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  height: calc(100vh - 56px);
  width: 100%;
  overflow: ${(props) => (props.noOverFlow ? 'hidden' : 'auto')};
  font-family: 'Roboto', sans-serif;
  
  
    *::-webkit-scrollbar,
    &::-webkit-scrollbar {
        width: 14px;
    }

    *::-webkit-scrollbar-track,
    &::-webkit-scrollbar-track {
        //background-color: ${(props) => props.theme.color.divider}60;
        // box-shadow: -2px 3px 6px ${(props) => props.theme.color.divider}50;
        // border-left: 0px solid #16272E3D;
        // border-right: 0px solid #16272E3D;

    }

    *::-webkit-scrollbar-thumb,
    &::-webkit-scrollbar-thumb {
        background-color:  ${(props) => props.theme.color.divider};
        border: 4px solid transparent;
        border-radius: 100px;
        background-clip: content-box;
    }


  
  @media(max-width: 1366px){
    justify-content: flex-start;
    overflow-x: auto;
  }

  @media(max-height: 850px){
    overflow: auto;
  }
`;

export const SchedulerHeadContainer = styled.div<{ noOverFlow: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  height: 110px;
  width: 100%;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  border-bottom: 1px solid #16272E3D;
  background-color:#ffffff;
  
  @media(max-width: 1366px){
    justify-content: flex-start;
    overflow-x: auto;
  }

  @media(max-height: 850px){
    overflow: auto;
  }
`;

export const SchedulerHeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 24px 56px 0px 56px;
  position: relative;
  width: 1200px;
  height: 86px;
  
`;

export const SchedulerBodyContainer = styled.div<{ noOverFlow: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  height: calc(100vh - 166px);
  width: 100%;
  overflow: ${(props) => (props.noOverFlow ? 'hidden' : 'auto')};
  font-family: 'Roboto', sans-serif;
  
  @media(max-width: 1366px){
    justify-content: flex-start;
    overflow-x: auto;
  }

  @media(max-height: 850px){
    overflow: auto;
  }
`;

export const SchedulerBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 36px 56px;
  position: relative;
  width: 1200px;
  
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 34px 56px;
  position: relative;
  width: 1200px;
  
`;

export const MainWrapper = styled(Wrapper)`
  margin: 16px 56px 8px 56px;

  @media(max-width: 1366px){
      margin-left: 102px;
  }
`;

export const Title = styled.div`
  color: ${props => props.theme.color.onColor_1};
  font-size: ${props => props.theme.typography.h2};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  width: 1200px;
  font-weight: 500;
  margin-bottom: 12px;
  position: relative;
`;

export const StyledBtnRed = styled(ButtonRed)`
  width: 80px;
  height: 32px;
  margin: 0;
  /* @media(max-width: 1286px){
    margin-left:700px;
  } */
`;

export const StyledBtnOutline = styled(ButtonOutline)`
  font-weight: 500;
  width: 80px;
  height: 32px;
  margin: 0;
  border: 2px solid ${props => props.theme.color.highlight_1};

`;

export const Right = styled.div`
  width: 40%;
  display: flex;
  justify-content: flex-end;
`;

export const RightCardWrapper = styled.div`
  display: flex;
  justify-content: center;

  &.hide{
    display: none;
    visibility: hidden;
  }
`;

export const RightCardsBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 464px;
  height: 464px;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.color.divider};
  background-color: ${props => props.theme.color.base_2};
`;

export const SubTitle = styled(Title)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: ${props => props.theme.typography.h4};
`;

export const EvaluateBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height:100%;
  border: 1px solid ${props => props.theme.color.divider};
  background-color: ${props => props.theme.color.base_3};
  box-shadow: inset 0px 0px 10px #0000000F;
  border-radius: 6px;
`;

export const EmptyDatasetImgContainer = styled(RightCardsBlock)`
  width: 696px;
  height: 692px;
  background-color: ${props => props.theme.color.base_1};
  border-radius:0;
  color: ${props => props.theme.color.onColor_2};
  align-items: center;
  justify-content: center;
`;

export const EmptyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 56px);
  color: ${props => props.theme.color.highlight_1};
`;

export const EmptyText = styled.div`
  color: ${props => props.theme.color.onColor_2};
  font-size:  ${props => props.theme.typography.body_1};
  font-weight: 500;
  margin-bottom: 12px;
`;

export const UploadLabel = styled.label`
  color: ${props => props.theme.color.base_2};
  background-color: ${props => props.theme.color.highlight_1};
  font-size: ${props => props.theme.typography.body1};
  border: 0;
  margin: 0px;
  padding: 6px 10px;
  border-radius: 6px;
  width: 80px;
  height: 32px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover{
    background-color: ${props => props.theme.color.highlight_2};
  }

  &.disabled {
    background-color: ${props => props.theme.color.divider};
    cursor: not-allowed;
    
    &:hover{
      background-color: ${props => props.theme.color.divider};
      background-color: ${props => props.theme.color.base2};
    }
  }

`;

export const PreviewImgContainer = styled(EvaluateBox)`
  width: 416px;
  min-height: 270px;
  margin-bottom: 20px;
  position: relative;
  color: ${props => props.theme.color.onColor_2};
  background-color:  ${props => props.theme.color.base_3};
`;

export const PreviewImg = styled.img`
  max-height: 99.5%;  
  max-width: 100%; 
  width: auto;
  height: auto;
  position: absolute;  
  top: 0;  
  bottom: 0;  
  left: 0;  
  right: 0;  
  margin: auto;
  user-select: none;
`;




