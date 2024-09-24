// src/app/api/add-movie/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { title, id, type, downloads, year } = await req.json();

  const filePath = path.join(process.cwd(), 'public', 'json', year, `${type}.json`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const movies = JSON.parse(fileContents);

    const newMovie = {
      id,
      title,
      type,
      downloads,
    };

    movies.push(newMovie);
    fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));

    return NextResponse.json({ message: 'Movie added successfully' });
  } catch (error) {
    console.error('Error adding movie:', error);
    return NextResponse.json({ message: 'Error adding movie' }, { status: 500 });
  }
}
