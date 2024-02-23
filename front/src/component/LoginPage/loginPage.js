import axios from 'axios';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

function LoginPage() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onEmailChange = (text) => {
        setEmail(text);
    };
    const onPasswordChange = (text) => {
        setPassword(text);
    };
    const onSubmit = async () => {
        let body = {
          email: email,
          password: password,
        };
        
        try {
            const response = await axios.post("/api/users/login", body);

            if (response.data.loginSuccess) {
                navigation.navigate("Home");
            } else {
                Alert.alert("ERROR");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                placeholder="Email"
                onChangeText={onEmailChange}
                value={email}
            />
            <TextInput 
                style={styles.input}
                placeholder="Password"
                onChangeText={onPasswordChange}
                secureTextEntry
                value={password}
            />
            <Button title="Login" onPress={onSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 200,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
});

export default LoginPage;