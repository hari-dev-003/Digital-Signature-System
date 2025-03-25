import React, { useState } from 'react';

const VerificationPage = () => {
  const [verifiedDocument, setVerifiedDocument] = useState(null);
  const [verificationResult, setVerificationResult] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleDocumentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // File type validation (PDF, DOCX) and size validation (max 5MB)
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setUploadError('Invalid document type. Only PDF and DOCX files are allowed.');
        setVerifiedDocument(null);
        return;
      }

      if (file.size > maxSize) {
        setUploadError('Document size exceeds the limit of 5MB.');
        setVerifiedDocument(null);
        return;
      }

      setVerifiedDocument(file);
      setUploadError(''); // Clear any previous errors
    }
  };

  const handleVerifySignature = async () => {
    if (!verifiedDocument) {
      setUploadError('Please upload a document to verify.');
      setVerificationResult('');
      return;
    }

    const formData = new FormData();
    formData.append('verifiedDocument', verifiedDocument, { contentType: 'application/pdf' });

    try {
      const response = await fetch('/api/documents/verify', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationResult(data.message || 'Signature Verified!'); // Display verification message
        setUploadError('');
      } else {
        const errorData = await response.json();
        setVerificationResult('');
        setUploadError('Verification failed: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      setVerificationResult('');
      setUploadError('Error verifying document: ' + error.message);
    }
  };


  return (
    <div>
      <h1>Document Verification</h1>
      <p>Upload your signed document to verify the signature.</p>
      <input type="file" accept=".pdf,.docx" onChange={handleDocumentChange} />
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
      <button onClick={handleVerifySignature}>Verify Signature</button>

      {verificationResult && <p>{verificationResult}</p>}
      {verificationResult && verificationResult === 'Signature Verified! Document is valid.' ? (
        <p style={{ color: 'green' }}>{verificationResult}</p>
      ) : verificationResult ? (
        <p style={{ color: 'red' }}>{verificationResult}</p>
      ) : null}
    </div>
  );
};

export default VerificationPage;
