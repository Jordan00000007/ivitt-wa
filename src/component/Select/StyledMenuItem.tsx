import styled from 'styled-components';
import MenuItem from '@mui/material/MenuItem';

type Size = 'small' | 'large';

const getItemHeight = (size: Size) => {
  if (size === 'small') return '32px';

  if (size === 'large') return '40px';
};

type MenuItemProps = {
  size?: Size;
  disabled?: boolean;
};


const StyledMenuItem = styled(MenuItem) <MenuItemProps>`
  font-size: ${props => props.theme.typography.body2};
  color: ${props => props.theme.color.onColor_2};
  padding-left: 4px;
  height: ${(props) => getItemHeight(props.size || 'small')};
  min-width: 128px;
  min-height: auto;
  margin-top: 24px;

  &.Mui-selected,
  &.Mui-selected:hover,
  &:hover {
    background-color: ${props => props.theme.color.base_3}; 
  }
  &:active,
  &.Mui-selected:active {
    background-color: ${props => props.theme.color.base_3};
  }
`;



export default StyledMenuItem;
