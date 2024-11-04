import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    const goToHome = () => navigate('/home');
    const goToCustomize = () => navigate('/customize');
    const goToMain = () => navigate('/');
    const goToProfile = () => navigate('/profile');

    return { goToHome, goToCustomize, goToMain, goToProfile, goToProfile };
}