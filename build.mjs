import * as esbuild from "esbuild";
import fs from "fs/promises";

const OUTDIR = "./dist";


try {

    await fs.rm(OUTDIR,{
        recursive: true,
    });
} catch (err) {};

let buildOptions = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outdir: OUTDIR,
    platform:"node",
    external: ["./static","./views"],
}


if ( process.env.NODE_ENV == "production" ) {
    buildOptions.minify = true;
} 


await esbuild.build(buildOptions)

try { 
    await fs.cp(".env", OUTDIR + "/.env");
} catch (err) {}


await fs.cp("./static", OUTDIR + "/static",{
    recursive: true,
});

await fs.cp("./src/views", OUTDIR + "/views",{
    recursive: true,
});