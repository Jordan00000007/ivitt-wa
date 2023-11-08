import styled from 'styled-components';
import { ButtonGray, ButtonOutline, ButtonRed } from '../../component/Buttons/ButtonStyle';
import MoreButton from '../../component/Buttons/MoreButton';
import { StyledBtnRed } from '../pageStyle';
import { ReactComponent as Icon_Unselect } from '../../images/Icon_Unselect.svg'
import { ReactComponent as fill_white } from '../../images/fill_white.svg'
import { ReactComponent as fill_black } from '../../images/fill_black.svg'
import { FixedSizeList as List } from 'react-window';

export const Left = styled.div`
  width: 60%;
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  width: 696px;
`;

export const ControlBtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

export const StyledUploadBtn = styled(StyledBtnRed)`
  margin-left: 12px;
  padding: 5px 10px 4px 12px!important;
`;

export const StyledMoreButton = styled(MoreButton)`
  border: 1px solid ${props => props.theme.color.divider};
  background-color: ${props => props.theme.color.base_3};
  box-shadow: inset 0px 0px 10px #0000000F;


`;

export const PhotoContainer = styled.div`
  height: 692px;
 
 /* width */
  *::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  *::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
    margin: 2px;
    border-radius: 10px;
    background: ${(props) => props.theme.color.divider}60;
    box-shadow: -2px 3px 6px ${(props) => props.theme.color.divider}50;
  }

  /* Handle */
  *::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.color.divider};
    border-radius: 10px;
  }
`;

export const StyledList = styled(List)`
 /* Track */
  *::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
   display: none;
  }

  /* Handle */
  *::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    display: none;
  }

  
  &:hover{
  /* Track */
  *::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
   display: inherit;
  }

  /* Handle */
  *::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    display: inherit;
  }}
`;

export const PhotoFrame = styled.div<{ active: boolean }>`
  height: 129px;
  width: 129px;
  background: ${(props) => props.theme.color.base_3};
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 3px solid ${(props) => (props.active ? props.theme.color.highlight_1 : 'none')};


  &.addBlur{
    &::before {
         content: '';
         position: absolute;
         top: 0; 
         left: 0;
         right:0;
         bottom: 0;
         z-index: 1;
         background: #FFFFFF99;
        }
  }

   &:hover {
      &::before {
         content: '';
         position: absolute;
         top: 0; 
         left: 0;
         right:0;
         bottom: 0;
         z-index: 1;
         background: #FFFFFF66;
         border: 2px solid #FF1111;
        }
   } 
   
`;

export const Photo = styled.img`
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

//Select Photo

export const DeletePhotoContainer = styled.div`
  width: 464px;
  height: 300px;
  border: 1px solid ${(props) => props.theme.color.divider};
  border-radius: 12px;
  box-shadow: 0px 0px 4px #CACBD733;
  padding: 20px 24px;
  background-color: ${(props) => props.theme.color.base_2};
`;

export const DeletePhotoInner = styled.div`
  width: 416px;
  height: 120px;
  border: 1px solid #979CB580;
  border-radius: 6px;
  background-color: ${(props) => props.theme.color.base_1};
  box-shadow: 0px 0px 2px #979CB580;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 60px;
`;

export const SelectedTitle = styled.div`
  font-size: ${(props) => props.theme.typography.body1};
  color: ${props => props.theme.color.onColor_1};
  font-weight: 500;
`;

export const SelectedCount = styled.div`
  font-size: ${(props) => props.theme.typography.h4};
  color: ${props => props.theme.color.onColor_1};
  font-weight: 500;
`;

export const SelectCancelBtn = styled(ButtonGray)`
  margin: 0 12px 0 0;
  width: 80px;
  height: 32px;
`;

export const SelectDeleteBtn = styled(ButtonRed)`
  margin: 0;
  width: 80px;
  height: 32px;
`;

export const SelectAllBtn = styled(ButtonOutline)`
  margin: 0;
  padding:0;
  width: 101px;
  height: 28px;
  border: 2px solid ${props => props.theme.color.highlight_1};
  font-weight: 500;
`;



export const ButtonWrap = styled.button <{ show: boolean }>`
  position: absolute;
  top:0;
  right: 0;
  width: 129px;
  height: 129px;
  z-index: 15;
  border: none;
  cursor: pointer;
  background-color: rgba(0,0,0,0);
  visibility: ${(props) => props.show ? 'visible' : 'hidden'};
`;

export const SelectIcon = styled(fill_black) <{ selected: Boolean }>`
  color: ${props => props.theme.color.onColor_1};
  position: absolute;
  top:0;
  right: 0;
  z-index: 20;
  visibility: ${(props) => props.selected ? 'visible' : 'hidden'};
`;

export const HoverIcon = styled(fill_white) <{ show: string }>`
  position: absolute;
  top:0;
  right: 0;
  z-index: 15;
  visibility: ${(props) => props.show === 'true' ? 'visible' : 'hidden'};
`;

//RadioButtonUncheckedRoundedIcon  
export const EmptySelectIcon = styled(Icon_Unselect) <{ show: string }>`
  position: absolute;
  width: 32px;
  height: 32px;
  top:0;
  right: 0;
  z-index: 5;
  color: #E2E2E2;
  visibility: ${(props) => (props.show === 'true' ? 'visible' : 'hidden')};
`;

