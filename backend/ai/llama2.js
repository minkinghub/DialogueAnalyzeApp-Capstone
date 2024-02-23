const Replicate = require("replicate");
require('dotenv').config({ path: '../../.env'}); // env 파일 사용

console.log("TOKEN값: ", process.env.REPLICATE_API_TOKEN);
const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN});
const model = "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478";
const input = {prompt: "해변에 서있는 19살 생일을 맞은 이구아나 청년"};

async function run() {
  const output = await replicate.run(model, { input });
  console.log(output);
}

run();