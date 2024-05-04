import { Switch, Text, View } from "react-native";
import { useTheme } from "../../ThemeContext";

const ThemeSwitch = () => {
    
    //true면 다크, flase면 라이트
    const {isDarkMode, toggleTheme} = useTheme();
    console.log('switch: ',isDarkMode);
    return (
        <View style = {{flexDirection:'row', alignItems:'flex-end', borderWidth: 2 }}>

            <Text>Light Theme</Text>
            <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
            />
            <Text>Dark Theme</Text>
        </View>
    );
}

export default ThemeSwitch;