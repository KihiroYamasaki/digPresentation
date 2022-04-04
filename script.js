'use strict'
//================================================
// イベント登録
//================================================
let target;
target = document.getElementById("exec");
target.addEventListener("click", outputCombWithSiyou);

target = document.getElementById("reset");
target.addEventListener("click", reset);

target = document.getElementById("csv");
target.addEventListener("click", csvOutput);

//================================================
// グローバル変数
//================================================
let objComb ;
let objSiyou ;

// post取得したデータを想定
const objCombtmp = {"syasyu":"***W","sijiNo":"B******* ","kariFixJun":"  ",
  "result":[
    {"kata":"****32-****B        ","ctlKata":"****32  ****B       ","elementCount":3,"record":["A5D FS B1A BS D3E DS "]},
    {"kata":"****32-****B        ","ctlKata":"****32  ****B       ","elementCount":3,"record":["A5D FS B1A CS D3E DS "]},
    {"kata":"****32L-****C      ","ctlKata":"****32L ****C      ","elementCount":3,"record":["A5D RS B1A BS D3E CS "]},
    {"kata":"****32L-****C      ","ctlKata":"****32L ****C      ","elementCount":3,"record":["A5D RS B1A CS D3E CS "]},
    {"kata":"****30-****S        ","ctlKata":"****30  ****S       ","elementCount":3,"record":["A5D GS B1A BS D3E IS "]}
  ]};

const objSiyoutmp = {"resData":
  {"syasyu":"***W","sijino":"B*******",
    "siyoudaiList":[
      {"juchu":"=","siyoudai":"A5D","daijpmei":"タイヤ","daikanamei":"A5D カナ名称","daienmei":"A5D NAME","siyoudaicom":"",
        "siyousaiList":[
          {"siyousai":" F","saikanamei":"16inch","saienmei":"A5D F Name"},
          {"siyousai":" G","saikanamei":"17inch","saienmei":"A5D G Name"},
          {"siyousai":" R","saikanamei":"18inch","saienmei":"A5D R Name"}
        ]
      },
      {"juchu":"","siyoudai":"B1A","daijpmei":"定員","daikanamei":"B1A カナ名称","daienmei":"B1A NAME","siyoudaicom":"",
        "siyousaiList":[
          {"siyousai":" B","saikanamei":"2名","saienmei":"B1A B Name"},
          {"siyousai":" C","saikanamei":"4名","saienmei":"B1A B Name"}
        ]
      },
      {"juchu":"","siyoudai":"D3E","daijpmei":"ボデー形状","daikanamei":"D3E カナ名称","daienmei":"D3E NAME","siyoudaicom":"",
        "siyousaiList":[
          {"siyousai":" C","saikanamei":"ワゴン","saienmei":"D3E C Name"},
          {"siyousai":" D","saikanamei":"クーペ","saienmei":"D3E D Name"},
          {"siyousai":" I","saikanamei":"ハッチバック","saienmei":"D3E I Name"}
        ]
      },
    ]
  }
  ,"responseMessage":""}

//================================================
// 初期化処理
//================================================
function reset(){
  
  
  // ヘッダー初期化(thead)
  const emelentThead = document.getElementById("theadComb");
  for (let cnt = emelentThead.childNodes.length -1; cnt >= 0; cnt--){
    emelentThead.removeChild(emelentThead.childNodes[cnt]);
  }

  // テーブル初期化(tbody)
  const emelentTbody = document.getElementById("tbodyComb");
  for (let cnt = emelentTbody.childNodes.length -1; cnt >= 0; cnt--){
    emelentTbody.removeChild(emelentTbody.childNodes[cnt]);
  }
}
//================================================ 
// 実行処理
//================================================
function outputCombWithSiyou(){

  // 初期化
  reset();

  // データの取得
  /** 今回はデータ通信は行わずにconstに定義する
  *  https://kikki.hatenablog.com/entry/2015/07/28/190946
    const jqXHRList = []
    // POST通信
    jqXHRList.push(
      $.ajax(
        {
          type:"POST",
          contentType:"application/json",
          data: *****,
          datatype: "json",
          url: "https://webapi-********""
		    }
      )
    )
    // POST送信に成功した場合
	  $.when.apply($, jqXHRList).done(function () {
    }
  */
  objComb = objCombtmp;
  objSiyou = objSiyoutmp;
   
  // 車種、指示書Noのセット
  
  //テーブルヘッダーのセット(型式、組合せ、受注＋大分類コード、名称、...) 
  setThead();
  
  //テーブルデータのセット(型式、組合せ、細目コード、細目名称、...)
  setTBody();
}

// =============================================================
//テーブルヘッダーのセット(型式、組合せ、受注＋大分類コード、名称、...) 
// =============================================================
function setThead(){
  
  const emelentThead = document.getElementById("theadComb");

  // タイトル列データを取得（型式、組合せ、...受注＋大分類コード、名称）
  const titleThead =["型式","組合せ"];
  
  let record = objComb.result[0].record[0];
  for(let cnt =0; cnt < record.length; cnt +=7){
    // 大分類コードを取得
    let daiCd= record.substring(cnt, cnt + 3);
    
    // 大分類コードをキーに、受注マーク・名称を取得
    const objDai = gedJuchuDaijpmei(daiCd);
    
    titleThead.push(`${objDai.juchu}${daiCd}`);
    titleThead.push(`${objDai.daijpmei}`);
  }

  // タイトル行を作成
  const trThead = document.createElement("tr");  
  emelentThead.appendChild(trThead);

  // タイトル列にデータをセット
  titleThead.map(
    function(title){
      const thThead = document.createElement("th"); 
      thThead.textContent = title; 
      trThead.appendChild(thThead);
    }
  )
}

//================================================ 
// 大分類コードをキーに、受注マーク・名称を取得
//================================================
function gedJuchuDaijpmei(daiCd){

  const result = {};

  // 大分類コードが一致する大分類リストを取得
  const siyoudaiList = 
    objSiyou.resData.siyoudaiList.filter(
      function(siyoudaiList){
        return daiCd === siyoudaiList.siyoudai;
      }
    )[0];
  
  result.juchu = siyoudaiList.juchu;
  result.daijpmei = siyoudaiList.daijpmei;
  return result;  
}

// =============================================================
//テーブルデータのセット(型式、組合せ、細目コード、細目名称、...)
// =============================================================  
function setTBody(){
  
  const emelentTbody = document.getElementById("tbodyComb");
  
  for(const result of objComb.result){
    for(const record of result.record){

      // データ行を生成
      const trBody = document.createElement("tr");  
      emelentTbody.appendChild(trBody); // 表の中に
      
      // データ列データを取得（型式、組合せ、...受注＋大分類コード、名称）
      const dataTbody =[];
      dataTbody.push(`${result.kata}`);
      dataTbody.push(`${record}`);

      for(let cnt =0; cnt < record.length; cnt +=7){
        // 大分類コードを取得
        let daiCd= record.substring(cnt, cnt + 3);
        let saiCd= record.substring(cnt + 3, cnt + 3 + 2);
        
        // 大分類コード・細目コードをキーに、名称を取得
        const objSai = gedSaikanamei(daiCd,saiCd);
        
        dataTbody.push(`${saiCd}`);
        dataTbody.push(`${objSai.saikanamei}`);

      }

      // データ列にデータをセット
      dataTbody.map(
        function(body){
          const tdBody = document.createElement("td"); 
          tdBody.textContent = body; 
          trBody.appendChild(tdBody);
        }
      )
    } 
  }
}
//================================================
// 大分類コード・細目コードをキーに、名称を取得
//================================================        
function gedSaikanamei(daiCd,saiCd){

  const result = {};
  
  // 大分類コードが一致する大分類リストを取得
  const siyoudaiList = 
    objSiyou.resData.siyoudaiList.filter( 
      (siyoudaiList) => daiCd === siyoudaiList.siyoudai
    )[0];
  
  // 細目コードが一致する細目コードリストを取得
  const siyousaiList = 
    siyoudaiList.siyousaiList.filter(
      (siyousaiList) => saiCd === siyousaiList.siyousai
    )[0];
  
  result.saikanamei = siyousaiList.saikanamei;
  return result;  
}

function csvOutput(){

  const emelentThead = document.getElementById('theadComb');
  const emelentTbody = document.getElementById('tbodyComb');
  
  // 参考文献：https://qiita.com/megadreams14/items/b4521308d5be65f0c544
  let record = [
    ['ID','商品名','価格'],
    [1, 'りんご（箱)', 100],
    [2, 'みかん　(箱)', 1200]
  ]

  let data = records.map((record)=>record.join(',')).join('\r\n');
  let bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
  let blob = new Blob([bom, data], {type: 'text/csv'});
  let url = (window.URL || window.webkitURL).createObjectURL(blob);
  let link = document.createElement('a');
  link.download = 'result.csv';
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
