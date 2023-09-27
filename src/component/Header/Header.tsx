import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";
import logo from "../../images/iVIT-T Logo_W.png";
import Marquee from "react-fast-marquee";
import { selectIdTitle } from "../../redux/store/slice/currentTitle";
import SwitchButtonGroup from '../Buttons/SwitchButtonGroup';
import { useSelector } from "react-redux";
import { GetAllProjectsType } from '../../constant/API';
import { AlignWrapper, Container, FullTitle, FullTitleWrapper, HeaderContent, Logo, MarqueeTitle, Title, TitleWrapper } from './headerStyle';
import TrainFunction from './TrainFunction';
import { selectCurrentTab } from '../../redux/store/slice/currentTab';
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
            <TrainFunction key={socketId} handleInitData={handleInitData} />
          </AlignWrapper>
        </div>
        <div style={{ display: currentTab === 'Label' ? '' : 'none' }}>
          <FullTitleWrapper>
            <FullTitle>{title}</FullTitle>
          </FullTitleWrapper>
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
};

export default Header;
