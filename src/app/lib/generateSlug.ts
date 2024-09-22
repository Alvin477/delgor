export const generateSlug = (title: string, id: number) => {
    const slugifiedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with '-'
      .replace(/^-+|-+$/g, '');     // Remove any leading or trailing hyphens
  
    return `${slugifiedTitle}-${id}`;
  };
  