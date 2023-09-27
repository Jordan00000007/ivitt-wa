import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab, selectCurrentTab } from "../../redux/store/slice/currentTab"
import { selectHasIteration } from "../../redux/store/slice/hasIteration"
import { selectDisableBtn } from '../../redux/store/slice/disableBtn';
const ButtonGroup = styled.div`
  width: 200px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;

`;

const StyledButtonLeft = styled.button<{ active: boolean }>`
  cursor: pointer;
  background-color: ${(props) => (props.active ? props.theme.color.base_2 : props.theme.color.highlight_1)};
  color: ${(props) => (props.active ? props.theme.color.highlight_1 : props.theme.color.base_2)};
  font-size: ${props => props.theme.typography.body1};
  width: 100px;
  height: 100%;
  border: 2px solid ${props => props.theme.color.base_2};
  border-top-left-radius: 11px;
  border-bottom-left-radius: 11px;
  border-top-right-radius:0px;
  border-bottom-right-radius:0px;
  border-right: 1px solid ${props => props.theme.color.base_2};
  margin: 0;
  font-family: 'Roboto', sans-serif;

  &:disabled{
    cursor: not-allowed;
  }
`;

const StyledButtonRight = styled(StyledButtonLeft)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  border-left: 1px solid ${props => props.theme.color.base_2};
  border-right: 2px solid ${props => props.theme.color.base_2};
`;


const SwitchButtonGroup = () => {
  const dispatch = useDispatch();
  const active = useSelector(selectCurrentTab).tab;
  const hasIteration = useSelector(selectHasIteration).hasIteration;
  const disableBtn = useSelector(selectDisableBtn).disableBtn;

  return (
    <ButtonGroup >
      <StyledButtonLeft
        active={active === "Dataset"}
        onClick={() => {
          dispatch(setCurrentTab("Dataset"));
        }}>
        Dataset
      </StyledButtonLeft>
      <StyledButtonRight
        disabled={!hasIteration || disableBtn}
        active={active === "Model"}
        onClick={() => {
          dispatch(setCurrentTab("Model"));
        }}>
        Model
      </StyledButtonRight>
    </ButtonGroup>
  );
};

export default SwitchButtonGroup;
