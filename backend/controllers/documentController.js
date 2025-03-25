const uploadDocument = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const documentFile = req.files.document;
    const uploadPath = __dirname + '/../../uploads/' + documentFile.name;

    documentFile.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send({
        message: 'File uploaded!',
        path: '/uploads/' + documentFile.name
      });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error uploading document', error: error.message });
  }
};

const { PDFDocument, rgb, StandardFonts, EmbeddableFonts } = require('pdf-lib');
const fs = require('fs').promises;

const bindSignatureToDocument = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length !== 2 || !req.files.document || !req.files.signature) {
      return res.status(400).send('Both document and signature files are required.');
    }

    const documentFile = req.files.document;
    const signatureFile = req.files.signature;

    // Ensure document is PDF
    if (documentFile.mimetype !== 'application/pdf') {
      return res.status(400).send('Only PDF documents are supported for signature binding.');
    }

    // Ensure signature is an image (PNG or JPEG)
    if (!['image/png', 'image/jpeg'].includes(signatureFile.mimetype)) {
      return res.status(400).send('Only PNG or JPEG images are supported for signatures.');
    }

    const documentPath = __dirname + '/../../uploads/doc_' + Date.now() + '_' + documentFile.name;
    const signaturePath = __dirname + '/../../uploads/sig_' + Date.now() + '_' + signatureFile.name;

    await documentFile.mv(documentPath);
    await signatureFile.mv(signaturePath);

    console.log(`Document uploaded to: ${documentPath}, size: ${documentFile.size} bytes`);
    console.log(`Signature uploaded to: ${signaturePath}, size: ${signatureFile.size} bytes`);

    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(await fs.readFile(documentPath));
    } catch (pdfError) {
      console.error('Error loading PDF document:', pdfError);
      return res.status(500).json({ message: 'Error loading PDF document', error: pdfError.message });
    }
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    let signatureImageBytes;
    try {
      signatureImageBytes = await fs.readFile(signaturePath);
    } catch (sigError) {
      console.error('Error reading signature image:', sigError);
      return res.status(500).json({ message: 'Error reading signature image', error: sigError.message });
    }
    let signatureImage;
    try {
      signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    } catch (embedError) {
      console.error('Error embedding signature image:', embedError);
      return res.status(500).json({ message: 'Error embedding signature image', error: embedError.message });
    }
    const signatureDims = signatureImage.scale(0.5);

    firstPage.drawImage(signatureImage, {
      x: 50,
      y: 50,
      width: signatureDims.width,
      height: signatureDims.height,
    });

    // Add a unique identifier text to the page
    const uniqueText = 'Signed with Digital Signature System (DSS)';
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    firstPage.drawText(uniqueText, {
      x: 50,
      y: 20, // Position below the signature
      font,
      size: 10,
      color: rgb(0, 0, 0), // Black color
    });

    let signedDocumentBytes;
    try {
      signedDocumentBytes = await pdfDoc.save();
    } catch (saveError) {
      console.error('Error saving signed document:', saveError);
      return res.status(500).json({ message: 'Error saving signed document', error: saveError.message });
    }
    const signedDocumentPath = __dirname + '/../../uploads/signed_' + Date.now() + '_' + documentFile.name;
    await fs.writeFile(signedDocumentPath, signedDocumentBytes);

    res.send({
      message: 'Document signed successfully!',
      path: signedDocumentPath.split('/').pop()
    });

    // Clean up uploaded files
    await fs.unlink(documentPath);
    await fs.unlink(signaturePath);
  } catch (error) {
    console.error('Error binding signature:', error);
    res.status(500).json({ message: 'Error binding signature to document', error: error.message });
  }
};

const verifySignature = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No document was uploaded for verification.' });
    }

    const verifiedDocumentFile = req.files.verifiedDocument;

    // Check if the uploaded file is a PDF
    if (verifiedDocumentFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Invalid document type. Only PDF files are allowed for verification.' });
    }

    const documentPath = __dirname + '/../../uploads/verify_' + Date.now() + '_' + verifiedDocumentFile.name;

    await verifiedDocumentFile.mv(documentPath);

    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(await fs.readFile(documentPath));
    } catch (pdfError) {
      console.error('Error loading PDF document for verification:', pdfError);
      return res.status(500).json({ message: 'Error loading PDF document for verification', error: pdfError.message });
    }
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    let signatureFound = false;
    const contentStream = firstPage.getContentStream();
    const contentText = contentStream.decodeText ? contentStream.decodeText() : '';
    if (contentText.includes('Signed with Digital Signature System (DSS)')) {
      signatureFound = true;
      console.log('Unique signature identifier found in document.');
    } else {
      console.log('Unique signature identifier not found in document.');
    }

    console.log(`Verification result: signatureFound = ${signatureFound}`);

    // Clean up uploaded file
    try {
      await fs.unlink(documentPath);
    } catch (unlinkError) {
      console.error('Error deleting uploaded file:', unlinkError);
    }

    if (signatureFound) {
      res.json({ message: 'Signature Verified! Document is valid.' });
    } else {
      console.log('Signature image not found in document.');
      res.status(400).json({ message: 'Signature Not Verified. No signature found in the document.' });
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ message: 'Error verifying document signature', error: error.message });
  }
};

module.exports = {
  uploadDocument,
  bindSignatureToDocument,
  verifySignature
};
