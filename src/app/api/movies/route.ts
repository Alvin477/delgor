// src/app/api/movies/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "en";
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const page = searchParams.get("page") || "1";

  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}&language=${locale}&sort_by=release_date.desc&vote_count.gte=1`;

  if (genre) {
    url += `&with_genres=${genre}`;
  }
  if (year) {
    url += `&primary_release_year=${year}`;
  }

  const resPage1 = await fetch(url);
  const dataPage1 = await resPage1.json();

  // Fetch next page if more movies are needed
  const resPage2 = await fetch(`${url}&page=${parseInt(page) + 1}`);
  const dataPage2 = await resPage2.json();

  // Merge results from two pages to get enough items
  const mergedResults = [...dataPage1.results, ...dataPage2.results].slice(0, 24);

  return NextResponse.json({
    results: mergedResults,
    total_pages: Math.min(dataPage1.total_pages, dataPage2.total_pages),
  });
}
