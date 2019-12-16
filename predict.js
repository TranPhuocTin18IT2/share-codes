const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')
const path = require('path')
// thu vien tach tu
const vntk = require("vntk")
const train = require('./training')
// phương thức tách từ
const tokenizer = vntk.wordTokenizer();
let text = 'xin chào, ngày mai thời tiết thế nào?'
let lswords = new Array() // mảng chứa các từ/ cụm từ được tách từ câu
let arrayMatrixWeights = new Array() //mảng chứa các mảng ma trận trọng số cho các câu data
let worDictTest_i = new Map() 
 //clean cau
let cleanMsg = (msg) =>{
                         let reqex = /[^()_+\-=\[\]{};':"\\|!@#$%^&*,.<>\/?*~]+/gi;
                         let result = msg.match(reqex); // loai bo cac ki tu dac biet
                         let newStr = ""; // gan chuoi moi la newStr
                         for (let i in result) newStr = newStr + result[i]; // duyet mang de tao chuoi moi
                         // tách  từ
                         let splitWord = tokenizer.tag(newStr, "text");
                         console.log(splitWord);
                         return splitWord;
                       }
// chuyen vao mang
let msgToArray = (msg) =>{
                           let clean = cleanMsg(msg)
                           lswords = clean.split(' ')
                         }
msgToArray(text)
console.log(lswords)

for (let j in train.dictionary) {
  worDictTest_i.set(train.dictionary[j], 0);
}

for (let word of lswords) {
  //cập nhật lại trọng số là số lần xuất hiện của từ trong câu
  var index = worDictTest_i.get(word);
  index += 1;
  worDictTest_i.set(word, index);
}
let tong_so_tu_trong_cau = train.countWords(lswords);

for (let word of lswords) {
  //cập nhật lại trọng số là TF-IDF của từ trong câu
  var index = worDictTest_i.get(word);
  //tính TF
  let tf = index / tong_so_tu_trong_cau;
  //tính IDF
  //-tìm số câu chứa word
  let count = 0;
  for (let w of train.lsWordOfData) {
    for (let j of w) {
      if (word === j) count++;
    }
  }
  //-IDF = số câu / sô câu có từ word;
  let idf = train.totalInputs / count;
  worDictTest_i.set(word, Number((tf * idf).toFixed(2)));

}
Array.from (worDictTest_i).map(w=>{
   console.log(w)
})

let mapToArrayTest = [...worDictTest_i.values()]
console.log("test: " + mapToArrayTest)
arrayMatrixWeights.push(mapToArrayTest)

async function loadModel() {
  let loadmodel = await tf.loadLayersModel('file://model/model.json')
  await loadmodel.weights.forEach(element => {
    console.log(element.name, element.shape)
  })

  console.log(arrayMatrixWeights)
  let pridictTensor = loadmodel.predict(tf.tensor2d(arrayMatrixWeights)).argMax(1).dataSync(0);
  console.log(train.types[pridictTensor])
}
loadModel()