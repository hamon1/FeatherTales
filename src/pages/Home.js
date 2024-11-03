import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => { 
    const navigate = useNavigate();
    
    const handleNavigate = () => {
        navigate('/customize');
    }

    return (
        <div>
            <h1>Wellcome Home!</h1>
            <button onClick={handleNavigate}>커스텀!</button>
        </div>
    )
}

export default Home;