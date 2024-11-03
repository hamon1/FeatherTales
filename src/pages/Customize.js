import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api';
import { useFetchUserData } from '../hooks/useFetchUserData';

const Customize = () => { 
    const { user, setUser } = useContext(UserContext);
    // const { userData, loading } = useFetchUserData(user.token);
    const [nickname, setNickname] = useState(user?.username || 'randomName.data.nickname');
    const [skinColor, setSkinColor] = useState(user?.avatar.skincolor)
    const [skinColor2, setSkinColor2] = useState(user?.avatar.skinColor2)
    const [eyeColor, setEyeColor] = useState(user?.avatar.eyeColor)
    const [hairStyle, setHairStyle] = useState(user?.avatar.hairStyle)

    const fetchRandomNickname = async() => {
        try {
            const response = await api.get('/random-nickname');
            setNickname(response.data.nickname);
        } catch (error) {
            console.error("Failed to fetch random nickname", error);
        }
    };

    const handleSave = async () => {
        const token = sessionStorage.getItem('token');
        console.log(token);

        if (!token) {
            console.error('토큰 없음');
            return;
        }
        
        try {
            const updatedAvatar = {
                username: nickname,
                skinColor: skinColor,
                skinColor2: skinColor2,
                eyeColor: eyeColor,
                hairStyle: hairStyle,
            };
            await api.put('/update-avatar', updatedAvatar)

            setUser((prev) => ({ ...prev, ...updatedAvatar}))
            alert('변경되었습니다.');
        } catch (error) {
            console.error("Failed to save avatar", error.response.data.msg);
        }
    }

    useEffect(() => {
        if (!user?.username) {
            fetchRandomNickname();
        }
    }, [user]);


    if (!user) return <p>Loading user data...</p>;

    // if (loading) return <p>Loading...</p>;

    return (
        <div class="customize-page">
            <h1>Customize Page</h1>

            <div class="view-avata-section">
                <div class="view-avatar">
                    <p>avatar</p>
                </div>
                <div class="user-name">
                    <p>username: {nickname}</p>
                    <button>닉네임 변경</button>
                    <button onClick={fetchRandomNickname}>닉네임 랜덤 생성</button>
                </div>
            </div>
            {/* <p>Skin Color: {user.avata.skinColor}</p> */}
            {/* Customize UI components or features here */}

            <div class="customize-section">
                <label for="skin-color">Skin Color:</label>
                <input type="color" id="skin-color" name="skin-color" defaultValue={user.avatar.skinColor} onChange={(e) => setSkinColor(e.target.value)}/>
                <label for="skin-color2">Skin2 Color:</label>
                <input type="color" id="skin-color2" name="skin-color2" defaultValue={user.avatar.skinColor2} onChange={(e) => setSkinColor2(e.target.value)}/>
                <label for="eyes-color">Eyes Color:</label>
                <input type="color" id="eyes-color" name="eyes-color" defaultValue={user.avatar.eyeColor} onChange={(e) => setEyeColor(e.target.value)}/>
            </div>

            <div class="customize-section">
                <label for="clothing" name="clothing">Clothing:</label>
                <select id="clothing" name="clothing" >
                    <option value="tshirt">T-Shirt</option>
                </select>
            </div>
            
            <div class="customize-section">
                <label for="hairstyle" name="hairstyle">Hair:</label>
                <select id="hairstyle" name="hairstyle">
                    <option value="default">default</option>
                </select>
            </div>

            <button id="apply-changes" onClick={handleSave}>적용</button>
        </div>
    )
}

export default Customize;