import test from 'node:test';
import assert from 'node:assert/strict';
import { readProjects, projectCataloguePlugin } from '../scripts/project-catalogue.mjs';
import { existsSync } from 'node:fs';
test('single catalogue preserves public routes and ordered project identities', () => {
 const records=readProjects();
 assert.deepEqual(records.map(r=>r.metadata.slug),['chess','moon-jar','mug','plates','bowls','portrait-drawing','workshop-table','clay-vessels','flower-vase-drawing','book-cover','coffee-cup','ceramics-display']);
 assert.deepEqual(records.map(r=>r.metadata.number),Array.from({length:12},(_,i)=>String(i).padStart(2,'0')));
 for (const r of records) { assert.ok(r.metadata.title); for(const p of r.metadata.assets.photo)assert.ok(existsSync(r.asset(p.src))); }
});
test('virtual catalogue imports assets and uses the same public URLs in development',async()=>{
 const plugin=projectCataloguePlugin();plugin.configResolved({root:process.cwd()});
 const module=await plugin.load.call({addWatchFile(){}},'\0virtual:projects');
 assert.match(module,/href:"\/projects\/chess\/"/);assert.ok(!module.includes('public/projects'));
});
