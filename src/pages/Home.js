import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoomContext } from '../contexts/RoomContext';
import { useUserQuery } from '../hooks/useUserQuery';
import { useNavigation } from '../utils/navigate';

import LoadingPage from './LoadingPage';
import Mailbox from './Mailbox';

import '../App.css';

const Home = () => {
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const { goToCustomize, goToLibrary, goToMailbox } = useNavigation();
    const { room, setRoom } = useContext(RoomContext);

    // ─── 서버 상태 ────────────────────────────────────────────────────────────
    const { data: user, isLoading, error } = useUserQuery(token);

    // ─── Refs ─────────────────────────────────────────────────────────────────
    const avatarRef            = useRef(null);
    const petRef               = useRef(null);
    const clickRef             = useRef(null);
    const backgroundRef        = useRef(null);
    const objectRef            = useRef(null);
    const objectMainDoorRef    = useRef(null);
    const objectLibraryDoorRef = useRef(null);
    const mainDoorButtonRef    = useRef(null);
    const libraryButtonRef     = useRef(null);

    // ─── State ────────────────────────────────────────────────────────────────
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // 아바타 위치 (배경 기준 좌표)
    const [position, setPosition]           = useState({ x: centerX, y: centerY });
    // 클릭 이펙트 위치
    const [clickPosition, setClickPosition] = useState({ x: -1000, y: -1000 });
    const [showClickComponent, setShowClickComponent] = useState(true);

    // 도어 오브젝트 상태
    const [positionMainDoor, setPositionMainDoor]           = useState({ x: 50, y: 50 });
    const [positionLibraryDoor, setPositionLibraryDoor]     = useState({ x: 50, y: 50 });
    const [ShowMainDoorButton, setShowMainDoorButton]       = useState(false);
    const [ShowLibraryDoorButton, setShowLibraryDoorButton] = useState(false);

    // 우편함 모달
    const [isMailboxVisible, setIsMailbaxVisible] = useState(false);

    // 배경 스크롤 위치 (0~1 범위, 0.5가 중앙)
    const [backgroundPosition, setBackgroundPosition] = useState(0.5);
    const [backgroundSize, setBackgroundSize]         = useState();
    const [movementPosition, setMovementPosition]     = useState(0);

    // ─── Effects ──────────────────────────────────────────────────────────────

    // 배경 크기 계산 및 리사이즈 대응 (1920:1080 비율 유지)
    useEffect(() => {
        const calculateBackgroundSize = () => {
            const height = window.innerHeight;
            const width  = height * (1920 / 1080);
            if (backgroundRef.current) {
                backgroundRef.current.style.width  = `${width}px`;
                backgroundRef.current.style.height = `${height}px`;
            }
            setBackgroundSize({ height, width });
        };

        calculateBackgroundSize();
        window.addEventListener('resize', calculateBackgroundSize);
        return () => window.removeEventListener('resize', calculateBackgroundSize);
    }, []);

    // 배경 크기가 확정되면 배경을 화면 중앙 기준으로 초기 배치
    useEffect(() => {
        const screenWidth = window.innerWidth;
        if (backgroundSize) {
            setMovementPosition(-(backgroundSize.width - screenWidth) / 2);
            setBackgroundPosition(0.5);
        }
    }, [backgroundSize]);

    useEffect(() => {
        if (clickPosition.x !== -1000 && clickPosition.y !== -1000) {
            console.log("Updated click position:", clickPosition);
        }
    }, [clickPosition]);

    useEffect(() => {
        if (user && room) {
            console.log('roomdata: ', room);
        }
    }, [user, room]);

    // 아바타 위치 변경 시 펫 위치 동기화 (현재 미구현)
    useEffect(() => {
        if (avatarRef.current && petRef.current) {
            // TODO: petRef 위치 동기화
        }
    }, [position]);

    // 100ms 간격으로 충돌 감지 (도어 근접 여부 확인)
    useEffect(() => {
        const interval = setInterval(() => {
            checkCollision();
        }, 100);

        return () => {
            handleObjectShowFalse();
            clearInterval(interval);
        };
    }, [position]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleNavigate = () => {
        goToCustomize();
    };

    // 클릭 위치로 아바타 이동 + 양 끝 20% 영역 클릭 시 배경 스크롤
    const handleClick = (event) => {
        if (event.target.closest('.object-button')) {
            event.stopPropagation();
            return;
        }
        if (!backgroundRef.current) return;

        const backgroundRect = backgroundRef.current.getBoundingClientRect();
        const clickx = event.clientX - backgroundRect.left;
        const clicky = event.clientY - backgroundRect.top;

        const screenWidth = window.innerWidth;
        const threshold   = screenWidth * 0.2;
        const moveX       = (backgroundSize.width - screenWidth) / 2;

        let newBackgroundPosition = backgroundPosition;
        let newMovementPosition   = movementPosition;

        if (event.clientX < threshold && backgroundPosition > 0) {
            newBackgroundPosition -= 0.5;
            newMovementPosition   += moveX;
        } else if (event.clientX > screenWidth * 0.8 && backgroundPosition < 1) {
            newBackgroundPosition += 0.5;
            newMovementPosition   -= moveX;
        }

        setMovementPosition(newMovementPosition);
        setBackgroundPosition(newBackgroundPosition);

        const avatarWidth  = avatarRef.current ? avatarRef.current.offsetWidth  : 0;
        const avatarHeight = avatarRef.current ? avatarRef.current.offsetHeight : 0;
        setPosition({
            x: clickx - avatarWidth  / 2,
            y: clicky - avatarHeight,
        });

        setClickPosition({ x: clickx, y: clicky });
        setShowClickComponent(true);
        setTimeout(() => setShowClickComponent(false), 500);
    };

    const handleMainDoorClick = (event) => {
        event.stopPropagation();
        alert('나가?');
    };

    const handleMailboxClick = (event) => {
        event.stopPropagation();
        setIsMailbaxVisible(true);
    };

    const handleLibaryClick = (event) => {
        event.stopPropagation();
        goToLibrary();
    };

    const handleAvatarClick = () => {
        alert('Avatar clicked');
    };

    const handlePetClick = (event) => {
        event.stopPropagation();
        alert('안녕!');
    };

    // 아바타가 도어 오브젝트와 겹쳤을 때 해당 버튼 노출
    const handleOverlap = (target) => {
        switch (target) {
            case 'maindoor':
                setShowMainDoorButton(true);
                return;
            case 'librarydoor':
                setShowLibraryDoorButton(true);
                return;
            default:
                return;
        }
    };

    // 아바타가 도어에서 멀어지면 버튼 숨김
    const handleObjectShowFalse = () => {
        setShowMainDoorButton(false);
        setShowLibraryDoorButton(false);
    };

    // AABB 충돌 감지: 아바타와 각 도어의 bounding box 비교
    const checkCollision = () => {
        if (!avatarRef.current) return;

        const objAvatar = avatarRef.current.getBoundingClientRect();
        const objDoor   = objectMainDoorRef.current.getBoundingClientRect();
        const objDoor2  = objectLibraryDoorRef.current.getBoundingClientRect();

        if (
            objAvatar.left   < objDoor.right  &&
            objAvatar.right  > objDoor.left   &&
            objAvatar.top    < objDoor.bottom &&
            objAvatar.bottom > objDoor.top
        ) {
            handleOverlap('maindoor');
        }

        if (
            objAvatar.left   < objDoor2.right  &&
            objAvatar.right  > objDoor2.left   &&
            objAvatar.top    < objDoor2.bottom &&
            objAvatar.bottom > objDoor2.top
        ) {
            handleOverlap('librarydoor');
        }
    };

    // ─── Render Helpers ───────────────────────────────────────────────────────

    // room 데이터의 objectPosition을 기반으로 인터랙션 오브젝트 렌더링
    const objects = () => {
        if (!room) return null;

        return room.objectPosition.map((object, index) => {
            const { x, y } = object.defaultPosition;
            const { name, description } = object;

            const handleClickObject = (event) => {
                event.stopPropagation();
                navigate(`/${description}`);
            };

            return (
                <div
                    key={index}
                    className={`object ${name}`}
                    style={{ left: x, top: y }}
                    ref={objectRef}
                    onClick={handleClickObject}
                >
                    <button className="object-button" onClick={() => console.log("달력 클릭")}>
                        {name}
                    </button>
                </div>
            );
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            {isLoading || !user ? (
                <LoadingPage isLoading={isLoading} />
            ) : (
                <>
                    <div>
                        <div
                            className="room-space"
                            style={{ backgroundPosition: `${backgroundPosition * 100}% 0` }}
                        >
                            <div
                                ref={backgroundRef}
                                className="movement-space"
                                onClick={handleClick}
                                onClickCapture={() => console.log('moving')}
                                style={{ transform: `translateX(${movementPosition}px)` }}
                            >
                                {/* 현관문 영역 */}
                                <div className="main object-door" ref={objectMainDoorRef}>
                                    <div className="door" />
                                </div>
                                {ShowMainDoorButton && (
                                    <>
                                        <button ref={mainDoorButtonRef} className="main object-button" id="mainDoor-button" onClick={handleMainDoorClick}>
                                            현관문
                                        </button>
                                        <button ref={mainDoorButtonRef} className="mailboxButton object-button" id="mainDoor-button" onClick={handleMailboxClick}>
                                            우체통
                                        </button>
                                    </>
                                )}

                                {/* 서재 문 영역 */}
                                <div className="library object-door" ref={objectLibraryDoorRef}>
                                    <div className="door" />
                                </div>
                                {ShowLibraryDoorButton && (
                                    <button ref={libraryButtonRef} className="library object-button" id="library-button" onClick={handleLibaryClick}>
                                        책방 이동하기
                                    </button>
                                )}

                                {objects()}

                                {/* 아바타 & 펫 */}
                                <div className="avatar-box">
                                    <div
                                        className="avatar"
                                        ref={avatarRef}
                                        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                                        onClick={handleAvatarClick}
                                    >
                                        <p>{user.username}</p>
                                    </div>
                                    <div
                                        ref={petRef}
                                        className="pet-element"
                                        style={{ transform: `translate(${position.x + 180}px, ${position.y + 200}px)` }}
                                        onClick={handlePetClick}
                                    />
                                    {showClickComponent && (
                                        <div
                                            className="click-component"
                                            ref={clickRef}
                                            style={{
                                                top:  clickPosition.y - 50,
                                                left: clickPosition.x - 50,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 우편함 모달 */}
                    {isMailboxVisible && (
                        <div className="modal-overlay" onClick={() => setIsMailbaxVisible(false)}>
                            <Mailbox />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Home;
