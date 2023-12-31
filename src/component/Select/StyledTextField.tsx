import styled from 'styled-components';
import TextField from '@mui/material/TextField';


const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    height: '52px',
    border: '1px solid #C4C4C4',
    "& > fieldset": { border: "0px solid #B00020" },
  },
  "& .MuiOutlinedInput-root:hover": {
    "& > fieldset": { borderColor: "#979CB5" },
    border: '1px solid #979CB5',
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    "& > fieldset": { border: "0px solid #979CB5" },
    border: '1px solid #979CB5',
  },
  "& .MuiOutlinedInput-root.Mui-Error": {
    "& > fieldset": { border: "1px solid #B00020" },
  },
 
  "& .MuiAutocomplete-popupIndicator:hover": {
    backgroundColor: 'transparent'
  },
  "& .MuiButtonBase-root.MuiAutocomplete-popupIndicator": {
    backgroundColor: 'transparent',
    disableRipple: 'true',
  },
  "& .MuiAutocomplete-clearIndicator:hover": {
    backgroundColor: 'transparent'
  },
  
}));



export default StyledTextField;
