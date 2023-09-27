import Slider from "react-slick";
import styled from "styled-components";
import StyledTooltip from "../Tooltip";
import { ButtonWrap, Container, Pg } from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { selectIteration, setIteration } from "../../redux/store/slice/currentIteration"
import { ArrowBtn } from "../../pages/dataset/components/SliderCard";

const VerArrowBtn = styled(ArrowBtn) <{ type: string }>`
  top: ${({ type }) => (type === "top" ? "-16px" : "102%")};
  right: 0;
  left: calc(50% - 5px);
  transform: ${({ type }) => (type === "top" ? "rotate(-45deg)" : "rotate(135deg)")};
`;


export type SliderSidebarProps = {
  sidebarList: string[];
  setActiveClassName: (data: string) => void;
  currentTab: string;
};


const SliderSidebar = (props: SliderSidebarProps) => {
  const { sidebarList, currentTab, setActiveClassName } = props;
  const dispatch = useDispatch();
  const activeIter = useSelector(selectIteration).iteration;

  const settings = {
    vertical: true,
    verticalSwiping: false,
    infinite: false,
    arrows: true,
    slidesToShow: 6,
    slidesToScroll: 6,
    prevArrow: <VerArrowBtn type='top' />,
    nextArrow: <VerArrowBtn type='bottom' />,
  };

  return (
    <Container className={currentTab === 'Label' ? 'hide' : ''}>
      <Slider {...settings}>
        {currentTab === 'Dataset' ?
          <ButtonWrap className='Dataset'>
            <StyledTooltip place={'right'} title={'Workspace'}>
              <Pg
                active={activeIter === 'workspace'}
                onClick={() => { setActiveClassName('All'); dispatch(setIteration('workspace')); }}
              >W</Pg>
            </StyledTooltip>
          </ButtonWrap>
          : null //用fragment會整個消失
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
              >{index + 1}</Pg>
            </StyledTooltip>
          </ButtonWrap>
        ))}
      </Slider>
    </Container>
  );
};

export default SliderSidebar;