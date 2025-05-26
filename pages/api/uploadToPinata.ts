import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import { PinataSDK } from 'pinata';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || '',
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Test Pinata connection first
    try {
      await pinata.testAuthentication();
    } catch (authError) {
      console.error('Pinata authentication failed:', authError);
      return res.status(500).json({ error: 'Pinata authentication failed' });
    }

    // Upload to IPFS using the new SDK
    const uploadData = new File([fs.readFileSync(file.filepath)], file.originalFilename || 'upload', {
      type: file.mimetype || 'application/octet-stream',
    });

    const result = await pinata.upload.public.file(uploadData);
    
    // Clean up temporary file
    fs.unlinkSync(file.filepath);
    
    const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud';
    const ipfsUrl = `https://${gatewayUrl}/ipfs/${result.cid}`;
    
    return res.status(200).json({ 
      ipfsUrl,
      ipfsHash: result.cid 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Failed to upload to Pinata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
