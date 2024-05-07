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

        const historyData = {
            historyKey: "6637a2c4879a1a77270b4f4c"
        }

        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjMzNGQ2NzI4OGVlZDQyNGViNTkwNjAiLCJpYXQiOjE3MTQ5OTcwOTMsImV4cCI6MTcxNjIwNjY5M30.ZY-RVL2pHjBc-wR1bx8apfHf9BzfEZaj70wxD-V72S8';

        axios.post('http://35.216.126.98:8080/api/user/history/detail', historyData, {
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
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