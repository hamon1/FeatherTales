import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { loginUser, getUserData, getRoomData, getDocs } from './api';
import { RoomContext } from './contexts/RoomContext';

import MovigObject from './pages/MovingObject';

const Login = () => {
    // ─── State ────────────────────────────────────────────────────────────────
    const { setRoom } = useContext(RoomContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password });
            const token = response.token;

            if (token) {
                sessionStorage.setItem('token', token);
            }

            // 로그인 직후 유저/문서 데이터를 미리 캐싱해 Home 진입 속도를 높임
            await queryClient.prefetchQuery({
                queryKey: ['user'],
                queryFn: async () => {
                    const data = await getUserData(token);
                    return data;
                },
            });
            await queryClient.prefetchQuery({
                queryKey: ['docs'],
                queryFn: async () => {
                    const data = await getDocs(token);
                    return data;
                },
            });

            const roomData = await getRoomData(token);
            setRoom(roomData);

            navigate('/home');
        } catch (error) {
            if (error.response) {
                alert(error.response.data.msg);
            } else {
                alert('로그인: 네트워크 오류가 발생했습니다.');
            }
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            <form onSubmit={handleLogin}>
                <h1 className='login-title'>Feathertales</h1>
                <input
                    className='login username'
                    type="text"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='login password'
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='login-btn' type="submit">로그인</button>
            </form>
            <MovigObject />
        </>
    );
};

export default Login;
