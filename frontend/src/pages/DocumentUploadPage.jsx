import React, { useState, useRef, useEffect } from 'react';

const DocumentUploadPage = () => {
  const [document, setDocument] = useState(null);
  const [signature, setSignature] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [downloadPath, setDownloadPath] = useState(null); // Declare downloadPath state variable
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);

    if (ctx) {
      ctx.strokeStyle = 'black'; // Set drawing color to black
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, []);

  const handleDocumentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setUploadError('Invalid document type. Only PDF and DOCX files are allowed.');
        setDocument(null);
        return;
      }

      if (file.size > maxSize) {
        setUploadError('Document size exceeds the limit of 5MB.');
        setDocument(null);
        return;
      }

      setDocument(file);
      setUploadError('');
    }
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png']; // Only PNG allowed for signature file upload
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        setUploadError('Invalid signature type. Only PNG images are allowed for signature upload.');
        setSignature(null);
        return;
      }

      if (file.size > maxSize) {
        setUploadError('Signature size exceeds the limit of 2MB.');
        setSignature(null);
        return;
      }

      setSignature(file);
      setUploadError('');
    }
  };

  const handleUpload = async () => {
    if (!document) {
      setUploadError('Please upload a document.');
      return;
    }

    let signatureBlob = null;
    if (!signature) {
      // Get signature from canvas
      const canvas = canvasRef.current;
      if (!canvas) {
        setUploadError('Canvas element not found.');
        return;
      }
      signatureBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!signatureBlob) {
        setUploadError('Failed to capture signature from canvas.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('document', document);
    if (signature) {
      formData.append('signature', signature); // Use uploaded signature file
    } else if (signatureBlob) {
      formData.append('signature', signatureBlob, 'signature.png'); // Use canvas signature blob
    } else {
      setUploadError('No signature provided.');
      return;
    }

    performBinding(formData);
  };

  const performBinding = async (formData) => {
    try {
      const response = await fetch('/api/documents/bind', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('Document signed successfully! Download will start in a new tab.');
        // Use window.open to trigger download in a new tab
        window.open(`/uploads/${data.path.split('/').pop()}`, '_blank');
      } else {
        const errorData = await response.json();
        setUploadError('Binding failed: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      setUploadError('Error binding document: ' + error.message);
    }
  };

  const startDrawing = () => {
    setDrawing(true);
    if (context) {
      context.beginPath();
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing || !context) return;

    const { offsetX, offsetY } = nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };


  return (
    <div>
      <h1>Document Upload</h1>
      <p>Upload your document and signature here.</p>
      <input type="file" accept=".pdf,.docx" onChange={handleDocumentChange} />

      <div>
        <h3>Draw Signature</h3>
        <canvas
          ref={canvasRef}
          width="300"
          height="150"
          style={{ border: '1px solid #000', cursor: 'crosshair' }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
        ></canvas>
        <div>
          <button onClick={clearCanvas}>Clear Signature</button>
        </div>
      </div>

      <div>
        <h3>Upload Signature (PNG only)</h3>
        <input type="file" accept="image/png" onChange={handleSignatureChange} />
      </div>


      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
      <button onClick={handleUpload}>Upload and Bind</button>
    </div>
  );
};

export default DocumentUploadPage;
