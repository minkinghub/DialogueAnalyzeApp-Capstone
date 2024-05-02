import { Switch, Text, View } from "react-native";
import { useState } from "react";
import handleTheme from "./handleTheme";

const ThemeSwitch = () => {
    //true면 다크, flase면 라이트
    const [isDarkMode, setDarkMode] = useState(false);
    const handleDarkMode = () => {
        const newValue = !isDarkMode;
        setDarkMode(newValue);
        handleTheme(newValue);
        console.log('handleDarkMode: ', newValue);
    }
    return (
        <View style = {{
            flexDirection:'row',
            alignItems:'flex-end',
            borderWidth: 2,
            }}>
            {console.log('return: ', isDarkMode)}

            <Text>lightTheme</Text>
            <Switch
                value={isDarkMode}
                onValueChange={handleDarkMode}
            />
            <Text>darkTheme</Text>
        </View>
    );
}

export default ThemeSwitch;