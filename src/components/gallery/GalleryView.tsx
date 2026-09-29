"use client";

import { Column, Heading, Icon, Media, MasonryGrid, Text } from "@once-ui-system/core";
import { gallery } from "@/resources";

export default function GalleryView() {
  if (gallery.images.length === 0) {
    return (
      <Column
        fillWidth
        style={{ minHeight: "20rem" }}
        horizontal="center"
        vertical="center"
        gap="12"
        padding="xl"
        border="neutral-alpha-medium"
        background="surface"
        radius="l"
      >
        <Icon name="gallery" size="l" onBackground="brand-strong" />
        <Heading as="h2" variant="heading-strong-l">
          Gallery coming soon
        </Heading>
        <Text align="center" onBackground="neutral-weak">
          Photos and moments will be added here.
        </Text>
      </Column>
    );
  }

  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {gallery.images.map((image, index) => (
        <Media
          enlarge
          priority={index < 10}
          sizes="(max-width: 560px) 100vw, 50vw"
          key={index}
          radius="m"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </MasonryGrid>
  );
}
