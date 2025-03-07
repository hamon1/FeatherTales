import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useNavigation } from './utils/navigate'; // useNavigate Hook을 import

// import {api} from './api'; // 서버와 통신을 위한 API 모��을 import
import {api, loginUser, registerUser} from './api'; // 서버와 통신을 위한 API 모듈을 import

// 회원가입 컴포넌트
const Register = () => {
    // 사용자 입력을 저장할 상태 변수들 정의
    const [username, setUsername] = useState(''); // 사용자 이름
    const [email, setEmail] = useState(''); // 이메일 주소
    const [password, setPassword] = useState(''); // 비밀번호
    const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인

    const [acceptPassword, setAcceptPassword] = useState(false); // 비밀번호, 비밀번호 확인 값이 같은가? 에 대한 상태

    const { goToLogin } = useNavigation();
    // const navigate = useNavigate();

    const checkPassword = () => {

        if (password === confirmPassword) {
            alert('확인되었습니다.')
            setAcceptPassword(true);
        } else {
            alert('비번번호가 일치하지 않습니다.')
            setAcceptPassword(false);
        }
    }
    
    // 회원가입 버튼을 눌렀을 때 실행되는 함수
    const handleRegister = async (e) => {
        e.preventDefault(); // 폼의 기본 동작인 새로고침을 방지
        console.log(password);
        console.log(confirmPassword);

        if (!(password === confirmPassword)) {
            alert('비밀번호 입력을 다시 확인해주세요!');
            return;
        }

        try {
            // 서버로 회원가입 요청을 보냄
            // await api.post('/register', { email, password });
            await registerUser({email, password});

            alert('회원가입 성공!');
            // const response = await api.post('/login', { email, password });
            const response = await loginUser({email, password});

            console.log(response); // 서버 응답을 콘솔에 출력
            // alert(response.data.message); // 서버의 메시지를 사용자에게 알림
            goToLogin();
        } catch (error) {
            // 오류가 발생했을 때의 처리
            if (error.response) {
                // 서버가 응답을 보냈지만 오류가 포함된 경우
                alert(error.response.data.msg);
            } else {
                // 서버가 응답하지 않았거나 네트워크 오류
                alert('회원가입: 네트워크 오류가 발생했습니다.', error); // 네트워크 오류 메시지
            }
        }
    };

    return (
        // 회원가입 폼 렌더링
        <form onSubmit={handleRegister}>
            {/* 이메일 입력 필드 */}
            <input 
                className='login email'
                type="text" 
                placeholder="이메일" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            {/* 비밀번호 입력 필드 */}
            <input 
                className='login password'
                type="password" 
                placeholder="비밀번호" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            {/* 비밀번호 확인 필드 */}
            <input 
                className='login password'
                type="password" 
                placeholder="비밀번호 확인" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            {/* <button type="button" onClikc={() => checkPassword()}>비밀번호 확인</button> */}
            {/* 회원가입 버튼 */}
            <button className='login-btn' type="submit">회원가입</button>  
        </form>
    )
}

export default Register; // 컴포넌트를 export하여 다른 파일에서 사용할 수 있도록 함
