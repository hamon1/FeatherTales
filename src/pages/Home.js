import React, { useContext, useState, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import '../App.css';

// import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../utils/navigate';

// import { header } from '../Header';

const Home = () => { 
    const { goToCustomize } = useNavigation();
    // const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const avatarRef = useRef(null);

    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [clickPosition, setClickPosition] = useState();
    const [showClickComponent, setShowClickComponent] = useState(false);

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
        setClickPosition({x: x, y: y});

        setShowClickComponent(true);
        setTimeout(() => {
            setShowClickComponent(false);
        }, 1000);
    };

    const handleAvatarClick = () => {
        alert('Avatar clicked');
    }

    return (
        <div>
            {/* {header()} */}
            {/* <h1>Wellcome Home!</h1> */}
            {/* <button onClick={handleNavigate}>커스텀!</button> */}
            <dic class="room-space">
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
                                style={{
                                    transform: `translate(${clickPosition.x}px, ${clickPosition.y}px)`,
                                }}
                            >
                                
                            </div>
                        )}
                    </div>
                </div>
            </dic>
        </div>
    )
}

export default Home;