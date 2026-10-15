
# CryptoSub

แพลตฟอร์มจัดการและชำระค่าบริการรายเดือนบนเว็บ ที่เชื่อมต่อ MetaMask กับ Smart Contract บน BNB Smart Chain Testnet รองรับการชำระเงินด้วย **tBNB** (Native) หรือ **SubCoin (SUB)** ซึ่งเป็นโทเคน ERC-20/BEP-20 ประจำระบบ

> **สถานะ:** โปรเจกต์นี้เป็นตัวอย่างเพื่อการเรียนรู้และทดสอบบน Testnet เท่านั้น ยังไม่ควรใช้กับเงินจริงหรือ Mainnet โดยไม่ผ่านการตรวจสอบความปลอดภัย

## ไฟล์ในโปรเจกต์

- `index.html` — หน้าเว็บทั้งหมด: Landing, Dashboard, หน้าจัดการสับสคริปชัน, ประวัติชำระเงิน, Modal การชำระเงิน และ Dev Toolbar
- `app.js` — ตรรกะการเชื่อมต่อ MetaMask, การอ่านยอดเงินจาก BSC Testnet และการส่งธุรกรรมชำระเงินจริง
- `style.css` — สไตล์เสริมของโปรเจกต์ที่ทำงานร่วมกับ Tailwind CSS
- `SUB.sol` — Smart Contract ตัวอย่างของโทเคน **SubCoin (SUB)** มาตรฐาน ERC-20/BEP-20
- `.gitignore` — รายการไฟล์ที่ไม่ควรส่งขึ้น GitHub

## สิ่งที่ต้องมีก่อน

- Browser ที่ติดตั้ง MetaMask
- BNB Smart Chain Testnet ใน MetaMask (Chain ID `97`, hex `0x61`)
- tBNB สำหรับจ่ายค่า Gas (รับฟรีจาก [Faucet](https://www.bnbchain.org/en/testnet-faucet))
- โทเคน SUB ที่ Deploy แล้วบน BSC Testnet (หรือ Token ERC-20/BEP-20 ของคุณเองที่ใช้ 18 decimals)
- Git หากต้องการ push repository จากเครื่องตัวเอง

## วิธีตั้งค่าให้ใช้ Token ของตัวเอง

1. สร้าง Token ของตัวเองบน **BNB Smart Chain Testnet** ด้วยเครื่องมือที่คุณเลือก และบันทึก Token Contract Address ไว้
2. เปิด `SUB.sol` ใน Remix IDE หรือเครื่องมือ Solidity ที่รองรับ `pragma solidity ^0.8.20` แล้ว Compile
3. Deploy Contract เพื่อสร้าง Token SUB ของคุณ (กำหนดชื่อ, symbol, supply ตามต้องการ)
4. ในไฟล์ `app.js` แทนค่าที่อยู่ `CONFIG.subToken.address` ด้วย Token Contract Address ที่เพิ่ง Deploy
5. ในไฟล์ `app.js` แทนค่าที่อยู่ `CONFIG.treasuryAddress` ด้วยกระเป๋าที่จะรับเงินทั้งหมด (หากเว้นว่าง ระบบจะโอนกลับเข้าตัวเองแบบเดโม)
6. ตรวจสอบว่ารายละเอียดใน `CONFIG.subToken` (ชื่อ, symbol, decimals) ตรงกับ Token ที่ Deploy จริง
7. เปิดหน้าเว็บผ่าน `http://localhost` หรือ HTTPS (เช่น VS Code Live Server หรือ GitHub Pages) เพื่อให้การเชื่อมต่อ MetaMask ทำงานได้ตามข้อกำหนดของ Browser
8. ทดสอบด้วย Wallet แยกจาก Wallet ผู้ Deploy: เชื่อม MetaMask บน BSC Testnet, ตรวจสอบยอด tBNB และ SUB แล้วทดลองสมัครสมาชิกและชำระเงิน

## วิธีรันในเครื่อง

ใช้ VS Code ติดตั้งส่วนขยาย Live Server จากนั้นคลิกขวา `index.html` แล้วเลือก **Open with Live Server** หรือใช้ local web server อื่นก็ได้ ไม่จำเป็นต้องติดตั้ง Node.js สำหรับหน้าเว็บเวอร์ชันนี้

## ข้อจำกัดและคำเตือนด้านความปลอดภัย

- `CONFIG.treasuryAddress` ใน `app.js` เป็นเพียงที่อยู่ปลายทางที่กำหนดไว้ล่วงหน้า ระบบยังไม่มีระบบยืนยันตัวตนหรือตรวจสอบสิทธิ์ผู้รับเงิน
- การชำระเงินบนโหมด MetaMask เป็นธุรกรรมจริงบน Testnet ทุกครั้งจะถูกบันทึกบนบล็อกเชน และไม่สามารถย้อนกลับได้
- ระบบยังไม่มีระบบป้องกันการ Claim ซ้ำหรือระบบตรวจสอบยอดจากเซิร์ฟเวอร์ การสมัครสมาชิกถูกจัดเก็บใน `localStorage` ของ Browser เท่านั้น
- หาก treasury หรือ Contract Token ไม่มีอยู่จริง หรือไม่ตรงกับ `CONFIG.subToken.address` การชำระด้วย SUB อาจล้มเหลวหรือไม่ถูกหักจากบัญชี
- `CONFIG.tbnbToSubRate` เป็นเพียงอัตราแปลงเดโม (ค่าเริ่มต้น 1 tBNB = 1 SUB) ไม่ใช่อัตราแลกเปลี่ยนจริง
- เวอร์ชันนี้ยัง **ไม่มีระบบ Escrow หรือการคืนเงิน** และยังไม่มีการตรวจสอบว่าผู้ใช้ได้ใช้บริการจริงหรือไม่
- ห้าม commit Private Key, Secret Recovery Phrase, ไฟล์ `.env` หรือข้อมูลลับใด ๆ ขึ้น GitHub
- ห้ามใช้ Smart Contract หรือหน้าจอชำระเงินนี้กับเงินจริง/Mainnet โดยไม่ให้ผู้เชี่ยวชาญตรวจสอบก่อน

## License

MIT — ดูไฟล์ `LICENSE`
