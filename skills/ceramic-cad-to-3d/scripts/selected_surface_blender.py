"""Blender worker: one CAD-derived mesh, smooth normals and selected glaze PBR."""
import json
import sys
from pathlib import Path
import bpy

folder = Path(sys.argv[sys.argv.index('--')+1])
spec = json.loads((folder/'surface-input.json').read_text())
if bpy.app.version != (4, 5, 11):
    raise RuntimeError('Selected surface requires Blender 4.5.11')
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.wm.stl_import(filepath=str(folder/'surface.stl'))
vessel = bpy.context.object
vessel.name = 'MoonJarConcept'
vessel.data.name = spec['surfaceSettings']['meshName']
vessel.scale = (.001, .001, .001)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
for polygon in vessel.data.polygons:
    polygon.use_smooth = True

def linear(value):
    value = int(value,16)/255
    return value/12.92 if value <= .04045 else ((value+.055)/1.055)**2.4

color = spec['finishColor'].lstrip('#')
material = bpy.data.materials.new('Matte clear glaze / photo-guided preview')
material.use_nodes = True
shader = material.node_tree.nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value = tuple(linear(color[i:i+2]) for i in (0,2,4))+(1,)
shader.inputs['Roughness'].default_value = spec['surfaceSettings']['roughness']
shader.inputs['Coat Weight'].default_value = spec['surfaceSettings']['clearcoat']
vessel.data.materials.clear()
vessel.data.materials.append(material)
assert abs(vessel.dimensions.x-spec['dimensionsMm']['maxDiameter']/1000)<.001
assert abs(vessel.dimensions.z-spec['dimensionsMm']['height']/1000)<.001
bpy.ops.object.select_all(action='DESELECT')
vessel.select_set(True)
bpy.context.view_layer.objects.active = vessel
bpy.ops.export_scene.gltf(filepath=str(folder/'model.glb'), export_format='GLB',
                         use_selection=True, export_animations=False)
(folder/'blender-report.json').write_text(json.dumps({
    'blender': bpy.app.version_string, 'vertices': len(vessel.data.vertices),
    'polygons': len(vessel.data.polygons), 'smooth': all(p.use_smooth for p in vessel.data.polygons),
    'dimensionsM': list(vessel.dimensions), 'roughness': .66, 'clearcoat': .08,
    'finishColor': spec['finishColor'], 'surfaceSettings': spec['surfaceSettings']}, indent=2)+'\n')
