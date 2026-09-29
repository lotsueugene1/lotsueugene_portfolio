import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";

import { MusicPageClient } from "@/components/music/MusicPageClient";
import { baseURL, music, person } from "@/resources";
import { getPlaylistAvailability } from "@/lib/spotify-playlist";
import styles from "./page.module.scss";

export async function generateMetadata() {
  return Meta.generate({
    title: music.title,
    description: music.description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(music.title)}`,
    path: music.path,
  });
}

export default async function MusicPage() {
  const playlistAvailable = await getPlaylistAvailability(music.playlistUrl);
  return (
    <Column className={styles.page} fillWidth>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={music.title}
        description={music.description}
        path={music.path}
        image={`/api/og/generate?title=${encodeURIComponent(music.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${music.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column className={styles.intro} gap="8">
        <Heading as="h1" variant="display-strong-xs">
          Music
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Music I&apos;m listening to.
        </Text>
      </Column>
      <MusicPageClient playlistUrl={music.playlistUrl} playlistAvailable={playlistAvailable} />
    </Column>
  );
}
