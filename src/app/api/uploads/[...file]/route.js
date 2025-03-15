// app/api/uploads/[...file]/route.js

import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(request, { params }) {
  const { file } = params; // file will be an array of path segments
  // Compute the absolute path of the file in the uploads folder
  const filePath = path.join(process.cwd(), 'uploads', ...file);

  if (!fs.existsSync(filePath)) {
    return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
  }
  
  // Determine MIME type
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  // Read file data
  const fileBuffer = fs.readFileSync(filePath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
    },
  });
}
