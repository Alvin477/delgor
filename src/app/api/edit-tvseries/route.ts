import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { id, updatedTv, year } = await req.json();

    const filePath = path.join(process.cwd(), 'public', 'json', year, 'tv.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const tvSeries = JSON.parse(fileContents);

    // Find the TV series to be updated
    const tvIndex = tvSeries.findIndex((tv: any) => tv.id === id);
    if (tvIndex === -1) {
      return NextResponse.json({ message: 'TV series not found' }, { status: 404 });
    }

    // Update the TV series data
    tvSeries[tvIndex] = updatedTv;

    // Write the updated JSON back to the file
    fs.writeFileSync(filePath, JSON.stringify(tvSeries, null, 2));

    return NextResponse.json({ message: 'TV series updated successfully' });
  } catch (error) {
    console.error('Error updating TV series:', error);
    return NextResponse.json({ message: 'Error updating TV series' }, { status: 500 });
  }
}
