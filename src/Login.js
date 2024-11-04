import React, {useContext, useState} from 'react';
import { useNavigate } from'react-router-dom';
import {api, loginUser, getUserData} from './api';
import {UserContext} from './contexts/UserContext';

import { UseFetchUserData } from './hooks/useFetchUserData';

const Login = () => {
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const { userData, loading } = useFetchUserData(token);

    // if (loading) return <p>Loading...</p>;

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // const response = await api.post('/login', { email, password });
            const response = await loginUser({ email, password }); // 로그인 API 호출

            // alert(response.token);
            // console.log(response);
            // alert(response.data);
            // const userData = UseFetchUserData(response.token);
            const userData = await getUserData(response.token);
            // alert(userData.email);
            setUser(userData);
            navigate('/home');
        } catch (error) {
            // 오류가 발생했을 때의 처리
            if (error.response) {
                // 서버가 응답을 보냈지만 오류가 포함된 경우
                alert(error.response.data.msg);
            } else {
                // 서버가 응답하지 않았거나 네트워크 오류
                alert('로그인: 네트워크 오류가 발생했습니다.'); // 네트워크 오류 메시지
            }
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input 
                type="text" 
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button> 
        </form>
    )
}

export default Login;