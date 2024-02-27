import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";


const Calendar = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
            <View style={styles.container}>
                <Text>Calendar</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Calendar;