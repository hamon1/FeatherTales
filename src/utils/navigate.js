import { useNavigate } from 'react-router-dom';

// 페이지 이동 함수들을 한 곳에서 관리하는 훅
// useNavigate를 직접 사용하는 대신 이 훅을 통해 이동 경로를 중앙화
export const useNavigation = () => {
    const navigate = useNavigate();

    const goToLogin    = () => navigate('/login');
    const goToMain     = () => navigate('/');
    const goToHome     = () => navigate('/home');
    const goToCustomize = () => navigate('/customize');
    const goToProfile  = () => navigate('/profile');
    const goToLibrary  = () => navigate('/library');
    const goToMailbox  = () => navigate('/mailbox');
    const goToDocview  = (docId) => navigate(`/docview/${docId}`);

    return { goToLogin, goToMain, goToHome, goToCustomize, goToProfile, goToLibrary, goToDocview, goToMailbox };
};
