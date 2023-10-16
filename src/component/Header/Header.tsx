import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import logo from "../../images/iVIT-T Logo_W.png";
import Marquee from "react-fast-marquee";
import { selectIdTitle } from "../../redux/store/slice/currentTitle";
import SwitchButtonGroup from '../Buttons/SwitchButtonGroup';

import { GetAllProjectsType } from '../../constant/API';
import { AlignWrapper, Container, ContainerLabel, FullTitle, FullTitleLabel, FullTitleWrapper, FullTitleWrapperLabel, HeaderContent,HeaderContentLabel, Logo, LogoLabel, MarqueeTitle, Title, TitleWrapper, BackButton } from './headerStyle';
import TrainFunction from './TrainFunction';
import { selectCurrentTab,setCurrentTab } from '../../redux/store/slice/currentTab';
import { selectSocketId } from '../../redux/store/slice/socketId';

type HeaderProps = {
  handleInitData: (data: GetAllProjectsType) => void;
};


const Header = (props: HeaderProps) => {
  const { handleInitData } = props;
  const navigator = useNavigate();
  const textRef = useRef<HTMLDivElement>(null);
  const pathname = useLocation().pathname;
  const allIdTitle = useSelector(selectIdTitle).idTitle;
  const [title, setTitle] = useState('');
  const [theType, setTheType] = useState('');
  const [marquee, setMarquee] = useState(false);
  const currentTab = useSelector(selectCurrentTab).tab;
  const socketId = useSelector(selectSocketId).socketId;

  const dispatch = useDispatch();

  // 偵測title是否overflow
  const isOverflowActive = useCallback((event: HTMLDivElement | null) => {
    if (event) {
      return event.offsetWidth < event.scrollWidth;
    }
  }, []);




  const titleGenerate = (showMarquee: boolean) => {
    if (showMarquee && isOverflowActive(textRef.current)) {
      return (
        <Marquee
          speed={40}
          gradient={false}
        >
          <MarqueeTitle ref={textRef}>{title}</MarqueeTitle>
        </Marquee>
      );
    } else return <Title ref={textRef}>{title}</Title>;
  }


  const detectCurrentStyle = (data: string) => {
    const conditions = ["main"];
    const findKeyWord = conditions.some(value => data.includes(value));
    if (findKeyWord) return 'showFunction';
    else return 'logo';
  }


  const switchTitle = (type: string) => {
    if (type === 'logo') return;

    return (
      <>
        <div style={{ display: currentTab === 'Model' || currentTab === 'Dataset' ? 'flex' : 'none' }}>
          <TitleWrapper
            onMouseEnter={() => setMarquee(true)}
            onMouseLeave={() => setMarquee(false)}
          >
            {titleGenerate(marquee)}
          </TitleWrapper>
          <AlignWrapper>
            <SwitchButtonGroup />
          </AlignWrapper>
          <TrainFunction key={socketId} handleInitData={handleInitData} />
        </div>
        <div style={{ display: currentTab === 'Label' ? '' : 'none',position:'relative' }}>
          <div style={{position:'absolute',left:-138,top:-25,backgroundColor:'#E61F23',paddingLeft:10}}>
            <FullTitleWrapperLabel>
              <FullTitleLabel>{title}</FullTitleLabel>
            </FullTitleWrapperLabel>
          </div>
          
        </div>
      </>
    )
  }

  useEffect(() => {
    const current = pathname.split("/").pop();
    const type = pathname.split("/")[2]; //拿type

    if (current) {
      setTitle(allIdTitle[socketId])
      setTheType(type);
    }
  }, [allIdTitle, socketId, pathname, theType]);

  if (currentTab === 'Model' || currentTab === 'Dataset')
    return (
      <>
        <Container>
          <HeaderContent >
            <Logo onClick={() => { navigator('/allProjects'); }} src={logo} />
            {switchTitle(detectCurrentStyle(pathname))}
          </HeaderContent>
        </Container>
      </>
    );

  else
    return (
      <>
        <ContainerLabel>
          <HeaderContentLabel >
            <LogoLabel onClick={() => { navigator('/allProjects'); }} src={logo} />
            {switchTitle(detectCurrentStyle(pathname))}
           
          </HeaderContentLabel>
          <div style={{position:'relative'}}>
            <BackButton onClick={()=>dispatch(setCurrentTab('Dataset'))}>Back</BackButton> 
          </div>
          
        </ContainerLabel>
      </>
    )
};

export default Header;
