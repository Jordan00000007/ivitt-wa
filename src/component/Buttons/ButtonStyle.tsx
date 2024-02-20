import styled from 'styled-components';

export const ButtonRed = styled.button`
  color: ${props => props.theme.color.base_2};
  background-color: ${props => props.theme.color.highlight_1};
  font-size: ${props => props.theme.typography.body1};
  border: 0;
  margin: 16px;
  padding: 4px 10px 6px 10px;
  border-radius: 4px;
  width: fit-content;
  height: 32px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover{
    background-color: ${props => props.theme.color.highlight_2};
  }

  &:disabled {
    background-color: ${props => props.theme.color.divider};
    cursor: not-allowed;
    
    &:hover{
      background-color: ${props => props.theme.color.divider};
      background-color: ${props => props.theme.color.base2};
    }
  }

  &.hide {
    visibility: hidden;
    display: none;
    pointer-events: none;
  }

`;

export const ButtonOutline = styled(ButtonRed)`
  color: ${props => props.theme.color.highlight_1};
  background: ${props => props.theme.color.base_2};
  border: 1px solid ${props => props.theme.color.highlight_1};

  &:hover {
    background: ${props => props.theme.color.clearBtnHover};
  }

  &:disabled {
    color: ${props => props.theme.color.divider};
    border: 1px solid ${props => props.theme.color.divider};
    background: ${props => props.theme.color.base_2};
  }

 
`;

export const ButtonGray = styled(ButtonRed)`
  color: ${props => props.theme.color.onColor_1};
  background: ${props => props.theme.color.divider};

  &:hover{
    background: ${props => props.theme.color.grayBtnHover};
  }

  &:disabled {
    color: ${props => props.theme.color.base_2};
  }
`;

export const ButtonWhite = styled(ButtonRed)`
  color: ${props => props.theme.color.highlight_1};
  background-color: ${props => props.theme.color.base_2};
  border: 1px solid ${props => props.theme.color.highlight_1};

  &:hover{
    color: ${props => props.theme.color.base_2};
    background-color: ${props => props.theme.color.whiteBtnHover} ;
  }

  &:active {
    color: ${props => props.theme.color.base_2};
    background-color: ${props => props.theme.color.whiteBtnActive};
  }

  &:disabled {
    color: ${props => props.theme.color.base_2}60;
    background-color: ${props => props.theme.color.whiteBtnActive};
    &:hover{
      color: ${props => props.theme.color.base_2}60;
      background-color: ${props => props.theme.color.whiteBtnActive};
   }

  }
`;


export const ActiveRedGrayBtn = styled(ButtonRed) <{ active: boolean }>`
  width: 74px;
  height: 28px;
  font-size: ${props => props.theme.typography.body2};
  margin: 0;
  color: ${(props) => (props.active ? props.theme.color.base_2 : props.theme.color.onColor_2)}; 
  background: ${(props) => (props.active ? props.theme.color.highlight_1 : props.theme.color.base_3)}; 

  &:hover{
    background-color: ${(props) => (props.active ? props.theme.color.highlight_2 : props.theme.color.grayBtnHover)};
  }

  &:disabled {
    background: ${(props) => props.theme.color.base_3}; 
    cursor: not-allowed;
  }
`;

export const StopGrayButton = styled(ButtonRed)`
  width: 66px;
  height: 28px;
  color: ${props => props.theme.color.base_3};
  background: #FFFFFF3D;
  display: block;
  left:100%;
  right: 100%;


  &:hover {
    background: #FFFFFF66;
  }
`;
