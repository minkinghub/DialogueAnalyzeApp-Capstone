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

        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjMwY2RmZjk2MDc4NTg4OGM3MmIyNWUiLCJpYXQiOjE3MTYwOTYxMDAsImV4cCI6MTcxNzMwNTcwMH0.RcTOWJhioKVl3vNejeZRMaj5l5EUEAvWcNX-G83Lghc';

        axios.post('http://35.216.126.98:8080/api/upload/analyze/text', formData, {
            headers: {
                // 'Content-Type': 'application/json',
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