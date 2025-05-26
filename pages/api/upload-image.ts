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

  const form = new formidable.IncomingForm();
  form.parse(req, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }
    let file = files.file as FormidableFile | FormidableFile[] | undefined;
    if (Array.isArray(file)) file = file[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
      // Upload to IPFS using the new SDK
      const uploadData = new File([fs.readFileSync(file.filepath)], file.originalFilename || 'upload', {
        type: file.mimetype || 'application/octet-stream',
      });

      const result = await pinata.upload.public.file(uploadData);
      
      // Clean up temporary file
      fs.unlinkSync(file.filepath);
      
      const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud';
      const ipfsUrl = `https://${gatewayUrl}/ipfs/${result.cid}`;
      
      return res.status(200).json({ ipfsUrl });
    } catch (e) {
      console.error('Upload error:', e);
      return res.status(500).json({ error: 'Failed to upload to Pinata' });
    }
  });
}
