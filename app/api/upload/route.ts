import { NextRequest, NextResponse } from 'next/server'
import { PinataSDK } from 'pinata'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || '',
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || '',
})

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!file.name || file.name.length === 0) {
      return NextResponse.json({ error: 'File must have a name' }, { status: 400 })
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Accepted: JPEG, PNG, GIF, WebP, SVG` },
        { status: 400 }
      )
    }

    // Verify Pinata authentication
    try {
      await pinata.testAuthentication()
    } catch (authError) {
      console.error('Pinata authentication failed:', authError)
      return NextResponse.json({ error: 'Pinata authentication failed' }, { status: 500 })
    }

    // Upload to IPFS
    const result = await pinata.upload.public.file(file)

    const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud'
    const ipfsUrl = `https://${gatewayUrl}/ipfs/${result.cid}`

    return NextResponse.json({ ipfsUrl, ipfsHash: result.cid })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload to Pinata', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
