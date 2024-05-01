import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetToken = async () => {
    try {
        const access_token = await AsyncStorage.getItem('access_token');
        const refresh_token = await AsyncStorage.getItem('refresh_token');
        const isFirst = await AsyncStorage.getItem('isFirst');

        return { access_token, refresh_token, isFirst };
    } catch (error) {
        console.error('Failed to load tokens:', error);
    }
}