import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setJpegQuality(88);
// WebGL in headless Chrome needs a software rasterizer on this machine
Config.setChromiumOpenGlRenderer("swangle");
Config.setConcurrency(2);
