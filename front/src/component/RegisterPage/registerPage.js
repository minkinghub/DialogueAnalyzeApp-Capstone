import axios from 'axios';
import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function RegisterPage() {
    const navigate = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const onEmailHandler = (text) => setEmail(text);
    const onNamedHandler = (text) => setName(text);
    const onPasswordHandler = (text) => setPassword(text);
    const onConfirmPasswordHandler = (text) => setConfirmPassword(text);

    const onSubmitHandler = async () => {
        if (password !== confirmPassword) {
            Alert.alert("비밀번호랑 비밀번호 확인이 일치하지 않습니다");
            return;
        }
        let body = {
            email: email,
            name: name,
            password: password,
        };
        
        try {
            const response = await axios.post("/api/users/register", body);

            if (response.data.success) {
                navigate("/login");
            } else {
                Alert.alert("회원가입 실패!");
            }
        } catch (error) {
            console.log(error);
        }
    };
    
  return (
    <Provider>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={onEmailHandler}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={onNamedHandler}
          value={name}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={onPasswordHandler}
          secureTextEntry
          value={password}
        />
        <TextInput
          style={styles.input}
          placeholder="Password Confirm"
          onChangeText={onConfirmPasswordHandler}
          secureTextEntry
          value={confirmPassword}
        />
        <Button title="Sign UP" onPress={onSubmitHandler} />
      </View>
    </Provider>

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

export default RegisterPage;