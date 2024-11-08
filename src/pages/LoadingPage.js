import React, { useEffect } from "react";
import { useNavigation } from '../utils/navigate';

function LoadingPage({ isLoading }) {
    const { goToLogin } = useNavigation(); 
    const TIMEOUT_LIMIT = 10000;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            console.log("로딩 지연. 로그인 페이지 이동");
            goToLogin();
        }, TIMEOUT_LIMIT);

        if (!isLoading ) {
            clearTimeout(timeoutId);
        }

        return () => clearTimeout(timeoutId);
    }, [isLoading]);
    
    return (
    <div>
        <p>로딩 중입니다...</p>
    </div>
);
}

export default LoadingPage;