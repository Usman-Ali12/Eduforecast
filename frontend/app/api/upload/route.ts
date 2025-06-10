import fs from 'fs';
import path from 'path';
import os from 'os';
import { NextResponse } from 'next/server';
import FormData from 'form-data';
import fetch from 'node-fetch'; // Only needed in Edge runtimes

export async function POST(req: Request) {
  try {
    // Parse incoming form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create temp file
    const filename = `upload-${Date.now()}.csv`;
    const tempFilePath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(tempFilePath, buffer);

    // Send to Flask backend
    const flaskForm = new FormData();
    flaskForm.append('file', fs.createReadStream(tempFilePath));

    const flaskRes = await fetch('http://localhost:5000/predict-csv', {
      method: 'POST',
      body: flaskForm as any,
      headers: flaskForm.getHeaders(),
    });

    
    const flaskData = await flaskRes.json();

    // Delete temp file after upload
    fs.unlinkSync(tempFilePath);

    return NextResponse.json(flaskData);
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
