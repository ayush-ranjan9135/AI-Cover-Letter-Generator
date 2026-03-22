import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function testParse() {
    try {
        const form = new FormData();
        form.append('resume', fs.createReadStream('uploads/1773815821839-Qa_Up_resume.pdf'));

        console.log('Sending request to http://localhost:5000/api/parse-pdf...');
        const response = await axios.post('http://localhost:5000/api/parse-pdf', form, {
            headers: form.getHeaders()
        });

        console.log('Success! Text length:', response.data.text.length);
        console.log('Sample:', response.data.text.substring(0, 100));
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testParse();
