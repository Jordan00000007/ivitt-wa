import styled from 'styled-components';
//Dialogs
export const Title = styled.div`
  color: ${(props) => props.theme.color.onColor_1};
  font-size: ${props => props.theme.typography.h2};
  letter-spacing: 0px;
`;
export const TipText = styled.span`
  height: 20px;
  margin-top: 24px;
  color: ${(props) => props.theme.color.onColor_1};
  font-size: ${props => props.theme.typography.h4};
  letter-spacing: 0px;
`;
export const Description = styled.span`
  color: ${(props) => props.theme.color.onColor_1};
  font-size: ${props => props.theme.typography.body1};
  padding-top: 24px;
`;


export const ActionContainer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
`;

//TabFilterDialog

export const TabTitle = styled(Title)`
  margin-bottom: 20px;
`;

export const CheckBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const CheckBoxList = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.color.divider};
  &:last-child {
    margin-bottom: 24px;
  }
`;

export const ListText = styled.div`
  margin: 12px;
`;




