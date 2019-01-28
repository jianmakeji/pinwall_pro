const fs = require('fs');
const readline = require('readline');

class PropertiesFileUtil{

  static readFileToArr(fReadName,callback){
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var arr = new Array();
    objReadline.on('line',function (line) {
        arr.push(line);
        //console.log('line:'+ line);
    });
    objReadline.on('close',function () {
       // console.log(arr);
        callback(arr);
    });
  }

}

module.exports = PropertiesFileUtil;
