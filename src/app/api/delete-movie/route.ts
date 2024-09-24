import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, year } = body;

    // Define the path to the movie JSON file
    const filePath = path.join(process.cwd(), 'public', 'json', year, 'movie.json');

    // Read and parse the existing file
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const movies = JSON.parse(fileContents);

    // Filter out the movie by its ID
    const updatedMovies = movies.filter((movie: any) => movie.id !== id);

    // Write the updated movies array back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(updatedMovies, null, 2));

    return NextResponse.json({ message: 'Movie deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ message: 'Error deleting movie' }, { status: 500 });
  }
}
