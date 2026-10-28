import { readdirSync, readFileSync, existsSync, cpSync, mkdirSync, statSync, createReadStream, writeFileSync } from 'node:fs';
import { join, resolve, sep, extname } from 'node:path';
import { preparePhotos } from './project-photos.mjs';
import { extractGallery } from './main-gallery.mjs';
import { excludeCoverPhotos } from './main-gallery-dedup.mjs';

export function readProjects(root = process.cwd()) {
  const base = join(root, 'projects');
  const records = readdirSync(base, { withFileTypes: true }).filter(e => e.isDirectory()).map(entry => {
    const directory = join(base, entry.name);
    const metadata = JSON.parse(readFileSync(join(directory, 'project.json'), 'utf8'));
    const { number, slug } = metadata;
    if (!/^\d{2,}$/.test(number) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || entry.name !== `${number}-${slug}`)
      throw new Error(`Invalid project directory or identity: ${entry.name}`);
    const asset = relative => {
      const file = resolve(directory, relative);
      if (!file.startsWith(directory + sep) || !existsSync(file)) throw new Error(`Invalid project asset: ${relative}`);
      return file;
    };
    asset(metadata.cover);
    const page = join(directory, 'page');
    if (!existsSync(join(page, 'index.html'))) throw new Error(`Missing project page: ${slug}`);
    return { directory, page, metadata, asset };
  }).sort((a,b) => Number(a.metadata.number) - Number(b.metadata.number));
  for (const key of ['number', 'slug']) if (new Set(records.map(r => r.metadata[key])).size !== records.length)
    throw new Error(`Duplicate project ${key}`);
  return records;
}
const mime = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.glb':'model/gltf-binary', '.woff2':'font/woff2' };
export function projectCataloguePlugin() {
  let config;
  const ids = ['virtual:projects', 'virtual:main-gallery'];
  return {
    name: 'project-catalogue',
    configResolved(value) { config = value; },
    resolveId(id) { if (ids.includes(id)) return '\0' + id; },
    async load(id) {
      if (!ids.some(name => id === '\0' + name)) return;
      const records = readProjects(config.root);
      for (const r of records) { this.addWatchFile(join(r.directory,'project.json')); this.addWatchFile(join(r.page,'index.html')); }
      if (id === '\0virtual:main-gallery') {
        const entries=await Promise.all(records.map(async r => {
          const prepared=await preparePhotos(r), cover=r.asset(r.metadata.cover);
          this.addWatchFile(cover);
          const photos=await excludeCoverPhotos(extractGallery(prepared.html,r.metadata.slug),readFileSync(cover),photo=>{
            const prefix=`/projects/${r.metadata.slug}/`;
            if(!photo.src.startsWith(prefix))throw new Error(`Non-project photo: ${photo.src}`);
            const relative=decodeURIComponent(photo.src.slice(prefix.length));
            if(prepared.generated.has(relative))return prepared.generated.get(relative);
            const file=resolve(r.page,relative);
            if(!file.startsWith(r.page+sep))throw new Error(`Invalid photo: ${photo.src}`);
            this.addWatchFile(file);
            return readFileSync(file);
          },error=>this.warn(`Keep uncertain main-gallery photo (${r.metadata.slug}): ${error.message}`));
          return [r.metadata.slug,photos];
        }));
        return `export default ${JSON.stringify(Object.fromEntries(entries))}`;
      }
      const imports = [], values = records.map((r,i) => {
        const value = structuredClone(r.metadata);
        const image = (relative, suffix) => { const name=`image${i}_${suffix}`; imports.push(`import ${name} from ${JSON.stringify(r.asset(relative))};`); return name; };
        const cover = image(value.cover,'cover');
        const photos = value.assets.photo.map((p,j) => `{...${JSON.stringify(p)},src:${image(p.src,j)}}`);
        return `{...${JSON.stringify(value)},href:${JSON.stringify(`/projects/${value.slug}/`)},cover:${cover},assets:{...${JSON.stringify(value.assets)},photo:[${photos.join(',')}]}}`;
      });
      return imports.join('\n') + `\nexport const projects=[${values.join(',')}];`;
    },
    configureServer(server) {
      server.watcher.add(join(config.root,'projects'));
      server.watcher.on('all', (event,file) => {
        if (!['add','change','unlink'].includes(event)) return;
        if (!file.startsWith(join(config.root,'projects') + sep)) return;
        for (const id of ids) { const mod=server.moduleGraph.getModuleById('\0'+id); if(mod) server.moduleGraph.invalidateModule(mod); }
        server.ws.send({ type:'full-reload' });
      });
      server.middlewares.use(async (req,res,next) => {
        try {
        let pathname;
        try { pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.statusCode=400; res.end(); return; }
        const match=pathname.match(/^\/projects\/([^/]+)(\/.*)?$/);
        if (!match) return next();
        const record=readProjects(config.root).find(r=>r.metadata.slug===match[1]);
        if (!record) return next();
        if (!match[2]) {res.writeHead(302,{Location:pathname+'/'});res.end();return;}
        const prepared=await preparePhotos(record);
        const relative=match[2].slice(1);
        if(relative===''||relative==='index.html'){res.setHeader('Content-Type','text/html');res.end(prepared.html);return;}
        if(prepared.generated.has(relative)){res.setHeader('Content-Type','image/webp');res.end(prepared.generated.get(relative));return;}
        const file=resolve(record.page,'.'+match[2]+(match[2].endsWith('/')?'index.html':''));
        if (!file.startsWith(record.page+sep) || !existsSync(file) || !statSync(file).isFile()) {res.statusCode=404;res.end();return;}
        res.setHeader('Content-Type',mime[extname(file)] || 'application/octet-stream');
        createReadStream(file).on('error',()=>res.destroy()).pipe(res);
        } catch(error) { next(error); }
      });
    },
    async closeBundle() {
      if (config.command !== 'build') return;
      const output=resolve(config.root,config.build.outDir,'projects');
      mkdirSync(output,{recursive:true});
      for (const r of readProjects(config.root)) {
        const prepared=await preparePhotos(r), destination=join(output,r.metadata.slug);
        cpSync(r.page,destination,{recursive:true,filter:file=>! /\.(heic|heif)$/i.test(file)});
        writeFileSync(join(destination,'index.html'),prepared.html);
        for(const [relative,bytes] of prepared.generated){const file=join(destination,relative);mkdirSync(resolve(file,'..'),{recursive:true});writeFileSync(file,bytes);}
      }
    },
  };
}
