function uploadFile() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);  // 'file'은 서버 측에서 기대하는 키 이름입니다.

        axios.post('http://localhost:3000/api/upload/analyze/text', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
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