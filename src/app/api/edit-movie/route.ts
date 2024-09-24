import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updatedMovie, year } = body;

    // Define the path to the movie JSON file
    const filePath = path.join(process.cwd(), 'public', 'json', year, 'movie.json');

    // Read and parse the existing file
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const movies = JSON.parse(fileContents);

    // Find the movie by its ID
    const movieIndex = movies.findIndex((movie: any) => movie.id === id);
    if (movieIndex === -1) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    // Update the movie with the new data
    movies[movieIndex] = updatedMovie;

    // Write the updated movies array back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));

    return NextResponse.json({ message: 'Movie updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json({ message: 'Error updating movie' }, { status: 500 });
  }
}
