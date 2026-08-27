import { getClusterSummaries } from "@/lib/articles";
import ReadTheLibraryInner from "./read-the-library-inner";

export default function ReadTheLibrary() {
  const clusters = getClusterSummaries();
  return <ReadTheLibraryInner clusters={clusters} />;
}
