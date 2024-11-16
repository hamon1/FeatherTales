import React, { useEffect, useContext, useState, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import '../App.css';

// import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../utils/navigate';

import LoadingPage from './LoadingPage';
import Mailbox from './Mailbox';
// import { header } from '../Header';

const Home = () => { 
    const [isLoading, setIsLoading] = useState(true);
    const { goToCustomize } = useNavigation();
    const { goToLibrary } = useNavigation();
    const { goToMailbox } = useNavigation();

    // const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    
    const avatarRef = useRef(null);
    const clickRef = useRef(null);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const [position, setPosition] = useState({ x: centerX, y: centerY });
    const [clickPosition, setClickPosition] = useState({ x: -1000, y:  -1000});
    const [showClickComponent, setShowClickComponent] = useState(true);
    
    const objectMainDoorRef = useRef(null);
    const [positionMainDoor, setPositionMainDoor] = useState({ x: 50, y: 50 });
    const [ShowMainDoorButton, setShowMainDoorButton] = useState(false);

    const objectLibraryDoorRef = useRef(null);
    const [positionLibraryDoor, setPositionLibraryDoor] = useState({ x: 50, y: 50 });
    const [ShowLibraryDoorButton, setShowLibraryDoorButton] = useState(false);
    
    const [isMailboxVisible, setIsMailbaxVisible] = useState(false);

    const [backgroundPosition, setBackgroundPosition] = useState(0); // -1, 0, 1
    const backgroundRef = useRef(null);


    const handleNavigate = () => {
        // navigate('/customize');
        goToCustomize(); // useNavigation Hook instead of useNavigate()
    }
    // setShowClickComponent(true);
    const handleClick = (event) => {
        if (!backgroundRef.current) return;

        const backgroundRect = backgroundRef.current.getBoundingClientRect();

        const clickx = event.clientX - backgroundRect.left; // 배경 위치 (배경 기준 좌표)
        const clicky = event.clientY - backgroundRect.top;

        const screenWidth = window.innerWidth;
        const threshold = screenWidth * 0.2; // 양 긑 20% 영역

        const maxMovement = Math.max(backgroundRect.width - screenWidth, 0); // 최대 이동 가능 거리

        let newBackgroundPosition = backgroundPosition;

        // 클릭 위치 왼쪽 끝 인접
        if (clickx < threshold && backgroundPosition > 0) {
            newBackgroundPosition =  backgroundPosition - 0.5; // 왼쪽으로 한 칸
            // newBackgroundPosition = Math.min(backgroundPosition + screenWidth / 2, 0);
        }
        // 클릭 위치 오른쪽 끝 인점
        else if (clickx > screenWidth - threshold && backgroundPosition < 1) {
            newBackgroundPosition = backgroundPosition + 0.5; // 오른쪽으로 한 칸
            // newBackgroundPosition = Math.max(backgroundPosition - screenWidth / 2, -maxMovement);
        }

        setBackgroundPosition(newBackgroundPosition);

        const avatarWidth = avatarRef.current ? avatarRef.current.offsetWidth : 0;
        const avatarHeight = avatarRef.current ? avatarRef.current.offsetHeight : 0;
        setPosition({
            x: clickx - avatarWidth/2,
            y: clicky - avatarHeight,
        })

        const container = event.currentTarget.getBoundingClientRect();
        
        const x = event.clientX;
        const y = event.clientY - container.top;
        
        // setPosition({ x: x - avatarWidth/2, y: y - avatarHeight });

        setClickPosition({ x, y })
        console.log(x, y);
        console.log(clickPosition.x, clickPosition.y);

        setShowClickComponent(true); // 클릭 효과 표시

        // 0.5초 후 클릭 효과 제거 (애니메이션 시간과 맞춤)
        setTimeout(() => setShowClickComponent(false), 500);

        // setTimeout(() => setClickPosition({x: -1000, y: -1000}), 1000);


        // // setTimeout(() => {
        //     if (clickRef.current) {
        //         const clickWidth = clickRef.current ? clickRef.current.offsetWidth : 0;
        //         const clickHeight = clickRef.current? clickRef.current.offsetHeight : 0;
        //         // console.log(clickWidth, clickHeight);
        //         setClickPosition({x: x - clickWidth/2, y: y - clickHeight/2});

                // setShowClickComponent(true);

            //     const cx = event.clientX - container.left;

            //     const moveX = (cx - container.width / 2) * 0.5; // 배경이 아바타보다 더 느리게 움직이도록 비율 설정

            //     console.log(cx);
            //     console.log(container.width);

            //     console.log(moveX);
            //     // console.log(window.innerWidth);
            //     // console.log(clickWidth);
            //     // console.log(clickPosition.x);
            //     // if (clickWidth > window.innerWidth * 0.8) {
            //         setBackgroundPosition({ x: clickWidth, y: backgroundPosition.y });
            //     // }

            //     setTimeout(() => {
            //         setShowClickComponent(false);
            //     }, 1000);
            // }
        // }, 0)

    };
    
    const handleAvatarClick = () => {
        alert('Avatar clicked');
    }
    
    const handleOverlap = (target) => {
        console.log('오브젝트 겹침', target);
        switch (target) {
            case 'maindoor': {
                setShowMainDoorButton(true);
                return;
            }
            case 'librarydoor': {
                setShowLibraryDoorButton(true);
                return;
            }
            defalut: {
                return;
            }
        }
    }
    
    const handleObjectShowFalse = () => {
        setShowMainDoorButton(false);
        setShowLibraryDoorButton(false);
        
    }
    
    const checkCollision = () => {
        if (!avatarRef.current) {
            return;
        }

        const objAvatar = avatarRef.current.getBoundingClientRect();

        const objDoor = objectMainDoorRef.current.getBoundingClientRect();
        const objDoor2 = objectLibraryDoorRef.current.getBoundingClientRect();
        
        if (
            objAvatar.left < objDoor.right &&
            objAvatar.right > objDoor.left &&
            objAvatar.top < objDoor.bottom &&
            objAvatar.bottom > objDoor.top
        ) {
            handleOverlap('maindoor');
        }
        if (
            objAvatar.left < objDoor2.right &&
            objAvatar.right > objDoor2.left &&
            objAvatar.top < objDoor2.bottom &&
            objAvatar.bottom > objDoor2.top
        ) {
            handleOverlap('librarydoor');
        }
        // else {
            // setTimeout(() => {
            //     handleObjectShowFalse();
            //     }, 2000);
            // }
        };
        useEffect(() => {
            if (clickPosition.x !== -1000 && clickPosition.y !== -1000) {
                console.log("Updated click position:", clickPosition);
            }

        }, [clickPosition]);
        

        useEffect(() => {
            if (user) {
                setIsLoading(false);
            } else {
                setIsLoading(true);
            }
        }, [user])
        
        useEffect(() => {
            // const animate = () => {
            //     checkCollision();
            //     requestAnimationFrame(animate);
            // };
            // requestAnimationFrame(animate);
            
            // return () => cancelAnimationFrame(animate);
            
            //너무 많이 실행 됨
            //최적화?
            const interval = setInterval(() => {
                checkCollision();
            }, 100);

            return () => {
                handleObjectShowFalse();
                clearInterval(interval)
            };
        }, [position])
        
        // if (!user) {
        //     // return <p>Loading...</p>;
        //     setIsLoading(false);
        // }

        // alert(isLoading);

        return (
            <>
            {isLoading || !user ? (
                <LoadingPage isLoading={isLoading}/>
            ):
            <>
                <div>
                {/* {header()} */}
                {/* <h1>Wellcome Home!</h1> */}
                {/* <button onClick={handleNavigate}>커스텀!</button> */}
                <div 
                class="room-space" 
                style={{ 
                    backgroundPosition: `${backgroundPosition * 100}% 0`, 
                    // backgroundPosition: `${backgroundPosition}px 0`,
                }}>
                    <div class="main object-door" ref={objectMainDoorRef}>
                        <div class="door">
                        </div>
                    </div>
                    {ShowMainDoorButton ? (
                        <>
                            <button class="main object-button" onClick={() => alert('나갈겨?')}>현관문</button>
                            <button class="main object-button" onClick={() => setIsMailbaxVisible(true)}>우체통</button>
                        </>
                    ) :
                    <></>
                }
                    <div class="library object-door" ref={objectLibraryDoorRef}>
                        <div class="door">
                        </div>
                    </div>
                    {ShowLibraryDoorButton ? (
                        <button class="library object-button" onClick={() => goToLibrary()}>책방 이동하기</button>
                    ) :
                    <></>
                }
                    <div class="object">
                        <div class="calendar">
                            <p>나는 달력이다!</p>
                        </div>
                    </div>
                    <div ref={backgroundRef} class="movement-space" onClick={handleClick}>
                        <div class="avatar-box">
                            <div 
                                className="avatar"
                                ref={avatarRef}
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px)`,
                                }}
                                onClick={handleAvatarClick}
                                >
                                {/* <p>avartar</p> */}
                                <p>{user.username}</p>
                            </div>
                            {showClickComponent && (
                                <div 
                                className="click-component"
                                ref={clickRef}
                                // style={{
                                //     transform: `translate(${clickPosition.x}px, ${clickPosition.y}px)`,
                                // }}
                                style={{
                                    top: clickPosition.y - 50, // 클릭 위치 중앙에 배치
                                    left: clickPosition.x - 50,
                                }}
                                >
                                    
                                </div>
                            )} 
                        </div>
                    </div>
                </div>
            </div>
            {isMailboxVisible ? (
                <div class="modal-overlay" onClick={()=> setIsMailbaxVisible(false)}>
                    <Mailbox />
                </div>
            ):
        <></>
    }
    </>
            }
        </>
    )
}

export default Home;