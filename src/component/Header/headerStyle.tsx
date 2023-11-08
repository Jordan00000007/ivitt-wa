import styled from 'styled-components';
import { OverflowHide } from '../../pages/pageStyle';
import { ButtonWhite } from '../Buttons/ButtonStyle';



export const Container = styled.header`
  width: 100%;
  height: 56px;
  background-color: ${props => props.theme.color.highlight_1};
  color: ${props => props.theme.color.base_2};
  position: sticky;
  top:0;
  left:0;
  z-index: 100;
  display: flex;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  overflow-x: auto;
  overflow-y: hidden;

  /* width */
  *::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 0;
    height: 0px;
  }
`;

export const ContainerLabel = styled.header`
  width: 100%;
  height: 56px;
  background-color: ${props => props.theme.color.highlight_1};
  color: ${props => props.theme.color.base_2};
  top:0;
  left:0;
  z-index: 100;
 
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex; 
  justify-content: space-between;
  padding-right:20px;


  /* width */
  *::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 0;
    height: 0px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  width: 1200px;
  max-width: 1200px;
  height: 56px;
  background-color: ${props => props.theme.color.highlight_1};

  @media(max-width: 1366px){
    left: 60px;
    position: absolute;
  }
  
`;

export const HeaderContentLabel = styled.div`
  display: flex; 
  justify-content: flex-start;
  align-items: center;
  height: 56px;
  background-color: ${props => props.theme.color.highlight_1};
  
`;

export const Logo = styled.img`
  width: 168px;
  cursor: pointer;
  margin-right: 10px;
  margin-left: 0px;

  @media(max-width: 1366px){
     margin-left: -0.5rem;
  }
`;

export const LogoLabel = styled.img`
  width: 168px;
  cursor: pointer;
  margin-right: 10px;
  margin-left: 0px;

`;

export const TitleWrapper = styled.div`
  width: 200px;
  height: 56px;
  margin-right: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

`;

export const TitleWrapperLabel = styled.div`
  width: 200px;
  height: 56px;
  margin-right: 24px;
  display: flex;
  justify-content: start;
  align-items: center;

`;

export const FullTitleWrapper = styled(TitleWrapper)`
  width: fit-content;
  min-width: 200px;
`;

export const FullTitleWrapperLabel = styled(TitleWrapperLabel)`
  width: fit-content;
  min-width: 200px;
`;

export const Title = styled(OverflowHide)`
  display: inline-block;
  width: 200px;
  height: fit-content;
  font-size: ${props => props.theme.typography.h4};
  cursor: default;
  text-transform: capitalize;
  text-align: center;
`;

export const TitleLabel = styled(OverflowHide)`
  display: inline-block;
  width: 200px;
  height: fit-content;
  font-size: ${props => props.theme.typography.h4};
  cursor: default;
  text-transform: capitalize;
  text-align: left;
`;

export const MarqueeTitle = styled(OverflowHide)`
  width: fit-content;
  font-size: ${props => props.theme.typography.h4};
  margin-right: 180px;
  cursor: default;
  text-transform: capitalize;
`;

export const FullTitle = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  font-size: ${props => props.theme.typography.h4};
  cursor: default;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  overflow: visible;
`;

export const FullTitleLabel = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  font-size: ${props => props.theme.typography.h4};
  cursor: default;
  color:'yellow';
  justify-content: start;
  align-items: center;
  text-transform: capitalize;
  overflow: visible;
`;

export const FullTitleLabel2 = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  font-size: ${props => props.theme.typography.h4};
  cursor: cursor;
  color:'yellow';
  justify-content: start;
  align-items: center;
  text-transform: capitalize;
  overflow: visible;
`;


export const StyledBtnWhite = styled(ButtonWhite)`
  width: 80px;
`;


export const AlignWrapper = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

export const BackButton = styled.div`
  width:80px;
  position:absolute;
  height:32px;
  top:13px;
  left:-78px;
  background-color:#FFFFFF4D;
  color:white;
  border-radius:5px;
  padding-left:22px;
  padding-top:6px;
  cursor:pointer;
  &:hover {
    background-color:#FFFFFF5D;
  }
`;