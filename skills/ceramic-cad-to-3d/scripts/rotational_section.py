"""Shared radius/height section for explicitly raised, hollow vessel feet."""
import math


def raised_foot_section(profile, dims):
    """Return a closed-section polygon; height is measured from the foot bottom.

    The underside is flat at footHeight. Both foot and body use the reviewed
    radial wall offset; this is a preview approximation, not a normal offset.
    """
    foot = dims['footHeight']
    if isinstance(foot, bool) or not isinstance(foot, (int, float)) or not math.isfinite(foot) or foot <= 0:
        raise ValueError('footHeight must be a finite positive height; omit it for the legacy base')
    wall, base, height = (dims[k] for k in ('wallThickness', 'baseThickness', 'height'))
    floor = foot + base
    if not 0 < foot < floor < height:
        raise ValueError('Raised foot and base thickness must fit below the rim')
    if len(profile) < 2 or any(b[1] <= a[1] for a, b in zip(profile, profile[1:])):
        raise ValueError('Raised foot requires a strictly ascending profile')
    if any(r <= wall for r, z in profile):
        raise ValueError('Raised foot radial wall exceeds profile radius')

    def radius(z):
        for (ra, za), (rb, zb) in zip(profile, profile[1:]):
            if za <= z <= zb:
                return ra + (rb-ra)*(z-za)/(zb-za)
        raise ValueError('Raised foot lies outside profile')

    underside = [(0, foot), (radius(foot)-wall, foot)]
    underside += [(r-wall, z) for r, z in reversed(profile) if z < foot]
    inside = [(r-wall, z) for r, z in reversed(profile) if z > floor]
    inside += [(radius(floor)-wall, floor), (0, floor)]
    return underside + [tuple(p) for p in profile] + inside
