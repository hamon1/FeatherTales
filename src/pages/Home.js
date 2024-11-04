import React,{ useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

// import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../utils/navigate';

import { header } from '../header/header';

const Home = () => { 
    const { goToCustomize } = useNavigation();
    // const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    
    const handleNavigate = () => {
        // navigate('/customize');
        goToCustomize(); // useNavigation Hook instead of useNavigate()
    }

    return (
        <div>
            {header()}
            <h1>Wellcome Home!</h1>
            <button onClick={handleNavigate}>커스텀!</button>
            <dic class="room-space">
                <div class="moveable-space">
                    <div class="avatar-box">
                        <p>avartar</p>
                        <p>username: {user.username}</p>
                    </div>
                </div>
            </dic>
        </div>
    )
}

export default Home;