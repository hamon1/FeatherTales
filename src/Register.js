import React, { useState } from 'react';
import { useNavigation } from './utils/navigate';
import { registerUser, loginUser } from './api';

const Register = () => {
    // ─── State ────────────────────────────────────────────────────────────────
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { goToLogin } = useNavigation();

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('비밀번호 입력을 다시 확인해주세요!');
            return;
        }

        try {
            await registerUser({ email, password });
            alert('회원가입 성공!');

            // 회원가입 후 바로 로그인 시도
            const response = await loginUser({ email, password });
            console.log(response);
            goToLogin();
        } catch (error) {
            if (error.response) {
                alert(error.response.data.msg);
            } else {
                alert('회원가입: 네트워크 오류가 발생했습니다.');
            }
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <form onSubmit={handleRegister}>
            <input
                className='login email'
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
            <input
                className='login password'
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className='login-btn' type="submit">회원가입</button>
        </form>
    );
};

export default Register;
