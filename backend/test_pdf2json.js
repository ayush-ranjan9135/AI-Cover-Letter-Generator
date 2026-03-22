import PDFParser from 'pdf2json';
import fs from 'fs';

const safeDecode = (str) => {
  try { return decodeURIComponent(str); } catch { return str; }
};

const parser = new PDFParser();

parser.on('pdfParser_dataError', (err) => {
  console.error('Parser Error:', err);
  fs.writeFileSync('pdf_test_result.txt', 'ERROR: ' + (err.parserError || err.message || JSON.stringify(err)));
  process.exit(1);
});

parser.on('pdfParser_dataReady', (data) => {
  const text = data.Pages
    .flatMap(p => p.Texts)
    .map(t => t.R.map(r => safeDecode(r.T)).join(''))
    .join(' ');
  console.log('Success! Text length:', text.length);
  fs.writeFileSync('pdf_test_result.txt', 'OK len=' + text.length + '\nSample: ' + text.substring(0, 200));
  process.exit(0);
});

const pdfPath = 'uploads/1773815821839-Qa_Up_resume.pdf';
console.log(`Loading PDF: ${pdfPath}`);
parser.loadPDF(pdfPath);
