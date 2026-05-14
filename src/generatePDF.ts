import jsPDF from 'jspdf';
import './fonts/BIZUDPGothic-Regular-normal.js';

interface DayData {
    day: number;
    week: string;
    holiday: string;
    clock_in_time: string;
    clock_out_time: string;
    break_time: string;
    working_time: string;
    remarks: string;
  }

// PDF出力関数
export const generatePDF = async (
    employee_name: string,
    year: number,
    month: number,
    list: DayData[],
    summary: { total_working_time: string; total_records: number }
) => {

    try {
        
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.setFont("BIZUDPGothic");
      
        let y = 10;
        doc.text(`${year}年${month}月 勤務表`, 10, y);
        y += 10;
        doc.text(`名前：${employee_name}`, 10, y);
        y += 10;
      
        // ヘッダー
        doc.text('日  週  祝日  出勤  退勤  休憩  勤務  備考', 10, y);
        y += 8;
      
        // データ一覧
        list.forEach((item) => {
          const line = `${item.day}  ${item.week}  ${item.holiday || '-'}  ${item.clock_in_time || '-'}  ${item.clock_out_time || '-'}  ${item.break_time || '-'}  ${item.working_time || '-'}  ${item.remarks || ''}`;
          doc.text(line, 10, y);
          y += 8;
        });
      
        y += 5;
        doc.text(`出勤回数: ${summary.total_records}`, 10, y);
        y += 8;
        doc.text(`実労働時間: ${summary.total_working_time}`, 10, y);
      
        doc.save(`${year}年${month}月_${employee_name}_勤務表.pdf`);
    } catch (error) {
        console.error("PDF変換エラー:", error);
    }
};


// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// // PDF出力関数
// export const generatePDF = async (pdfName:string,pdfYear:number,pdfMonth:number) => {
//     const element = document.getElementById("pdf-content"); // モーダル全体を取得
//     if (!element) {
//         console.error("PDF変換エリアが見つかりません");
//         return;
//     }

//     try {
//         const canvas = await html2canvas(element); // HTMLを画像に変換
//         const imgData = canvas.toDataURL("image/png"); // 画像データを取得

//         const pdf = new jsPDF("p", "mm", "a4"); // A4サイズのPDFを作成
//         const imgWidth = 190; // A4横幅(mm)
//         const imgHeight = (canvas.height * imgWidth) / canvas.width; // 画像のアスペクト比を維持

//         pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight); // 画像をPDFに追加
//         pdf.save(`${pdfYear}年${pdfMonth}月_${pdfName}_勤怠管理.pdf`); // PDFを保存
//     } catch (error) {
//         console.error("PDF変換エラー:", error);
//     }
// };