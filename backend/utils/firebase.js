const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const format = require("util").format;
const RecipeModel = require('../models/recipeModel'); // mongoDB에 url 저장용
const mongoose = require('mongoose');

// firebase에 storage에 파일 업로드 및 mongoDB에 url 저장
const uploadToFirebase = async (file) => {
  const { originalname, buffer } = file;
  const bucket = admin.storage().bucket();
  const blob = bucket.file(originalname);
  const storage = new Storage();
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      console.error(error);
      reject('잠시 오류가 발생했어요! 지금은 이미지를 업로드할 수 없습니다.');
    });

    blobStream.on('finish', async () => {
      // Firebase Storage에 저장된 파일의 URL을 가져옴
      const publicUrl = format(
        `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`
      );
      // mongoDB에 images.recipe에 image url을 저장
      const db = mongoose.connection.useDb('images'); // images DB에 접근
      const collection = db.collection('recipe'); //images DB의 recipe collection에 접근

      // images.recipe에서 가장 큰 imageId 찾아서 1을 더한 후 imageId로 저장
      const maxImageId = await RecipeModel.findOne().sort({ imageId: -1 });
      let newImageId = 1;
      if (maxImageId && maxImageId.imageId) {
        newImageId = maxImageId.imageId + 1;
      }
      const recipe = new RecipeModel({ imageUrl: publicUrl, imageId: newImageId }); // 스키마 정의 중 imageUrl 사용
      await collection.insertOne(recipe); // recipe collection에 저장
      resolve(publicUrl);
    });

    blobStream.end(buffer);
  });
};

module.exports = { uploadToFirebase };
