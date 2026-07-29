import { getFriendsData } from '../api';

// 친구 목록을 10명씩 페이지 단위로 배치 조회
// page: 0부터 시작하는 페이지 번호
export const friendsListBatch = async ({ friendsList, page, token }) => {
    const batchSize = 10;

    const startIndex = batchSize * page;
    let endIndex = startIndex + batchSize;
    if (endIndex > friendsList.length) {
        endIndex = friendsList.length;
    }
    const batch = friendsList.slice(startIndex, endIndex);

    console.log('friend util', startIndex, endIndex, batch);

    try {
        const friendsDataList = await getFriendsData(token, batch);
        console.log("친구 데이터 패치 성공", friendsDataList);
        return friendsDataList;
    } catch (error) {
        console.error("친구 데이터 패치 실패", error.response.data.msg);
        throw error;
    }
};
