/*
  NRRU GOWN ORDER - Google Apps Script backend
  1) Create a Google Sheet.
  2) Extensions > Apps Script, paste this file.
  3) Run setup() once and authorize.
  4) Deploy > New deployment > Web app
     Execute as: Me
     Who has access: Anyone
  5) Copy Web app URL into CONFIG.apiUrl in index.html and track.html
*/

const SHEET_NAME = 'Orders';
const DRIVE_FOLDER_NAME = 'NRRU GOWN ORDER - Slips';

function getSS_(){ return SpreadsheetApp.getActiveSpreadsheet(); }
function getSheet_(){
  const ss = getSS_();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}

function setup(){
  const sh = getSheet_();
  const headers = ['CreatedAt','OrderID','Name','StudentID','Phone','Email','Degree','Program','ProgramAbbr','TrimColor','Size','Chest','Shoulder','Sleeve','Length','Price','Payment','SlipURL','Status','PickupDate','PickupTime','PickupLocation','Note'];
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, headers.length);
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (!folders.hasNext()) DriveApp.createFolder(DRIVE_FOLDER_NAME);
  return 'Ready';
}

function doPost(e){
  try{
    setup();
    const p = e.parameter || {};
    let orderId = p.orderId || makeOrderId_();
    const sh = getSheet_();
    if (findByOrderId_(orderId)) orderId = makeOrderId_();
    let slipUrl = '';
    if (p.slipData){
      const folder = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME).next();
      const bytes = Utilities.base64Decode(p.slipData);
      const blob = Utilities.newBlob(bytes, p.slipType || 'image/jpeg', `${orderId}-${p.slipName || 'slip.jpg'}`);
      const file = folder.createFile(blob);
      slipUrl = file.getUrl();
    }
    sh.appendRow([
      new Date(), orderId, p.name||'', p.studentId||'', p.phone||'', p.email||'', p.degree||'', p.program||'', p.programAbbr||'', p.trimColor||'', p.size||'', p.chest||'', p.shoulder||'', p.sleeve||'', p.length||'', Number(p.price||0), p.payment||'', slipUrl, 'รอตรวจสอบสลิป', '', '', '', p.note||''
    ]);
    return json_({ok:true,orderId});
  }catch(err){
    return json_({ok:false,message:String(err && err.message ? err.message : err)});
  }
}

function doGet(e){
  try{
    setup();
    const q = String((e.parameter||{}).q || '').trim();
    if (!q) return json_({ok:false,message:'Missing q'});
    const order = findOrder_(q);
    return json_({ok:!!order, order:order || null});
  }catch(err){
    return json_({ok:false,message:String(err && err.message ? err.message : err)});
  }
}

function findByOrderId_(id){
  const sh = getSheet_();
  if (sh.getLastRow()<2) return null;
  const vals = sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  return vals.find(r=>String(r[1])===String(id)) || null;
}

function findOrder_(q){
  const sh = getSheet_();
  if (sh.getLastRow()<2) return null;
  const vals = sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  for(let i=vals.length-1;i>=0;i--){
    const r=vals[i];
    if(String(r[1]).toLowerCase()===q.toLowerCase() || String(r[3])===q){
      return {
        createdAt:r[0],orderId:r[1],name:r[2],studentId:r[3],phone:r[4],email:r[5],degree:r[6],program:r[7],programAbbr:r[8],trimColor:r[9],size:r[10],chest:r[11],shoulder:r[12],sleeve:r[13],length:r[14],price:r[15],payment:r[16],slipUrl:r[17],status:r[18]||'รอตรวจสอบสลิป',pickupDate:r[19]||'',pickupTime:r[20]||'',pickupLocation:r[21]||'',note:r[22]||''
      };
    }
  }
  return null;
}

function makeOrderId_(){
  const tz = Session.getScriptTimeZone() || 'Asia/Bangkok';
  const stamp = Utilities.formatDate(new Date(), tz, 'yyyyMMdd');
  const rnd = Math.floor(Math.random()*9000)+1000;
  return `NRRU-${stamp}-${rnd}`;
}

function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
