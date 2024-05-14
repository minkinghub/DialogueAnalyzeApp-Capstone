import { SaveToken } from '../../tokenData/SaveToken'
import axios from 'axios';

const SendServer = async ( userInfo, accessToken ) => {
    console.log("Send server data", userInfo.nickname, accessToken );

    try {
        const response = await axios.post('http://35.216.126.98:8080/api/auth/login/kakao', {
            access_token: `Bearer ${accessToken}`,
            profile_nickname: userInfo.nickname
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // console.log('Server response:', response.data);

        if(response.status === 200){
            SaveToken(response.data);
            return response.data.isFirst
        }
        
    } catch (error) {
        console.error('Failed to send data to server:', error.response ? error.response.data : error);
    }
};

export default SendServer;