import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import '../App.css';

// import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../utils/navigate';

import { header } from '../header/header';

const Home = () => { 
    const { goToCustomize } = useNavigation();
    // const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [position, setPosition] = useState({ x: 50, y: 50 });
    
    const handleNavigate = () => {
        // navigate('/customize');
        goToCustomize(); // useNavigation Hook instead of useNavigate()
    }

    const handleClick = (event) => {
        const container = event.currentTarget.getBoundingClientRect();

        const x = event.clientX;
        const y = event.clientY - container.top;
        setPosition({ x, y });
    }

    return (
        <div>
            {header()}
            <h1>Wellcome Home!</h1>
            <button onClick={handleNavigate}>커스텀!</button>
            <dic class="room-space">
                <div class="movement-space" onClick={handleClick}>
                    <div class="avatar-box">
                        <div 
                            className="avatar"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px)`,
                            }}
                            >
                            <p>avartar</p>
                        </div>
                        <p>username: {user.username}</p>
                    </div>
                </div>
            </dic>
        </div>
    )
}

export default Home;