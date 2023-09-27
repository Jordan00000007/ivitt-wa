import styled from 'styled-components';
import InputBase from '@mui/material/InputBase';



const StyledSelectInput = styled(InputBase) <{ error: boolean }>`
  width: 100%;
  height: 52px;
  border-radius: 6px;
  border: 1px solid #979CB580;
  border: 1px solid ${(props) => (props.error ? '#B00020' : '#979CB580')};
  background-color: ${props => props.theme.color.base_1};
  color: ${props => props.theme.color.onColor_1};
  font-size: ${props => props.theme.typography.body2};

  &:hover {
    border-color:${(props) => (props.error ? '#B00020' : props.theme.color.onColor_2)};
  }

  .MuiSvgIcon-root {
    color:  ${props => props.theme.color.onColor_2};
  }

  .MuiSelect-select {
    line-height: normal;
    display: flex;
    align-items: center;
  }

`;
export default StyledSelectInput;
