import pdf from 'pdf-parse';
import fs from 'fs';

// Polyfill DOMMatrix for pdf-parse 2.x+
if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {};
}

const pdfPath = 'uploads/1773815821839-Qa_Up_resume.pdf'; 
const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(data => {
    console.log('Text extracted:', data.text.substring(0, 500));
    fs.writeFileSync('pdf_parse_local_test.txt', data.text);
}).catch(err => {
    console.error('Error:', err);
});
