import styled from 'styled-components';
import StyledTooltip from '../Tooltip';
import SliderSidebar from './SliderSidebar';
import { useDispatch, useSelector } from "react-redux";
import { selectIteration, setIteration } from "../../redux/store/slice/currentIteration"
import { useContext } from 'react';
import { MainContext } from '../../pages/Main';
import { selectDisableBtn } from '../../redux/store/slice/disableBtn';


export const Container = styled.div`
  position: fixed;
  top: 56px;
  left:0;
  z-index: 90;
  display: flex;  
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 48px;
  min-height: 100vh;
  background-color: ${props => props.theme.color.base_2};
  color: ${props => props.theme.color.base_2};
  border-right: 2px solid ${props => props.theme.color.onColor_2}40;

  &.hide{
    display: none;
    visibility: hidden;
  }
`;


export const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 9px;
  text-align: center;
  background-color: transparent;
  color: ${props => props.theme.color.onColor_2};
  font-size: 16px;
  height: 48px;
`;

export const Pg = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? props.theme.color.highlight_1 : 'transparent')};
  color: ${(props) => (props.active ? props.theme.color.base_2 : props.theme.color.onColor_2)};
  font-size: 16px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 11px;
  cursor: pointer;
  padding-top: 3px;

  &.customDisabled{
    cursor: not-allowed;
  }

  &:hover{
    color: ${(props) => props.theme.color.base_2};
    background-color: ${(props) => props.theme.color.highlight_1};
  }

  &:disabled{
    cursor: not-allowed;
    background-color: ${props => props.theme.color.base_2};
    color: ${(props) => (props.theme.color.onColor_2)};
  }
`;


export type SidebarProps = {
  sidebarList: string[];
  currentTab: string;
};

const Sidebar = (props: SidebarProps) => {
  const { sidebarList, currentTab } = props;
  const dispatch = useDispatch();
  const activeIter = useSelector(selectIteration).iteration;
  const disableBtn = useSelector(selectDisableBtn).disableBtn;
  const { setActiveClassName } = useContext(MainContext);

  const datasetCondition = currentTab === 'Dataset' && sidebarList.length > 5;
  const modelCondition = currentTab === 'Model' && sidebarList.length > 6;

  if (datasetCondition || modelCondition) return (
    <SliderSidebar
      currentTab={currentTab}
      sidebarList={sidebarList}
      setActiveClassName={setActiveClassName}
    />
  )


  return (
    <>
      <Container className={currentTab === 'Label' ? 'hide' : ''}>
        {currentTab === 'Dataset' ?
          <ButtonWrap>
            <StyledTooltip place={'right'} title={disableBtn ? '' : 'Workspace'}>
              <Pg
                active={activeIter === 'workspace'}
                onClick={() => { setActiveClassName('All'); dispatch(setIteration('workspace')); }}
                className={disableBtn ? 'customDisabled' : ''}
              >W</Pg>
            </StyledTooltip>
          </ButtonWrap>
          : <></>
        }
        {sidebarList.map((item, index) => (
          <ButtonWrap key={item + index}>
            <StyledTooltip place={'right'} title={item}>
              <Pg
                active={activeIter === item}
                onClick={() => {
                  setActiveClassName('All');
                  dispatch(setIteration(item));
                }}
                disabled={disableBtn}
              >{index + 1}</Pg>
            </StyledTooltip>
          </ButtonWrap>
        ))}
      </Container>
    </>
  );
};

export default Sidebar;
