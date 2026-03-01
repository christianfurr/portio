export type PhotographyImage = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * Add entries after running: bun run optimize-photos
 * Use paths under /images/photography/ (e.g. /images/photography/photo.webp).
 * Thumbnails are derived as src.replace('.webp', '-thumb.webp') when present.
 */
export const photographyImages: PhotographyImage[] = [
  { src: "/images/photography/6FF84AB8-F241-4D7C-AEC9-93D10E923D49_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/12CC9D49-D6D3-4DC0-9EFA-EF46DC0C4836_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/7CC992CF-43FA-4E27-893E-3FA093545714_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/4C980FFE-73BB-49AE-BC32-30BC3A0166EE_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/25F2B9AA-CB4F-4974-A174-3437062CA51C_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/26F9F350-9270-4371-8991-0F7F77BEBA67_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/32BE4993-77A1-4165-9A05-32B3EC5870B2_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/AF267093-6471-4064-A48D-90BCC99F5239_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/39610DE2-4C7B-4867-A83E-20A6B1B2431E_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/32F4081F-E1CE-4947-BB44-2087A7987F94_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/06727391-9F4C-4014-B4C0-BB8ABB2A59E1_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/2E302695-61D3-4D22-8BC9-C927F25FE6C5_1_105_c.webp", alt: "Photo" },
  { src: "/images/photography/AF6E9BE5-009D-4FF1-A2F8-1E28CD451CE9_1_105_c.webp", alt: "Photo" },
];
