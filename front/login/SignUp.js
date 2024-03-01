import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';

import PasswordConfirmation from '../component/signUp/PasswordConfirmation'; //비밀번호 일치 확인 컴포넌트
import SignUpAPI from '../component/API/SignUpAPI' //회원가입API 컴포넌트
import DoubleCheckAPI from '../component/API/DoubleCheckAPI' //중복확인API 컴포넌트
import EmailCheckAPI from '../component/API/EmailCheckAPI'; //email인증API 컴포넌트

const SignUp = () => {
  const [email, setEmail] = useState(''); //이메일
  const [id, setId] = useState(''); //아이디
  const [password, setPassword] = useState(''); //비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); //비밀번호 확인
  const [nickname, setNickname] = useState(''); //닉네임
  const [birthDate, setBirthDate] = useState(''); //생년월일
  const [name, setName] = useState(''); //이름
  const [gender, setGender] = useState(''); //성별
  const [secureNumber, setSecureNumber] = useState('') //인증번호

  const [signUpAttempted, setSignUpAttempted] = useState(false); //회원가입 버튼 클릭여부
  const [idDoubleCheckAttempted,setIdDoubleCheckAttempted] = useState(false); //id중복확인 버튼 클릭여부
  const [nicknameDoubleCheckAttempted,setNicknameDoubleCheckAttempted] = useState(false); //닉네임 중복확인 클릭여부
  const [emailCheckAttempted,setEmailCheckAttempted] = useState(false); //email인증 버튼 클릭여부

  const [passwordSame,setPasswordSame] = useState(false); //비밀번호 확인 일치여부
  const [idAvail, setIdAvail] = useState(false); //id중복확인 결과
  const [nicknameAvail, setNicknameAvail] = useState(false); //nickname중복확인 결과

  //비밀번호 확인 일치여부 
  const onpasswordSame = (resultData) => {
    setPasswordSame(resultData);
  };


  //회원가입 결과 (Test)
  const onSignUpResult = (resultData) => {
    if (resultData === true){
        Alert.alert('회원가입 성공',
        `아이디: ${id}\n
        비밀번호: ${password}\n
        닉네임: ${nickname}\n
        성별: ${gender}\n
        성명: ${name}\n
        생년월일: ${birthDate}\n
        이메일: ${email}\n`);
        console.log('성공');
        setSignUpAttempted(false);
    } else if (resultData === false) {
        Alert.alert("SignUp Failure", "failure");
        setSignUpAttempted(false);
    }
  };
  //회원가입 버튼
  const handleSignUp = () => {
    if (idAvail === true) {
        if (passwordSame === true) {
            if (nicknameAvail === true) {
                if (gender === 'male' || gender === 'female') {
                    if (name !== '') {
                        if (birthDate !== '') {
                            setSignUpAttempted(true);
                        }
                        else Alert.alert('안내','생년월일을 입력해주세요.');
                    }
                    else Alert.alert('안내','성명을 입력해주세요.');
                }
                else Alert.alert('안내','성별을 선택해주세요.');
            }
            else Alert.alert('안내','닉네임을 다시 확인해주세요.');
        }
        else Alert.alert('안내','비밀번호를 다시 확인해주세요.');
    }
    else Alert.alert('안내','아이디를 다시 확인해주세요.');
  };


  //id중복확인 결과
  const onIdDoubleCheckResult = (resultData) => {
    if(resultData === true){
        Alert.alert(' ','사용가능한 아이디 입니다.');
        setIdAvail(true);
    } else if(resultData === false) {
        Alert.alert(' ','사용이 불가능한 아이디 입니다.');
        setIdAvail(false);
    }
    setIdDoubleCheckAttempted(false); 
  };
  //nickName중복확인 결과
  const onNicknameDoubleCheckResult = (resultData) => {
    if(resultData === true){
        Alert.alert(' ','사용가능한 닉네임 입니다.');
        setNicknameAvail(true);
    } else if(resultData === false) {
        Alert.alert(' ','사용이 불가능한 닉네임 입니다.');
        setNicknameAvail(false);
    }
    setNicknameDoubleCheckAttempted(false);
  };
  //중복확인 버튼 (id, nickname)
  const handleIdDoubleCheck = () => {
    setIdDoubleCheckAttempted(true);
  };
  const handleNicknameDoubleCheck = () => {
    setNicknameDoubleCheckAttempted(true);
  };
  

  //email인증 결과
  const onEmailCheckResult = (resultData) => {
    console.log(resultData);
    setEmailCheckAttempted(false);
  };
  //이메일 인증버튼
  const handleEmailCheck = () => {
    setEmailCheckAttempted(true);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
        <ScrollView>
            <View style={styles.container}>
                
                <Text>아이디 입력</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                        style={styles.idInput}
                        placeholder="아이디"
                        value={id}
                        onChangeText={setId}
                    />
                    <TouchableOpacity style={styles.doubleCheckButton} onPress={handleIdDoubleCheck}>
                        <Text style={{color: 'white', fontSize: 12}}>중복확인</Text>
                    </TouchableOpacity>
                </View>
                
                <Text> </Text>
                <Text>비밀번호 입력</Text>
                <TextInput
                    style={styles.topInput}
                    placeholder="비밀번호"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.bottomInput}
                    placeholder="비밀번호 확인"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <PasswordConfirmation password={password} confirmPassword={confirmPassword} onpasswordSame={onpasswordSame}/> 

                <Text> </Text>
                <Text>회원 정보 입력</Text>
                
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                        style={styles.idInput}
                        placeholder="닉네임"
                        value={nickname}
                        onChangeText={setNickname}
                    />

                    <TouchableOpacity style={styles.doubleCheckButton} onPress={handleNicknameDoubleCheck}>
                        <Text style={{color: 'white', fontSize: 12}}>중복확인</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', margin: 10}}>
                    
                    <TouchableOpacity
                        style={[styles.genderButton, gender === 'male' && styles.selectedGenderButton]}
                        onPress={() => setGender('male')}
                    >
                        <Text style={{color: gender === 'male' ? '#FFF' : '#000'}}> 남성</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.genderButton, gender === 'female' && styles.selectedGenderButton]}
                        onPress={() => setGender('female')}
                    >
                        <Text style={{color: gender === 'female' ? '#FFF' : '#000'}}>여성</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.topInput}
                    placeholder="성명"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.bottomInput}
                    placeholder="생년월일 (8자리 입력 예 : 20000825)"
                    value={birthDate}
                    onChangeText={setBirthDate}
                />
                
                <Text> </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                    style={styles.emailInput}
                    placeholder="이메일"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    />
                    <TouchableOpacity style={styles.doubleCheckButton} onPress={handleEmailCheck}>
                        <Text style={{color: 'white', fontSize: 10}}>인증번호 발송</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={{width: '100%',
                    borderWidth: 1,
                    borderColor: '#cccccc',
                    padding: 10,
                    borderRadius: 10,}}
                    placeholder="인증번호 입력"
                    value={secureNumber}
                    onChangeText={setSecureNumber}
                />
            </View>

            <View style={{justifyContent: 'center', padding: 20, alignItems: 'center'}}>
                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                    <Text style={{color: 'white', fontSize: 20}}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

        {signUpAttempted &&
            <SignUpAPI
            id={id}
            password={password}
            nickname={nickname}
            gender={gender}
            name={name}
            birthDate={birthDate}
            email={email}
            onSignUpResult={onSignUpResult}
            /> 
        }

        {idDoubleCheckAttempted &&
            <DoubleCheckAPI
            id={id}
            nickname={null}
            onIdDoubleCheckResult={onIdDoubleCheckResult}
            />
        }

        {nicknameDoubleCheckAttempted &&
            <DoubleCheckAPI
            id={null}
            nickname={nickname}
            onNicknameDoubleCheckResult={onNicknameDoubleCheckResult}
            />
        }

        {emailCheckAttempted &&
            <EmailCheckAPI
            email={email}
            onEmailCheckResult={onEmailCheckResult}
            />
        }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    idInput: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        borderRadius: 10,
    },
    emailInput: {
        width: '75%',
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        borderRadius: 10,
    },
    topInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    bottomInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    signUpButton: {
        backgroundColor: 'blue',
        alignItems: 'center',
        padding: 10,
        width: '60%',
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 30,
    },
    doubleCheckButton: {
        backgroundColor: 'orange',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        borderWidth: 0.5,
    },
    genderButton: {
        marginHorizontal: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 0.5,
        borderColor: '#000',
        borderRadius: 20,
    },
    selectedGenderButton: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
});

export default SignUp;