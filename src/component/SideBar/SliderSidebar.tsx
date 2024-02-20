import { useEffect, useRef, useState } from 'react'
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
    const sliderRef = useRef<Slider>(null);
    const [lastTab, setLastTab] = useState('');
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

    useEffect(() => {

        console.log('currentTab change=', currentTab);
        console.log('activeIter', activeIter)
        if (currentTab === 'Model') {
            const myItemIdx = (parseInt(activeIter.replace("iteration", "")) - 1);
            console.log('myItemIdx', myItemIdx);

            if (lastTab!=='Model'){
                if (sliderRef.current) sliderRef.current.slickGoTo(myItemIdx);
            }
           
        }

        if (currentTab === 'Dataset') {
            const myItemIdx = (activeIter === 'workspace') ? 0 : (parseInt(activeIter.replace("iteration", "")));
            console.log('myItemIdx', myItemIdx);

            if (myItemIdx===0){
                if (sliderRef.current) sliderRef.current.slickGoTo(myItemIdx);
            } 


            if (lastTab!=='Dataset'){
                if (sliderRef.current) sliderRef.current.slickGoTo(myItemIdx);
            }
            
        }

        setLastTab(currentTab);

    }, [currentTab,activeIter]);


    return (
        <Container className={currentTab === 'Label' ? 'hide' : ''}>
            <Slider {...settings} ref={sliderRef}>
                {(currentTab === 'Dataset') &&
                    <ButtonWrap className='Dataset' key="workspace">
                        <StyledTooltip place={'right'} title={'Workspace'}>
                            <Pg
                                active={activeIter === 'workspace'}
                                onClick={() => { setActiveClassName('All'); dispatch(setIteration('workspace')); }}
                            >W</Pg>
                        </StyledTooltip>
                    </ButtonWrap>
                    // : null //用fragment會整個消失
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