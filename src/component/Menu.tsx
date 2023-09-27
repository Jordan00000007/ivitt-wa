import styled from 'styled-components';
import Menu from '@mui/material/Menu';

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: ${props => props.theme.color.base_1};
  }
  /* width */
  *::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  /* Track */
  *::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.color.divider};
    box-shadow: -2px 3px 6px ${props => props.theme.color.divider};
  }

  /* Handle */
  *::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.color.base_1};
    border-radius: 10px;
    border: 4px solid transparent;
    background-clip: content-box;
  }
`;

StyledMenu.defaultProps = {
  variant: 'menu',
  keepMounted: true,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
};

export default StyledMenu;
