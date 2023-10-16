import styled from 'styled-components';
import { LabelColor } from '../../component/Label/AnnotationLabel';
import { PhotoFrame } from '../dataset/datasetStyle';



export const Main = styled.div`
  display: flex;
  width: 1200px;
  height: 716px;
  border: 1px solid ${props => props.theme.color.divider};
  box-shadow: 0px 0px 4px #CACBD733;
`;

export const LabelBlock = styled.div`
  width: 75%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.theme.color.base_2};
`;

export const ClassBlock = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${props => props.theme.color.base_2};
`;

export const Class = styled.div`
  padding: 20px 24px;
  height: 20%;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.color.divider};
`;

export const Annotation = styled.div`
  width: 100%;
  padding: 20px 24px;
`;

export const EditBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  min-width: 5.4%;
  border-right: 1px solid ${props => props.theme.color.divider}60; 
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px 0;
  color: ${props => props.theme.color.onColor_1}; 
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover{
  color: ${props => props.theme.color.vivid_1}; 
  }
`;

export const LabelEditIcon = styled(Icon) <{ isActive: boolean }>`
  color: ${props => props.isActive ? props.theme.color.vivid_1 : props.theme.color.onColor_1}; 

  &.disabled{
  color: ${props => props.theme.color.divider}; 
  cursor: not-allowed;
  }

  &.active{
  color: ${props => props.theme.color.vivid_1}; 
  }

`;


export const PhotoDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;

`;

export const MainPhotoFrame = styled.div`
  width: 850px;
  height: 613px;
  position: relative;
  background-color: ${props => props.theme.color.base_3};
  border-left: 1px solid ${props => props.theme.color.divider};
  border-right: 1px solid ${props => props.theme.color.divider};
`;

export const MainPhoto = styled.img`
  height:auto;
  width:auto;
  max-height: 100%;
  max-width: 100%;

  position: absolute;  
  top: 0;  
  bottom: 0;  
  left: 0;  
  right: 0;  
  margin: auto;
  user-select: none;
  -webkit-user-drag: none;
  
`;

export const SliderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: calc(714px * 0.15);
  width: 850px;
  /* background-color: ${props => props.theme.color.divider}; */
  border: 1px solid ${props => props.theme.color.divider};
  background-color: #F8F8F8;
  position: relative;


`;

export const PhotosFrame = styled(PhotoFrame)`
  width: 70px;
  height: 70px;
`;

export const Photo = styled.img`
  width: auto;
  height: auto;
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
  user-select: none;

`;

export const EditButton = styled.button`
 width: 32px;
 height: 36px;
 border: none;
 border-radius: 6px;
 background-color: transparent;
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;

 &:hover{
  border: 1px solid ${props => props.theme.color.divider};
  color:${props => props.theme.color.highlight_1};
 }

 &:disabled{
  border: none;
  color:${props => props.theme.color.divider};
  cursor: not-allowed;
 }

`;

export const ArrowBtn = styled.span<{ type: string }>`
  position: absolute;
  top: calc(50% - 6px);
  height: 10px;
  width: 10px;
  background: transparent;
  border-top: 2px solid ${props => props.theme.color.onColor_2}50;
  border-right: 2px solid ${props => props.theme.color.onColor_2}50;
  z-index: 10;
  cursor: pointer;
  right: ${({ type }) => (type === "right" ? "-12px" : "unset")};
  left: ${({ type }) => (type === "left" ? "-12px" : "unset")};
  transform: ${({ type }) => (type === "left" ? "rotate(-135deg)" : "rotate(45deg)")};

  &.slick-next:before {
    content: '';
  }
  &.slick-prev:before {
    content: '';
  }
`;


//Edit class


export const ContentWrapper = styled.div`
  height: 392px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  /* width */
  *::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  *::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
    margin: 2px;
    border-radius: 10px;
    background: ${(props) => props.theme.color.divider}60;
    box-shadow: -1px 2px 2px ${(props) => props.theme.color.divider}50;
  }

  /* Handle */
  *::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.color.divider};
    border-radius: 10px;
  }
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`

export const StyledLabelColor = styled(LabelColor)`
  margin: 16px;
`

export const DeleteIcon = styled(Icon)`
  margin-left: 18px;
  margin-right: 18px;

  &.disabled {
    color: ${props => props.theme.color.divider};
    cursor: help;
  }
`

export const StyledCanvas = styled.canvas<{ cursorStyle: string }>`
  position: absolute; 
  -webkit-user-drag: none;
  user-select: none;
  z-Index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  cursor:  ${(props) => props.cursorStyle};

  &:focus {
    outline: none;
  }
`;
