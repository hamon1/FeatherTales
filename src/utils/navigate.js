import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    const goToLogin = () => navigate('/login');

    const goToHome = () => navigate('/home');
    const goToCustomize = () => navigate('/customize');
    const goToMain = () => navigate('/');
    const goToProfile = () => navigate('/profile');
    const goToLibrary = () => navigate('/library');
    const goToDocview = (docId) => navigate(`/docview/${docId}`);

    return { goToLogin, goToHome, goToCustomize, goToMain, goToProfile, goToProfile, goToLibrary, goToDocview };
}