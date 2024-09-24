import fs from 'fs';
import path from 'path';

// Helper function to get the file path
const getFilePath = (type, year) => {
  return path.join(process.cwd(), 'public', 'json', year, `${type}.json`);
};

// Fetch movie or TV data from the JSON file
export async function GET(request, { params }) {
  const { type, year } = params;
  const filePath = getFilePath(type, year);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(`Error reading ${type}.json for year ${year}:`, error);
    return new Response('Error reading data', { status: 500 });
  }
}

// Add a new movie or TV series to the JSON file
export async function POST(request, { params }) {
  const { type, year } = params;
  const filePath = getFilePath(type, year);
  const newItem = await request.json();

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    
    data.push(newItem); // Add the new movie or TV show
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return new Response('Item added successfully', { status: 201 });
  } catch (error) {
    console.error(`Error adding item to ${type}.json for year ${year}:`, error);
    return new Response('Error adding item', { status: 500 });
  }
}

// Edit an existing movie or TV series
export async function PUT(request, { params }) {
  const { type, year, id } = params;
  const filePath = getFilePath(type, year);
  const updatedItem = await request.json();

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    
    const itemIndex = data.findIndex((item) => item.id === parseInt(id));
    if (itemIndex === -1) {
      return new Response('Item not found', { status: 404 });
    }

    data[itemIndex] = updatedItem; // Update the item
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return new Response('Item updated successfully', { status: 200 });
  } catch (error) {
    console.error(`Error updating item in ${type}.json for year ${year}:`, error);
    return new Response('Error updating item', { status: 500 });
  }
}

// Delete a movie or TV series
export async function DELETE(request, { params }) {
  const { type, year, id } = params;
  const filePath = getFilePath(type, year);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    let data = JSON.parse(fileContents);
    
    data = data.filter((item) => item.id !== parseInt(id)); // Remove the item
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return new Response('Item deleted successfully', { status: 200 });
  } catch (error) {
    console.error(`Error deleting item from ${type}.json for year ${year}:`, error);
    return new Response('Error deleting item', { status: 500 });
  }
}
