import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Content access.
 *
 * Every page reads content through these helpers rather than calling
 * getCollection directly, so draft filtering and sort order are defined once.
 * When the loader is swapped for a CMS, this is the only file that needs to
 * know.
 */

export type Project = CollectionEntry<'projects'>;
export type Article = CollectionEntry<'journal'>;

const isPublished = (entry: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

/** Manual `order` first, then most recent year. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', isPublished);
  return projects.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.year - a.data.year;
  });
}

export async function getFeaturedProjects(limit?: number): Promise<Project[]> {
  const featured = (await getProjects()).filter((project) => project.data.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/** Newest first. */
export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('journal', isPublished);
  return articles.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export async function getFeaturedArticles(limit?: number): Promise<Article[]> {
  const articles = await getArticles();
  const featured = articles.filter((article) => article.data.featured);
  const list = featured.length > 0 ? featured : articles;
  return limit ? list.slice(0, limit) : list;
}

/** Distinct categories in the order they appear, for the projects filter. */
export function projectCategories(projects: Project[]): string[] {
  return [...new Set(projects.map((project) => project.data.category))];
}

/** Adjacent projects, wrapping at both ends, for the detail page footer. */
export function siblings(projects: Project[], id: string) {
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
