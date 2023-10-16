import styled from 'styled-components';
import DownloadingSharpIcon from '@mui/icons-material/DownloadingSharp';

const getBorderColor = (props: any) => {
  if (props.isDragAccept || props.isDragActive) {
    return "#57B8FF";
  }
  if (props.isDragReject) {
    return "#E61F23";
  }
  if (props.isFocused) {
    return "#57B8FF";
  }
  return "#979CB580";
};

const getBackgroundColor = (props: any) => {
  if (props.isDragAccept || props.isFocused || props.isDragActive) {
    return "#57B8FF14";
  }
  return "#FAFAFD";
};

export const DropContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed ${(props) => getBorderColor(props)};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => getBackgroundColor(props)};
  color: ${props => props.theme.color.onColor_1};
  padding: 14px 16px;
  overflow: auto;

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

export const FileItemContainer = styled(DropContainer)`
  justify-content: flex-start;
  overflow-x: hidden;
`;


export const CustomIcon = styled(DownloadingSharpIcon)`
  transform: scaleY(-1);
  stroke: #ffffff;
  stroke-width: 0.5;
  margin-bottom: 10px;
`

export const Description = styled.div`
  margin-top: 4px;
  font-size: ${props => props.theme.typography.body1};
  height: 24px;
`

export const Note = styled.div`
  margin-top: 4px;
  font-size: ${props => props.theme.typography.body1};
  color: #979CB5;
  height: 24px;
`

export const CustomSpan = styled.label`
  display: inline-block; 
  margin-left: 6px;
  color: ${props => props.theme.color.highlight_1};
  border: none;
  background: none;
  font-size: ${props => props.theme.typography.body1};

  &:hover{
    color: ${props => props.theme.color.highlight_2};
    border-bottom: 1px solid ${props => props.theme.color.highlight_2};
    cursor: pointer;
  }
`