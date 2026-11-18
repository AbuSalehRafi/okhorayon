import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

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

    // Save main file
    const sanitizedName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, sanitizedName);
    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));
    const fileUrl = `/uploads/${sanitizedName}`;

    // Handle Cover Image
    let coverUrl = '';
    if (coverFile && coverFile.size > 0) {
      const sanitizedCoverName = `cover-${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const coverPath = path.join(uploadsDir, sanitizedCoverName);
      const coverBytes = await coverFile.arrayBuffer();
      await fs.writeFile(coverPath, Buffer.from(coverBytes));
      coverUrl = `/uploads/${sanitizedCoverName}`;
    } else {
      // Auto-generate elegant SVG book/document cover based on title & type
      const svgCoverName = `cover-auto-${Date.now()}.svg`;
      const svgCoverPath = path.join(uploadsDir, svgCoverName);
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
  
  <!-- Subtle border framing -->
  <rect x="25" y="25" width="550" height="800" fill="none" stroke="#b5873a" stroke-opacity="0.3" stroke-width="2"/>
  <rect x="35" y="35" width="530" height="780" fill="none" stroke="#1d2a40" stroke-width="1"/>
  
  <!-- Flourish mark -->
  <circle cx="300" cy="180" r="30" fill="none" stroke="#b5873a" stroke-width="1.5"/>
  <path d="M 300 160 L 300 200 M 280 180 L 320 180" stroke="#b5873a" stroke-width="1.5"/>

  <!-- Category Badge -->
  <text x="300" y="260" font-family="'Noto Sans Bengali', sans-serif" font-size="16" fill="#b5873a" text-anchor="middle" letter-spacing="3" text-transform="uppercase">
    ${type.toUpperCase()}
  </text>
  
  <!-- Document Title -->
  <text x="300" y="380" font-family="'Noto Serif Bengali', 'Merriweather', serif" font-size="28" font-weight="bold" fill="#ecf1f8" text-anchor="middle">
    ${title.length > 28 ? title.slice(0, 26) + '...' : title}
  </text>
  
  <!-- Site signature -->
  <line x1="220" y1="680" x2="380" y2="680" stroke="#b5873a" stroke-opacity="0.4" stroke-width="1"/>
  <text x="300" y="730" font-family="'Noto Serif Bengali', serif" font-size="20" fill="#c7d3e2" text-anchor="middle">
    অক্ষরায়ণ
  </text>
  <text x="300" y="760" font-family="'Inter', sans-serif" font-size="12" fill="#7b8ea6" text-anchor="middle" letter-spacing="4">
    OKHORAYON
  </text>
</svg>`.trim();

      await fs.writeFile(svgCoverPath, svgContent, 'utf-8');
      coverUrl = `/uploads/${svgCoverName}`;
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      coverUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 });
  }
}
