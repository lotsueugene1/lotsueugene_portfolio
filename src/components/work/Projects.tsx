import Link from "next/link";
import { getPosts } from "@/utils/utils";
import styles from "./Projects.module.scss";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export function Projects({ range, exclude }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  const sortedProjects = allProjects.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <div className={styles.projects}>
      {displayedProjects.map((project) => (
        <article className={styles.entry} key={project.slug}>
          <Link className={styles.title} href={`/work/${project.slug}`}>
            {project.metadata.title}
          </Link>
          <p className={styles.summary}>{project.metadata.summary}</p>
          {project.metadata.tags.length > 0 && (
            <p className={styles.tags}>{project.metadata.tags.join(", ")}</p>
          )}
        </article>
      ))}
    </div>
  );
}
