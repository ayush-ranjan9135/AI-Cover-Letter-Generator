import PDFParser from 'pdf2json';
import fs from 'fs';

const pdfParser = new PDFParser(null, 1);

pdfParser.on("pdfParser_dataError", errData => console.error('Error:', errData));
pdfParser.on("pdfParser_dataReady", pdfData => {
    console.log('Text Content:', pdfParser.getRawTextContent());
    process.exit(0);
});

// Use the file from the user's screenshot if possible, or any pdf in the project
const pdfPath = 'backend/uploads/1774152983708-ciscoSTE.pdf'; 
if (fs.existsSync(pdfPath)) {
    console.log('Parsing', pdfPath);
    pdfParser.loadPDF(pdfPath);
} else {
    console.log('File not found, checking for any other PDF in uploads...');
    const uploads = fs.readdirSync('backend/uploads');
    const firstPdf = uploads.find(f => f.endsWith('.pdf'));
    if (firstPdf) {
        console.log('Parsing', `backend/uploads/${firstPdf}`);
        pdfParser.loadPDF(`backend/uploads/${firstPdf}`);
    } else {
        console.log('No PDFs found in uploads.');
        process.exit(1);
    }
}
