import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { useLocation } from "react-router";
import logo from "../../images/iVIT-T_W.png";
import Marquee from "react-fast-marquee";
import { selectIdTitle } from "../../redux/store/slice/currentTitle";
import SwitchButtonGroup from '../Buttons/SwitchButtonGroup';

import { GetAllProjectsType, clearAutolabelingAPI } from '../../constant/API';
import { AlignWrapper, Container, ContainerLabel, FullTitle, FullTitleLabel, FullTitleLabel2, FullTitleWrapper, FullTitleWrapperLabel, HeaderContent, HeaderContentLabel, Logo, LogoLabel, MarqueeTitle, Title, TitleWrapper, BackButton } from './headerStyle';
import TrainFunction from './TrainFunction';
import { selectCurrentTab, setCurrentTab } from '../../redux/store/slice/currentTab';
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
    const [dataSetId, setDataSetId] = useState('');
    const [marquee, setMarquee] = useState(false);
    const [firstButtonFocus, setFirstButtonFocus] = useState(true);
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

    const switchTitle1 = (type: string) => {
        if (type === 'logo') return;

        return (
            <>
                <div style={{ position: 'relative', width: 1200 }}>

                    <div style={{ position: 'absolute', left: 180, top: -25, backgroundColor: '#E61F23', paddingLeft: 10 }}>
                        <TitleWrapper
                            onMouseEnter={() => setMarquee(true)}
                            onMouseLeave={() => setMarquee(false)}
                        >
                            {titleGenerate(marquee)}
                        </TitleWrapper>
                    </div>

                    <div style={{ position: 'absolute', left: 400, top: -25, backgroundColor: '#E61F23', paddingLeft: 10 }}>
                        <AlignWrapper>
                            <SwitchButtonGroup />
                            <TrainFunction key={socketId} handleInitData={handleInitData} />
                        </AlignWrapper>
                    </div>
                </div>


                {/* <FullTitleWrapper>
              <FullTitle>{title}</FullTitle>
            </FullTitleWrapper> */}

            </>
        )
    }

    const switchTitle2 = (type: string) => {
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
                <div style={{ display: currentTab === 'Label' ? '' : 'none', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', left: -140, top: -25, backgroundColor: '#E61F23', paddingLeft: 10 }}>
                        <FullTitleWrapperLabel>
                            <FullTitleLabel2>{title}</FullTitleLabel2>
                        </FullTitleWrapperLabel>
                    </div>

                </div>
            </>
        )
    }

    const handleBackButton = () => {
        //dispatch(setCurrentTab('Dataset'));
        console.log('dataSetId', dataSetId)
        clearAutolabelingAPI(dataSetId)
            .then(({ data }) => {
                console.log('=== clearAutolabelingAPI-success ===', data)

            })
            .catch(({ response }) => {
                console.log(response.data.message);
            }).finally(() => {
                window.location.reload();
            }

            );

    }

    useEffect(() => {
        const current = pathname.split("/").pop();
        const type = pathname.split("/")[2]; //拿type
        const dataSetId = pathname.split("/")[3];

        if (current) {
            setTitle(allIdTitle[socketId])
            setTheType(type);
            setDataSetId(dataSetId);
        }
    }, [allIdTitle, socketId, pathname, theType]);

    useEffect(() => {

        //console.log('pathname',pathname)

        const myFocus = (pathname.indexOf("allProjects") >= 0);
        setFirstButtonFocus(myFocus);

    }, [pathname]);

    if (currentTab === 'Model' || currentTab === 'Dataset')
        return (
            <>
                <Container>
                    <HeaderContent >

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -21, left: -16 }}>
                            <Link to="/allProjects">
                                <Logo onClick={() => { navigator('/allProjects'); }} src={logo} />
                            </Link>
                            </div>
                        </div>

                        {switchTitle1(detectCurrentStyle(pathname))}




                        {
                            (detectCurrentStyle(pathname) === 'logo') ?
                                <div className='d-flex flex-row align-items-center'>
                                    <div className={(firstButtonFocus) ? "my-page-switcher-focus" : "my-page-switcher"} onClick={() => { navigator('/allProjects'); }}>Project</div>
                                    <div className={(firstButtonFocus) ? "my-page-switcher" : "my-page-switcher-focus"} onClick={() => { navigator('/scheduler'); }}>Scheduler</div>
                                </div>
                                :
                                <div></div>

                        }

                    </HeaderContent>


                </Container>
            </>
        );

    else
        return (
            <>
                <ContainerLabel>
                    <HeaderContentLabel onClick={() => { navigator('/allProjects'); }}>
                        <Link to="/allProjects">
                            <LogoLabel src={logo} /> 
                        </Link>
                        <Link to="/allProjects">
                            <div style={{ cursor: 'pointer',color:'white' }}>
                                {switchTitle2(detectCurrentStyle(pathname))}
                            </div>
                        </Link>
                        

                    </HeaderContentLabel>
                    <div style={{ position: 'relative' }}>
                        <BackButton onClick={handleBackButton}>Back</BackButton>
                    </div>

                </ContainerLabel >
            </>
        )
};

export default Header;
