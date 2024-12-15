import { useEffect, useState } from 'react';
import { getUserData } from '../api';

export const UseFetchUserData = (token) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserData(token);
                setUserData(data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
        }
    };
    if (token) {
        fetchData();
    } else {
        setLoading(false);
    }

    }, [token]);
    return {userData, loading};
};

// export default useFetchUserData;