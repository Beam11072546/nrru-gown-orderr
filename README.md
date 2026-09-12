# NRRU GOWN ORDER — ร้านค้าฟรีแบบไม่ใช้ WooCommerce

Repository นี้เป็นระบบสั่งตัดชุดครุยออนไลน์สำหรับมหาวิทยาลัยราชภัฏนครราชสีมา โดยรองรับทั้งโหมดเดโมและโหมดใช้งานจริงผ่าน Google Sheets + Google Apps Script

## ไฟล์หลัก
- `index.html` — หน้าร้าน เลือกชุด เลือกหลักสูตร เลือกไซส์ คำนวณราคา และยืนยันคำสั่งซื้อ
- `track.html` — หน้าติดตามสถานะด้วยเลขคำสั่งซื้อหรือรหัสนักศึกษา
- `apps-script/Code.gs` — Backend สำหรับเก็บออเดอร์ใน Google Sheets และสลิปใน Google Drive

## โหมด 1: Demo ฟรีทันที
เปิด `index.html` แล้วสั่งซื้อได้เลย ระบบคำนวณราคา สร้างเลขออเดอร์ และเก็บคำสั่งซื้อใน `localStorage` ของเบราว์เซอร์ จากนั้น `track.html` สามารถค้นหาสถานะได้ในเครื่องเดิม

## โหมด 2: ใช้งานจริงข้ามอุปกรณ์ด้วย Google Sheets + Apps Script
1. สร้าง Google Sheet ใหม่ เช่น `NRRU GOWN ORDER`
2. ไปที่ **Extensions > Apps Script**
3. วางโค้ดจาก `apps-script/Code.gs`
4. รันฟังก์ชัน `setup()` หนึ่งครั้งและกดยอมรับสิทธิ์
5. ไปที่ **Deploy > New deployment > Web app**
6. ตั้งค่า **Execute as: Me**
7. ตั้งค่า **Who has access: Anyone**
8. กด Deploy แล้วคัดลอก Web app URL
9. เปิด `index.html` แล้วแทนค่า `const API_URL=''` ด้วย URL ที่ได้
10. เปิด `track.html` แล้วแทนค่า `const CONFIG={apiUrl:''}` ด้วย URL เดียวกัน

## เปิด GitHub Pages ฟรี
Repository นี้คือ:
`https://github.com/Beam11072546/nrru-gown-orderr`

ให้ไปที่:
**Settings > Pages > Build and deployment > Source: Deploy from a branch**

จากนั้นเลือก:
- Branch: `main`
- Folder: `/ (root)`

กด Save แล้วรอสักครู่ เว็บจะอยู่ที่ประมาณ:
`https://beam11072546.github.io/nrru-gown-orderr/`

จากนั้นนำ URL นี้ไปใส่ปุ่ม “สั่งตัดชุดครุย” ใน WordPress ได้เลย

## การอัปเดตสถานะของร้าน
แก้ใน Google Sheet คอลัมน์ `Status` เป็นหนึ่งใน:
- รอตรวจสอบสลิป
- กำลังตัดเย็บ
- พร้อมรับชุด

ถ้าสถานะเป็น `พร้อมรับชุด` ให้กรอก `PickupDate`, `PickupTime`, `PickupLocation` ระบบติดตามจะแสดงข้อมูลเหล่านี้ให้ลูกค้า

## QR Code
ตอนนี้หน้าเว็บมี placeholder สำหรับ QR Code เมื่อมี QR จริง สามารถเปลี่ยนเป็นรูป QR ของร้านได้ภายหลัง

## หมายเหตุ
- ไฟล์สลิปจำกัด 3 MB ในหน้าเว็บตัวอย่าง
- Apps Script จะเก็บสลิปใน Google Drive โฟลเดอร์ `NRRU GOWN ORDER - Slips`
- ระบบนี้เหมาะกับงานโปรเจกต์/ร้านขนาดเล็กและไม่ต้องเสียค่า WooCommerce
