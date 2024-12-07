import fs from 'fs';
import path from 'path';

export async function getLogos() {
  const logoDir = path.join(process.cwd(), 'public', 'logos');
  const files = fs.readdirSync(logoDir);
  return files
    .filter(file => file.match(/\.(png|jpg|jpeg|gif)$/i))
    .map(file => `/logos/${file}`);
} 