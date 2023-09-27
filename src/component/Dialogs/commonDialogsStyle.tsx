import styled from 'styled-components';
import { ButtonGray, ButtonRed } from '../Buttons/ButtonStyle';

export const Title = styled.div`
color: ${(props) => props.theme.color.onColor_1};
font-size: ${props => props.theme.typography.h2};
margin-bottom: 20px;
font-weight: 500;
`;

export const StyledButton = styled(ButtonGray)`
width: 100px;
height: 36px;
margin-right: 0;
margin-bottom: 0;
`;

export const StyledButtonRed = styled(ButtonRed)`
width: 100px;
height: 36px;
margin-right: 0;
margin-bottom: 0;
`;

export const ActionContainer = styled.div`
margin-top: auto;
display: flex;
justify-content: flex-end;
`;

export const TipText = styled.span`
  margin-bottom: 24px;
  color: ${(props) => props.theme.color.onColor_1};
  font-size: ${props => props.theme.typography.body1};
  letter-spacing: 0px;
`;