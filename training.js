const fs = require('fs')
const path = require('path')
// thử viện tách từ
const vntk = require('vntk')
// phương thức tách từ
const tokenizer = vntk.wordTokenizer()
const tf = require('@tensorflow/tfjs-node')
// đọc file lưu stopword
var ReadStopWordFile = fs.readFileSync(path.join(__dirname, './stopwords.txt'), 'utf8')
var arayStopWords = ReadStopWordFile.split()
// doc file du lieu train
const data = fs.readFileSync('./dataInput.json','utf8')
// parser data json
const words = JSON.parse(data)
// băt đầu tạo mảng từ điển
let dictionary = new Array()
// mảng chứa mảng các từ trong mỗi câu
let lsWordOfData = new Array()
//mảng chứa các mảng ma trận trọng số cho các câu data
let arrayMatrixWeights = new Array()
let vectors = new Array()

// hàm làm sạch câu
const  clean = (str) => {
    // regex loai bo cac ky tu dac biet
    let reqex = /[^()_+\-=\[\]{};':"\\|!@#$%^&*,.<>\/?*~]+/gi
    var newstr = str.match(reqex)
 /*   console.log(newstr)
    result: [ 'tptin', '18it2', 'ict', 'udn', 'vn' ]*/
    // tạo chuỗi mới từ mảng newstr
    let news = ""
    for(let i in newstr) // duyệt qua mảng newstr
        news = news + newstr[i]
/*    console.log(news)
    result: tptin18it2sictudnvn*/
    let te;
    for(let i in arayStopWords) // duyệt qua file stopwords.txt
    {
        let re1 = new RegExp('\w*'+arayStopWords[i],'gi');
        te = news.replace(re1,'');
        // console.log(te)
    }
    // tách  từ
    let splitWord = tokenizer.tag(te,'text')
    // console.log(splitWord)
    return splitWord
    /*
      input:xin chào thời tiết hôm nay thế nào
      output:xin chào thời_tiết hôm_nay thế_nào*/

}
// clean("xin chào, thời tiết hôm nay thế nào?") //test

const arrayUnique = (array) =>{
    let arr = array.concat()
    for(let i=0; i<arr.length; ++i)
        for(let j=i+1; j<arr.length; ++j)
        {
            if(arr[i]===arr[j])
                arr.splice(j--,1)
        }
 /*       console.log(arr)
    output:
            [ 'hôm_nay', 'thời_tiết', 'như', 'thế_nào' ]
            [ 'thời_tiết', 'hôm_nay', 'như', 'thế_nào' ]
            [ 'hôm_nay', 'nắng_mưa', 'thế_nào' ]
            [ 'chào', 'bạn' ]
            [ 'bạn', 'có', 'rảnh', 'không' ]
            [ 'tạm', 'biệt' ]*/
     return arr
}
    for(let i in words)
    {
        /*    console.log(words[i])
            output:
            { text: 'hôm nay thời tiết như thế nào', type: 'weather' }
            { text: 'thời tiết hôm nay như thế nào', type: 'weather' }
            { text: 'hôm nay nắng mưa thế nào', type: 'weather' }
            { text: 'chào bạn', type: 'greetings' }
            { text: 'bạn có rảnh không', type: 'greetings' }
            { text: 'tạm biệt', type: 'greetings' }*/
        // clean
        let cleanString = clean(words[i].text)
        // console.log(cleanString)
        // tạo mảng chứa từ trong mỗi câu
        let textParser = cleanString.split(' ')
        /* console.log(textParser)
         output:
             [ 'hôm_nay', 'thời_tiết', 'như', 'thế_nào' ]
             [ 'thời_tiết', 'hôm_nay', 'như', 'thế_nào' ]
             [ 'hôm_nay', 'nắng_mưa', 'thế_nào' ]
             [ 'chào', 'bạn' ]
             [ 'bạn', 'có', 'rảnh', 'không' ]
             [ 'tạm', 'biệt' ]*/
        lsWordOfData.push(textParser)
        /* console.log(lsWordOfData)
         last result:
         [
             [ 'hôm_nay', 'thời_tiết', 'như', 'thế_nào' ],
             [ 'thời_tiết', 'hôm_nay', 'như', 'thế_nào' ],
             [ 'hôm_nay', 'nắng_mưa', 'thế_nào' ],
             [ 'chào', 'bạn' ],
             [ 'bạn', 'có', 'rảnh', 'không' ],
             [ 'tạm', 'biệt' ]
         ]*/
        dictionary = arrayUnique(dictionary.concat(textParser))
    }
   // console.log('dictionary',dictionary)
/*
output:
    [
        'hôm_nay',  'thời_tiết',
        'như',      'thế_nào',
        'nắng_mưa', 'chào',
        'bạn',      'có',
        'rảnh',     'không',
        'tạm',      'biệt'
    ]*/
// kết thúc tạo từ điển
// đếm số từ trong câu
const countWords = (arrStrs) =>{
    let count = 0
    for(let i in arrStrs)
        count++
    return count
}
// đến tổng số các input trong dữ liệu
let totalInputs = lsWordOfData.length
//console.log('lenght',totalInputs)
/*
data:
  [
      {
          'text':'abc',
          'type':'cde'
      }
      .
      .
      .
  ]*/
    // tạo ma trận trọng sô cho từ câu theo từ điển
    for(let i in lsWordOfData)
    {
        let worDict_i = new Map();
        for(let j in dictionary) {
            worDict_i.set(dictionary[j],0);
        }

        for (let word of lsWordOfData[i]) {
            //cập nhật lại trọng số là số lần xuất hiện của từ trong câu
            var index = worDict_i.get(word);
            index +=1;
            worDict_i.set(word,index);
        }
        let tong_so_tu_trong_cau = countWords(lsWordOfData[i]);

        for (let word of lsWordOfData[i]) {
            //cập nhật lại trọng số là TF-IDF của từ trong câu
            var index = worDict_i.get(word)
            //tính TF
            let tf = index/tong_so_tu_trong_cau
            //tính IDF
            //-tìm số câu chứa word
            let count = 0
            for (let w of lsWordOfData) {
                for (let j of w){
                    if(word === j) count++
                }
            }
            //-IDF = số câu / sô câu có từ word;
            let idf = totalInputs/count
            worDict_i.set(word,Number((tf*idf).toFixed(2)))

        }
        arrayMatrixWeights.push( worDict_i)
    }
    // console.log('arrayMatrixWeights',arrayMatrixWeights)

for(let maps of arrayMatrixWeights)
{
    let maptoArray = [...maps.values()]
    vectors.push(maptoArray)
}
//console.log('vectors: ',vectors)

//mảng lưu các loại lớp
let types = new Array()
//mảng lưu giá trị type của câu dữ liệu
let typeVals = new Array()
for (let type of words) {
    typeVals.push( type.type)
}
types = [...new Set(typeVals)]

let typesInput = []
typeVals.map((item) => {
    typesInput.push(types.indexOf(item))
})
console.log('class: ',typesInput,'\n',types)

module.exports = {
    dictionary,
    lsWordOfData,
    countWords,
    totalInputs,
    types
}

// ------------------------------------------------------------------------------------------



let wordInputTensor = tf.tensor2d(vectors)
console.log('wordInputTensor',wordInputTensor.dataSync())
let typeTensor = tf.tensor1d(typesInput, 'int32')
let typeinputTensor = tf.oneHot(typeTensor,types.length)

typeinputTensor.print()

//tạo model
let model = tf.sequential()

//thêm hiddenlayer
let hiden = tf.layers.dense({
    inputShape: dictionary.length,
    units: 16,
    activation: "sigmoid",
})

let output = tf.layers.dense({
    units: types.length,
    activation: "softmax",
})

model.add(hiden)
model.add(output)

model.compile({
    optimizer: tf.train.sgd(0.2),
    loss: "categoricalCrossentropy"
})


//train model
let options = {
    epochs: 100,
    validationSplit: 0.1,
    shuffle: true
}
    // model.weights.forEach(w=>{
    //     console.log(w.name, w.shape);
    // })
async function train(){
    await model.fit(wordInputTensor,typeinputTensor,options)
    await model.save('file://model')
}
// train()

