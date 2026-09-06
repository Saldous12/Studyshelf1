import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const root = join(process.cwd(), "dist");
await mkdir(root, { recursive: true });
await rm(join(root, "uv"), { recursive: true, force: true });
await rm(join(root, "epoxy"), { recursive: true, force: true });
await rm(join(root, "scram"), { recursive: true, force: true });
await rm(join(root, "libcurl"), { recursive: true, force: true });
await rm(join(root, "epoxy"), { recursive: true, force: true });
await rm(join(root, "baremux"), { recursive: true, force: true });
await cp(scramjetPath, join(root, "scram"), { recursive: true });
await cp(libcurlPath, join(root, "libcurl"), { recursive: true });
await cp(baremuxPath, join(root, "baremux"), { recursive: true });
