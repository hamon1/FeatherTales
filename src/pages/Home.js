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
    const [clickPosition, setClickPosition] = useState();
    const [showClickComponent, setShowClickComponent] = useState(false);
    
    const objectMainDoorRef = useRef(null);
    const [positionMainDoor, setPositionMainDoor] = useState({ x: 50, y: 50 });
    const [ShowMainDoorButton, setShowMainDoorButton] = useState(false);

    const objectLibraryDoorRef = useRef(null);
    const [positionLibraryDoor, setPositionLibraryDoor] = useState({ x: 50, y: 50 });
    const [ShowLibraryDoorButton, setShowLibraryDoorButton] = useState(false);
    
    const [isMailboxVisible, setIsMailbaxVisible] = useState(false);

    const handleNavigate = () => {
        // navigate('/customize');
        goToCustomize(); // useNavigation Hook instead of useNavigate()
    }
    
    const handleClick = (event) => {
        const container = event.currentTarget.getBoundingClientRect();
        
        const x = event.clientX;
        const y = event.clientY - container.top;
        
        const avatarWidth = avatarRef.current ? avatarRef.current.offsetWidth : 0;
        const avatarHeight = avatarRef.current ? avatarRef.current.offsetHeight : 0;
        setPosition({ x: x - avatarWidth/2, y: y - avatarHeight });

        setClickPosition({ x: -1000, y: -1000 });

        setShowClickComponent(true);

        setTimeout(() => {
            if (clickRef.current) {
                const clickWidth = clickRef.current ? clickRef.current.offsetWidth : 0;
                const clickHeight = clickRef.current? clickRef.current.offsetHeight : 0;
                console.log(clickWidth, clickHeight);
                setClickPosition({x: x - clickWidth/2, y: y - clickHeight/2});

                // setShowClickComponent(true);

                setTimeout(() => {
                    setShowClickComponent(false);
                }, 1000);
            }
        }, 0)

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
                <div class="room-space">
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
                    <div class="movement-space" onClick={handleClick}>
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
                                style={{
                                    transform: `translate(${clickPosition.x}px, ${clickPosition.y}px)`,
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