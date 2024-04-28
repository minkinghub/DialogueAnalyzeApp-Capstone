function uploadFile() {
    const input = document.getElementById('fileInput');
    const ageInput = document.getElementById('ageInput'); // 나이 입력 필드 접근
    const file = input.files[0];
    const age = ageInput.value; // 입력된 나이 읽기

    if (file) {
        const formData = new FormData();
        formData.append('file', file); // 파일 데이터 추가
        formData.append('OpAge_range', age); // 나이 데이터 추가

        // 임시로 사용할 토큰
        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZDgwYjVhYzhhYWNkZTNhYmJjODQiLCJpYXQiOjE3MTQzMjM3OTUsImV4cCI6MTcxNTUzMzM5NX0.Kek0zjaOZ43DvJoYzLTAxIdRYD55QsZ76zAFQ5zUG8c';

        axios.post('http://localhost:3000/api/upload/analyze/text', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token // Authorization 헤더 추가
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