import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useCallback, useRef, useState } from 'react';
import { UploadableFile } from '../Dialogs/UploadDialog';
import { OverflowHide } from '../../pages/pageStyle';
import StyledTooltip from '../Tooltip';


export const FileWrapper = styled.div`
  width: 100%;
  height: 64px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const FileItem = styled.div<{ validFailed: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 64px;
  background-color: ${props => props.theme.color.base_2};
  border: 1px solid ${(props) => (props.validFailed ? props.theme.color.highlight_1 : props.theme.color.divider)}; ;
  border-radius: 12px;
  padding: 0 10px;
`

export const CustomCancelIcon = styled(CancelRoundedIcon)`
  color: ${props => props.theme.color.onColor_2};
  cursor: pointer;
  &:hover{
    color: ${props => props.theme.color.onColor_1};
  }
`

export const ProgressWrapper = styled.div`
  position:relative ;
  width: 100%;
  margin: 0 18px;
`;

export const FileName = styled(OverflowHide)`
  color: ${props => props.theme.color.onColor_2};
  width: 442px;
`;

type UploadFileItemProps = {
  currFile: UploadableFile;
  onDelete: (file: UploadableFile) => void;
  toRemove: (file: File) => void;
  progress: number;
};

export function isFileTypeCorrect(file: File, projectType: string) {
  if (projectType === 'classification') {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.bmp)$/i;
    if (allowedExtensions.exec(file.name)) return true;
    else return false;
  } else {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.bmp|\.txt)$/i;
    if (allowedExtensions.exec(file.name)) return true;
    else return false;
  }
}


const UploadFileItem = (props: UploadFileItemProps) => {
  const { currFile, onDelete, toRemove, progress } = props;
  const fileNameRef = useRef<any | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseOver() {
    setIsHovered(true);
  }

  function handleMouseOut() {
    setIsHovered(false);
  }


  //暫先取消cancel file的功能
  // const ifDone = useCallback(() => {
  //   if (currFile.progress === 100 || currFile.validColor) return <></>;
  //   else {
  //     return <CustomCancelIcon onClick={() => onDelete(currFile)} />;
  //   }
  // }, [currFile, onDelete])



  const isOverflowActive = useCallback((event: HTMLDivElement | null) => {
    if (event && isHovered) {
      if (event.offsetWidth < event.scrollWidth) return true;
      else return false;
    }
  }, [isHovered])


  return (
    <FileWrapper>
      <FileItem validFailed={currFile.validColor ?? false}>
        <InsertDriveFileRoundedIcon />
        <ProgressWrapper
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {isOverflowActive(fileNameRef.current) ?
            <StyledTooltip place='top' title={currFile.file.name}>
              <FileName
                ref={fileNameRef}
              >{currFile.file.name}</FileName>
            </StyledTooltip>
            :
            <FileName
              ref={fileNameRef}
            >{currFile.file.name}</FileName>
          }
          <ProgressBar value={progress} />
          {currFile.validColor ?? false ? <FileName style={{ fontSize: '13px' }}>{currFile.errMessage}</FileName> : <></>}
        </ProgressWrapper>
        {/* {ifDone()} */}
      </FileItem>
    </FileWrapper>
  );
}

export default UploadFileItem;

// 用這個寫法tooltip會有殘影，應是外層(UploadZone)還有z-index切換
//title={isOverflowActive(fileNameRef.current) ? currFile.file.name : ''}