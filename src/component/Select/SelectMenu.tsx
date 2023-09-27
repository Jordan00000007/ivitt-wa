import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from 'styled-components';
import StyledMenuItem from './StyledMenuItem'
import StyledSelectInput from './StyledSelectInput';


export const MenuItemStyled = styled(StyledMenuItem)`
  font-size: ${props => props.theme.typography.body2};
  color: ${props => props.theme.color.onColor_2};
  padding-left: 4px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  margin-bottom: 18px;
`;

export const MenuItemText = styled.span`
  padding-left: 12px;
  height: 100%;
  text-transform: capitalize;

  &.noCapitalize{
    text-transform: none;
  }
  `;

export const PlaceholderText = styled(MenuItemText)`
  color: ${props => props.theme.color.onColor_2};
`;

const StyledLabel = styled.label`
  font-size: ${props => props.theme.typography.body2};
  color: ${props => props.theme.color.onColor_2};
`;

export type SelectMenuProps = {
  name: string;
  value: string;
  menuItemArray: Array<string> | number[];
  handleChange?: (event: SelectChangeEvent<string>) => void;
  labelName?: string;
  defaultValue?: string;
  children?: JSX.Element;
  error?: boolean;
};


const SelectMenu = (props: SelectMenuProps) => {
  const { children, value, menuItemArray, handleChange, name, labelName, defaultValue, error = false } = props;

  return (
    <Wrapper>
      <StyledLabel htmlFor="explicit-label-name">{labelName}</StyledLabel>
      <Select
        MenuProps={{
          // 點開的menu的底色, backgroundColor: Base 1,selected:divider
          PaperProps: {
            sx: {
              backgroundColor: '#FAFAFD',
              "&& .Mui-selected": {
                backgroundColor: "#E0E1E6  !important"
              },
              "&& .MuiMenuItem-root:hover": {
                backgroundColor: "#E0E1E6"
              },
            },
          },
        }}
        displayEmpty
        onChange={handleChange}
        name={name}
        value={value}
        defaultValue={defaultValue}
        input={<StyledSelectInput error={error} />}
        renderValue={value => value ? <MenuItemText>{value}</MenuItemText> : <PlaceholderText>-- Please select --</PlaceholderText>}
      >
        {menuItemArray.map((item) => (
          <MenuItemStyled key={item} value={item} >
            {item === 'iCAP' ?
              <MenuItemText className='noCapitalize'>{item}</MenuItemText>
              :
              <MenuItemText>{item}</MenuItemText>
            }
          </MenuItemStyled>
        ))}
        {children}
      </Select>
    </Wrapper>
  );
};

export default SelectMenu;
