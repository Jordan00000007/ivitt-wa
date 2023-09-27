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

export const Logo = styled.img`
  width: 168px;
  cursor: pointer;
  margin-right: 10px;
  margin-left: -2.8rem;

  @media(max-width: 1366px){
     margin-left: -0.5rem;
  }
`;

export const TitleWrapper = styled.div`
  width: 200px;
  height: 56px;
  margin-right: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

`;

export const FullTitleWrapper = styled(TitleWrapper)`
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



export const StyledBtnWhite = styled(ButtonWhite)`
  width: 80px;
`;


export const AlignWrapper = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;