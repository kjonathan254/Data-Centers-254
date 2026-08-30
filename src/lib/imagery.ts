/**
 * Central imagery registry — maps every content cluster to a real,
 * consistent photograph. Used by the homepage, cluster hub pages,
 * article fallbacks and library cards so imagery stays coherent sitewide.
 */

export interface ClusterImage {
  src: string;
  alt: string;
}

export const CLUSTER_IMAGES: Record<string, ClusterImage> = {
  Beginner: {
    src: "/images/dc-gpu-cluster-2-wide.webp",
    alt: "Rows of illuminated server racks inside a data centre hall",
  },
  Kenya: {
    src: "/images/nairobi-skyline.webp",
    alt: "Nairobi city skyline at dusk — Kenya's digital capital",
  },
  Internet: {
    src: "/images/dc-fibre-optics.webp",
    alt: "Fibre optic strands carrying light — the physical path of Kenya's connectivity",
  },
  Energy: {
    src: "/images/kenya-geothermal-plant.webp",
    alt: "Geothermal power plant in the Rift Valley — baseload energy behind Kenya's green data centres",
  },
  AI: {
    src: "/images/ai-gpu-servers.png",
    alt: "High-density GPU compute racks with green status LEDs",
  },
  Policy: {
    src: "/images/dc-policy-regulation.png",
    alt: "Government building at dusk — regulators shape Kenya's digital infrastructure",
  },
  Infrastructure: {
    src: "/images/dc-cooling-crac.webp",
    alt: "Industrial cooling units and pipework inside a data centre plant room",
  },
  Careers: {
    src: "/images/dc-careers-tech.png",
    alt: "Data centre technician working at a server rack",
  },
};

const FALLBACK: ClusterImage = {
  src: "/images/hero-server-hall.webp",
  alt: "Data centre server hall corridor",
};

/** Get the image for a cluster (falls back to the server hall shot). */
export function getClusterImage(cluster: string): ClusterImage {
  return CLUSTER_IMAGES[cluster] ?? FALLBACK;
}
