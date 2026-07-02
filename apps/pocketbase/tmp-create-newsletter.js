const fs = require('fs');

(async () => {
  const base = 'http://127.0.0.1:8090';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NDIwMDAwNCwiaWQiOiI4MGJma21pMnBseHQwNWIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.EbjgQ1R8yAcwLCtvtoMd3tL-GXv7fwAPfrAGDniM8Ho';
  const filePath = 'apps/pocketbase/tmp-test.pdf';

  const pdfContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 72 720 Td (Hello PocketBase) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000103 00000 n \n0000000193 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n290\n%%EOF`;

  fs.writeFileSync(filePath, pdfContent, 'utf8');

  const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('title', 'Test Newsletter');
  formData.append('description', 'Backend test record');
  formData.append('type', 'newspaper');
  formData.append('published', 'true');
  formData.append('published_date', new Date().toISOString().split('T')[0]);
  formData.append('file', fileBlob, 'test-newsletter.pdf');

  const response = await fetch(`${base}/api/collections/newsletters/records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await response.text();
  console.log('status', response.status);
  console.log(text);
})();
