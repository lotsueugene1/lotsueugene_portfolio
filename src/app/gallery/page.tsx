import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(gallery.title)}`,
    path: gallery.path,
  });
}

export default function Gallery() {
  return (
    <Column maxWidth="l" fillWidth gap="l" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`/api/og/generate?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column horizontal="center" gap="8" marginBottom="l">
        <Heading align="center" variant="display-strong-m">
          Gallery
        </Heading>
        <Text align="center" variant="body-default-l" onBackground="neutral-weak">
          A growing collection of work, research, and life beyond the screen.
        </Text>
      </Column>
      <GalleryView />
    </Column>
  );
}
