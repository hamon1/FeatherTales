import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    const goToHome = () => navigate('/home');
    const goToCustomize = () => navigate('/customize');

    return { goToHome, goToCustomize };
}