import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import { RoomContext } from '../contexts/RoomContext';
import '../App.css';

import { useUserQuery } from '../hooks/useUserQuery';

import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../utils/navigate';

import LoadingPage from './LoadingPage';
import Mailbox from './Mailbox';

const Home = () => { 
    const token = sessionStorage.getItem('token');
    console.log('home token', token);

    const { data: user, isLoading, error} = useUserQuery(token);

    const { goToCustomize } = useNavigation();
    const { goToLibrary } = useNavigation();
    const { goToMailbox } = useNavigation();

    const navigate = useNavigate();
    const { room, setRoom } = useContext(RoomContext);

    const avatarRef = useRef(null);
    const petRef = useRef(null);
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

    const [backgroundPosition, setBackgroundPosition] = useState(0.5); // (0, 1)
    const backgroundRef = useRef(null);
    const [ backgroundSize, setBackgroundSize ] = useState();

    const [ movementPosition, setMovementPosition] = useState(0);

    const mainDoorButtonRef = useRef(null);
    const libraryButtonRef = useRef(null);
    const objectRef = useRef(null);

    console.log("📍 Home");

    const objects = () => {
        if (room) {
            console.log('📍 objects');
            return room.objectPosition.map((object, index) => {
                const { x, y, z, rotation } = object.defaultPosition;
                const{ id, name, description } = object;

                const handleClickObject = (event) => {
                    event.stopPropagation();
                    console.log(`Clicked object: ${description}`);
                    navigate(`/${description}`);
                }

                return (
                    <div
                        key={index}
                        className={`object ${name}`}
                        style={{ left: x, top: y }}
                        ref={objectRef}
                        onClick={handleClickObject}
                    >
                        <button
                            class="object-button "
                            onClick = {() => console.log("달력 클릭")}
                        >
                            {name}
                        </button>
                        {/* <img src={`/images/${type}.png`} alt={type} /> */}
                    </div>
                );
            });
        }
    }

    const handleNavigate = () => {
        goToCustomize(); // useNavigation Hook instead of useNavigate()
    }

    const handleClick = (event) => {
        if (event.target.closest('.object-button')) {
            // 클릭한 대상이 버튼이면 movement-space의 동작 실행 안 함

            event.stopPropagation();
            return;
        }

        if (!backgroundRef.current) return;

        const backgroundRect = backgroundRef.current.getBoundingClientRect();

        const clickx = event.clientX - backgroundRect.left; // 배경 위치 (배경 기준 좌표)
        const clicky = event.clientY - backgroundRect.top;

        const screenWidth = window.innerWidth;
        const threshold = screenWidth * 0.2; // 양 긑 20% 영역


        const moveX = (backgroundSize.width - screenWidth) / 2;
        console.log(moveX);
        let newBackgroundPosition = backgroundPosition;
        let newMovementPosition = movementPosition;
        console.log("좌표?", event.clientX, threshold, screenWidth * 0.8);
        // 클릭 위치 왼쪽 끝 인접
        if (event.clientX < threshold && backgroundPosition > 0) {
            console.log('왼쪽');
            newBackgroundPosition -= 0.5; // 오른쪽으로 한 칸
            newMovementPosition += moveX;
        }
        // 클릭 위치 오른쪽 끝 인점
        else if (event.clientX > screenWidth * 0.8 && backgroundPosition < 1) {
            console.log('오른쪽');
            newBackgroundPosition += 0.5; // 왼쪽으로 한 칸
            newMovementPosition -= moveX;
            // newBackgroundPosition = Math.max(backgroundPosition - screenWidth / 2, -maxMovement);
        }

        setMovementPosition(newMovementPosition);
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

        console.log("너비", backgroundRect.width);
        console.log(backgroundSize);
        setClickPosition({ x: clickx, y: clicky })
        console.log(x, y);
        console.log(clickPosition.x, clickPosition.y);

        setShowClickComponent(true); // 클릭 효과 표시

        // 0.5초 후 클릭 효과 제거 (애니메이션 시간과 맞춤)
        setTimeout(() => setShowClickComponent(false), 500);


    };
    const handleMainDoorClick = (event) => {
        // event.preventDefault();
        event.stopPropagation();
        alert('나가?');
    };
    const handleMailboxClick = (event) => {
        // event.preventDefault();
        event.stopPropagation();
        setIsMailbaxVisible(true);
    };
    const handleLibaryClick = (event) => {
        // event.preventDefault();
        event.stopPropagation();

        goToLibrary();
    }
    
    const handleAvatarClick = () => {
        alert('Avatar clicked');
    }
    const handlePetClick = (event) => {
        event.stopPropagation();
        alert('안녕!');
    }
    
    const handleOverlap = (target) => {
        console.log('오브젝트 겹침', target);
        switch (target) {
            case 'maindoor': {
                setShowMainDoorButton(true);
                // document.getElementById('mainDoor-button').style.visibility = 'visible';
                // mainDoorButtonRef.current.style.visibility = 'visible';
                return;
            }
            case 'librarydoor': {
                setShowLibraryDoorButton(true);
                // document.getElementById('library-button').style.visibility = 'visible';
                // libraryButtonRef.current.style.visibility = 'visible';
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
        // document.getElementById('mainDoor-button').style.visibility = 'hidden';
        // document.getElementById('library-button').style.visibility = 'hidden';
        // mainDoorButtonRef.current.style.visibility = 'hidden';
        // libraryButtonRef.current.style.visibility = 'hidden';
        
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
        };

        const libraryButton = useCallback(() => {
            console.log('library button clicked');
        }, []);

        useEffect(() => {
            const screenWidth = window.innerWidth;

            if (backgroundSize) {
                setMovementPosition(-(backgroundSize.width - screenWidth)/2);
                setBackgroundPosition(0.5);
            }

        }, [backgroundSize])
        
        useEffect(() => {
            const calculateBackgroundSize = () => {
                const height = window.innerHeight;
                const width = height * ( 1920 / 1080 );
                console.log('너비 업데이트', width);
                if (backgroundRef.current) {
                    backgroundRef.current.style.width = `${width}px`;
                    backgroundRef.current.style.height = `${height}px`;
                }
                setBackgroundSize({ height: height, width: width });
            };
            calculateBackgroundSize();
        
            window.addEventListener('resize', calculateBackgroundSize);

            return () => {
                window.removeEventListener('resize', calculateBackgroundSize);
            };
        }, []);

        useEffect(() => {
            if (clickPosition.x !== -1000 && clickPosition.y !== -1000) {
                console.log("Updated click position:", clickPosition);
            }

        }, [clickPosition]);
        
        useEffect(() => {
            if (user && room) {
                // setIsLoading(false);
                console.log('roomdata: ', room);
            } else {
                // setIsLoading(true);
            }
        }, [user, room])

        useEffect(() => {
            if (avatarRef.current) {
                const avatarRect = avatarRef.current.getBoundingClientRect();
                if (petRef.current) {
                    // petRef.current.style.left = `${avatarRect.left + 20}px`;
                    // petRef.current.style.top = `${avatarRect.top + 20}px`;
                }
            }
        }, [position])
        
        useEffect(() => {
            //최적화?
            const interval = setInterval(() => {
                checkCollision();
            }, 100);

            return () => {
                handleObjectShowFalse();
                clearInterval(interval)
            };
        }, [position])
        

        return (
            <>
            {isLoading || !user ? (
                <LoadingPage isLoading={isLoading}/>
            ):
            <>
                <div>
                <div 
                class="room-space" 
                style={{ 
                    backgroundPosition: `${(backgroundPosition ) * 100}% 0`, 
                    // transform: `translateX(${backgr/oundPosition * 100}%)`, // 모든 요소에 동일한 이동 적용
                    // transition: "transform 0.5s ease", // 부드러운 이동

                }}>
                    <div 
                        ref={backgroundRef} 
                        class="movement-space" 
                        onClick={handleClick}
                        onClickCapture={() => console.log('moving')}
                        style = {{
                            // width: `${backgroundSize.width}px`,
                            transform: `translateX(${movementPosition}px)`, // X축으로 이동
                            // backgroundPosition: `${backgroundPosition * 100}% 0`, 
                            
                        }}
                    >
                                <div class="main object-door" ref={objectMainDoorRef}>
                                    <div class="door">
                                    </div>
                                </div>
                                {ShowMainDoorButton ? (
                                    <>
                                        <button ref = {mainDoorButtonRef} class="main object-button" id="mainDoor-button" onClick={handleMainDoorClick}>현관문</button>
                                        <button 
                                            ref = {mainDoorButtonRef}
                                            class="mailboxButton object-button" 
                                            id = "mainDoor-button"
                                            onClick={handleMailboxClick}
                                        >
                                            우체통 
                                        </button>
                                    </>
                                ) :
                                <div> </div>
                            }
                                <div class="library object-door" ref={objectLibraryDoorRef}>
                                    <div class="door">
                                    </div>
                                </div>
                                {ShowLibraryDoorButton ? (
                                    <button 
                                    ref = {libraryButtonRef}
                                    class="library object-button" 
                                    id = "library-button"
                                    onClick={handleLibaryClick}>책방 이동하기</button>
                                ) :
                                <div> </div>
                            }
                            {objects()}
                        <div class="avatar-box">
                            <div 
                                class="avatar"
                                ref={avatarRef}
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px)`,
                                }}
                                onClick={handleAvatarClick}
                                >
                                {/* <p>avartar</p> */}
                                <p>{user.username}</p>
                            </div>
                            <div
                                ref={petRef}
                                class="pet-element"
                                style={{
                                    transform: `translate(${position.x + 180}px, ${position.y + 200}px)`,
                                }}
                                onClick={handlePetClick}
                            >
                                {/* <img src="../assets/Pet.png"/> */}
                            </div>
                            {showClickComponent && (
                                <div 
                                class="click-component"
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