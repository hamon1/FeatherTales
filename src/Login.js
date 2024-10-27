import React, {useState} from 'react';
import api from './api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            console.log(response);
            alert(response.data.message);
        } catch (error) {
            // 오류가 발생했을 때의 처리
            if (error.response) {
                // 서버가 응답을 보냈지만 오류가 포함된 경우
                alert(error.response.data.msg);
            } else {
                // 서버가 응답하지 않았거나 네트워크 오류
                alert('네트워크 오류가 발생했습니다.'); // 네트워크 오류 메시지
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
            <button type="submit">Login</button> {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}  {/* Button for form submission */}
        </form>
    )
}

export default Login;