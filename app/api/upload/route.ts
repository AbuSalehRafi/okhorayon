import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { uploadFileToCloud } from '@/lib/firebase/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const coverFile = formData.get('cover') as File | null;
    const title = (formData.get('title') as string) || 'Document';
    const type = (formData.get('type') as string) || 'article';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 50MB' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type (${file.type}). Please upload a PDF, JPG, or PNG.` },
        { status: 400 }
      );
    }

    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    // 1. Try uploading to Firebase Storage first (permanent cloud storage)
    let fileUrl: string | null = await uploadFileToCloud(
      fileBuffer,
      file.name,
      file.type || 'application/pdf'
    );

    // If Firebase Storage is not configured, fallback to writing to public/uploads
    if (!fileUrl) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await fs.mkdir(uploadsDir, { recursive: true });
        const sanitizedName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadsDir, sanitizedName);
        await fs.writeFile(filePath, fileBuffer);
        fileUrl = `/uploads/${sanitizedName}`;
      } catch (e) {
        console.warn('Local file write skipped or failed (likely read-only serverless environment):', e);
      }
    }

    // 2. Handle Cover Image
    let coverUrl = '';
    if (coverFile && coverFile.size > 0) {
      const coverBytes = await coverFile.arrayBuffer();
      const coverBuffer = Buffer.from(coverBytes);

      const cloudCover = await uploadFileToCloud(
        coverBuffer,
        coverFile.name,
        coverFile.type || 'image/jpeg'
      );

      if (cloudCover) {
        coverUrl = cloudCover;
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        try {
          await fs.mkdir(uploadsDir, { recursive: true });
          const sanitizedCoverName = `cover-${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const coverPath = path.join(uploadsDir, sanitizedCoverName);
          await fs.writeFile(coverPath, coverBuffer);
          coverUrl = `/uploads/${sanitizedCoverName}`;
        } catch (e) {
          console.warn('Cover local write skipped:', e);
        }
      }
    } else {
      // Auto-generate elegant SVG book/document cover based on title & type
      const svgContent = `
<svg width="600" height="850" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c131f"/>
      <stop offset="100%" stop-color="#141d2e"/>
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#b5873a" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#b5873a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <rect width="600" height="850" fill="url(#bgGrad)"/>
  <rect width="600" height="850" fill="url(#goldGlow)"/>
  
  <rect x="25" y="25" width="550" height="800" fill="none" stroke="#b5873a" stroke-opacity="0.3" stroke-width="2"/>
  <rect x="35" y="35" width="530" height="780" fill="none" stroke="#1d2a40" stroke-width="1"/>
  
  <circle cx="300" cy="180" r="30" fill="none" stroke="#b5873a" stroke-width="1.5"/>
  <path d="M 300 160 L 300 200 M 280 180 L 320 180" stroke="#b5873a" stroke-width="1.5"/>

  <text x="300" y="260" font-family="'Noto Sans Bengali', sans-serif" font-size="16" fill="#b5873a" text-anchor="middle" letter-spacing="3" text-transform="uppercase">
    ${type.toUpperCase()}
  </text>
  
  <text x="300" y="380" font-family="'Noto Serif Bengali', 'Merriweather', serif" font-size="28" font-weight="bold" fill="#ecf1f8" text-anchor="middle">
    ${title.length > 28 ? title.slice(0, 26) + '...' : title}
  </text>
  
  <line x1="220" y1="680" x2="380" y2="680" stroke="#b5873a" stroke-opacity="0.4" stroke-width="1"/>
  <text x="300" y="730" font-family="'Noto Serif Bengali', serif" font-size="20" fill="#c7d3e2" text-anchor="middle">
    অক্ষরায়ণ
  </text>
  <text x="300" y="760" font-family="'Inter', sans-serif" font-size="12" fill="#7b8ea6" text-anchor="middle" letter-spacing="4">
    OKHORAYON
  </text>
</svg>`.trim();

      const svgBuffer = Buffer.from(svgContent, 'utf-8');
      const cloudSvgCover = await uploadFileToCloud(svgBuffer, `cover-auto-${Date.now()}.svg`, 'image/svg+xml');

      if (cloudSvgCover) {
        coverUrl = cloudSvgCover;
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        try {
          await fs.mkdir(uploadsDir, { recursive: true });
          const svgCoverName = `cover-auto-${Date.now()}.svg`;
          const svgCoverPath = path.join(uploadsDir, svgCoverName);
          await fs.writeFile(svgCoverPath, svgContent, 'utf-8');
          coverUrl = `/uploads/${svgCoverName}`;
        } catch (e) {
          // If read-only and no storage, data URI fallback
          coverUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      fileUrl: fileUrl || '',
      coverUrl: coverUrl || '',
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 });
  }
}
