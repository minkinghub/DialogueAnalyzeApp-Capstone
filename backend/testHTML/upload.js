function uploadFile() {
    const input = document.getElementById('fileInput');
    const ageInput = document.getElementById('ageInput');
    const analysisTypeCheckbox = document.getElementById('analysisTypeCheckbox'); // 분석 타입 체크박스 접근
    const file = input.files[0];
    const age = ageInput.value;
    const analysisType = analysisTypeCheckbox.checked; // 분석 타입 체크박스의 상태 확인

    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('opAge_range', age);
        formData.append('analysisType', analysisType); // 분석 타입 데이터 추가

        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjMwY2RmZjk2MDc4NTg4OGM3MmIyNWUiLCJpYXQiOjE3MTQ2MDY0NDQsImV4cCI6MTcxNTgxNjA0NH0.6I3ZqV6RIHboto91jJbsLHCU3inHt0IqcwwHuAb2uvI';

        axios.post('http://localhost:8080/api/upload/analyze/text', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            }
        })
        .then(response => {
            console.log('Success:', response);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.log('No file selected');
    }
}