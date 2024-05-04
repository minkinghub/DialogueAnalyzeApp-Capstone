
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import {Category, Etiquette} from "./analyze";
import MyPage from "./myPage";
import History from "./myPage/history";
import { ThemeProvider } from "./ThemeContext";
const App = () => {
    const Tab = createBottomTabNavigator();
    
    return (
      <NavigationContainer>
        <ThemeProvider>
          <Tab.Navigator 
              initialRouteName="MyPageStack"
              screenOptions={{
              headerShown: false, // 모든 화면에서 헤더 숨기기
              
          }}>
            <Tab.Screen name="Category" component={Category} />
            <Tab.Screen name="Etiquette" component={Etiquette} />
            <Tab.Screen name="MyPageStack" component={MyPageStack} />
          </Tab.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    );
  };
  
  const MyPageStack = () => {
    const Stack = createStackNavigator();
    return (
      <ThemeProvider>
      <Stack.Navigator
      screenOptions={{
        headerShown: false, // 모든 화면에서 헤더 숨기기
      }}>
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="history" component={History} />
      </Stack.Navigator>
      </ThemeProvider>
    );
  };

export default App;