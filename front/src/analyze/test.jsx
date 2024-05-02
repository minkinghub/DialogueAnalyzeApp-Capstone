import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Category from './category';
import Etiquette from './etiquette';

const Tab = createBottomTabNavigator();

const test = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Category" component={Category} />
        <Tab.Screen name="Etiquette" component={Etiquette} />

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default test;
