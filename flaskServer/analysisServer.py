from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'

@app.route('/analysis', methods=['POST'])
def analysis():
    if request.is_json:
        data = request.get_json()  # JSON 데이터를 파이썬 딕셔너리로 변환
        request_array = data.get('requestArray')  # 'requestArray' 키로 배열 데이터 추출
        if request_array is None:
            return jsonify({'error': 'No requestArray key found'}), 400
        print("Received array:", request_array)
        return jsonify({'received': True, 'arraySize': len(request_array)})
    else:
        return jsonify({'error': 'Request must be JSON'}),

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)