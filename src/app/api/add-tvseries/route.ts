import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, id, seasons, year } = body;

    const filePath = path.join(process.cwd(), 'public', 'json', year, 'tv.json');
    
    // Read the current TV series JSON file
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const tvSeriesList = JSON.parse(fileContents);

    // Check if the series already exists
    const seriesExists = tvSeriesList.some((tv: any) => tv.id === id);
    if (seriesExists) {
      return NextResponse.json({ message: 'TV series with this ID already exists' }, { status: 400 });
    }

    // Create the new TV series object
    const newTvSeries = {
      id,
      title,
      type: 'tv',
      seasons,
    };

    // Add the new TV series to the list
    tvSeriesList.push(newTvSeries);

    // Write the updated list back to the file
    fs.writeFileSync(filePath, JSON.stringify(tvSeriesList, null, 2));

    return NextResponse.json({ message: 'TV series added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding TV series:', error);
    return NextResponse.json({ message: 'Error adding TV series' }, { status: 500 });
  }
}
