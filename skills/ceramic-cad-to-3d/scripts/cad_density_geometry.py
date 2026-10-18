"""CAD-profile station values for the isolated drawing-density comparison."""
from __future__ import annotations


def radius_at(profile: list[list[float]], z: float) -> float:
    if not profile or z < profile[0][1] or z > profile[-1][1]:
        raise ValueError("station outside CAD profile")
    for (r0, z0), (r1, z1) in zip(profile, profile[1:]):
        if z0 <= z <= z1:
            return r0 if z1 == z0 else r0 + (r1 - r0) * (z - z0) / (z1 - z0)
    return profile[-1][0]


def diameter_stations(profile: list[list[float]], height: float) -> list[tuple[float, float]]:
    if abs(profile[-1][1] - height) > 0.001:
        raise ValueError("profile and dimension height disagree")
    return [(z, 2 * radius_at(profile, z)) for z in (0.0, height / 2, height)]
