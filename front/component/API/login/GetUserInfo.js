import { Alert } from 'react-native';

async function getUserInfo(accessToken) {
    const reqUrl = "https://kapi.kakao.com/v2/user/me";

    try {
        const response = await fetch(reqUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });

        const responseCode = response.status;

        const result = await response.json();
        console.log("responseBody =", result);

        if (response.ok) {
            const properties = result.properties;
            const nickname = properties.nickname;

            return {
                nickname: nickname,
            };
        } else {
            // 서버 에러 처리
            throw new Error(`Server returned status code ${responseCode}`);
        }
    } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch user info.");
        return null;
    }
}

export default getUserInfo;