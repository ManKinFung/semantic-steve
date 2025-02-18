# src/semantic_steve/world_state.py

from typing import Any, Dict, Literal, Optional, TypedDict
from dataclasses import dataclass

####################################
#### World State Representation ####
####################################

@dataclass
class BoundingBox:
    x_min: int
    y_min: int
    z_min: int
    x_max: int
    y_max: int
    z_max: int


@dataclass
class ImmediateSurroundings:
    """
    Detailed account of the VISIBLE immediate surroundings (i.e., within an n-block radius).
    """
    # Coords of all visible blocks, e.g., {"diorite": [(-3, 65, -3), (-3, 65, -2), ...]}
    blocks: Optional[dict[str, list[tuple[int, int, int]]]]
    # Bounding boxes of all visible structures, e.g., {"snowy_weapon_smith_1": [BoundingBox(...)]}
    structures: Optional[dict[str, list[BoundingBox]]]
    # Coords of all visible POIs, e.g., {"grindstone": [(-3, 66, 0)]}
    pois: Optional[dict[str, list[tuple[int, int, int]]]]
    # Other visible things (e.g., mobs, item entities, etc.)
    other: Optional[dict[str, list[tuple[int, int, int] | BoundingBox]]]


@dataclass
class VisibleNearbyThingsInADirection:
    # Quantities of blocks visible in this direction, e.g., {"iron_bars": 1, "lava": 2, ...}
    blocks: Optional[dict[str, int]]
    # Quantities of structures visible in this direction, e.g., {"snowy_farm_1": 1}
    structures: Optional[dict[str, int]]
    # Coords of visible POIs in this direction, e.g., {"composter": (14, 64, 20)}
    pois: Optional[dict[str, tuple[int, int, int]]]
    # What distinct biomes are visible in this direction. E.g., ["taiga", "snowy_tundra"]
    biomes: Optional[list[str]]  # Could be a set if order is not important
    # Quantities of other visible things (e.g., mobs, item entities, etc.)
    other: Optional[dict[str, int]]


class NearbySurroundings(TypedDict):
    """
    Less detailed account of the VISIBLE nearby surroundings beyond the immediate surroundings.
    """
    up: VisibleNearbyThingsInADirection
    north: VisibleNearbyThingsInADirection
    northeast: VisibleNearbyThingsInADirection
    east: VisibleNearbyThingsInADirection
    southeast: VisibleNearbyThingsInADirection
    south: VisibleNearbyThingsInADirection
    southwest: VisibleNearbyThingsInADirection
    west: VisibleNearbyThingsInADirection
    northwest: VisibleNearbyThingsInADirection


@dataclass
class WorldState:
    coordinates: tuple[int, int, int]
    health: int
    hunger: int
    time_of_day: str
    currently_in: str  # E.g., "overworld:snowy_tundra:snowy_weapon_smith_1"
    inventory: dict[str, int]
    equipped: list[str]
    notepad: list[str]  # E.g., ["Current spawn point: (45, 64, 23)", ...]
    immediate_surroundings: ImmediateSurroundings
    nearby_surroundings: NearbySurroundings

    def __str__(self) -> str:
        """
        Returns a pretty string representation of the current world state.
        This is what gets shown to the LLM or user in the "textworld" CLI.
        """
        return (
            f"Coordinates: {self.coordinates}\n"
            f"Health: {self.health}, Hunger: {self.hunger}\n"
            f"Time of Day: {self.time_of_day}\n"
            f"Location: {self.currently_in}\n"
            f"Inventory: {self.inventory}\n"
            f"Equipped: {self.equipped}\n"
            f"Notes: {self.notepad}"
        )


#####################
#### Misc. Types ####
#####################

Direction = Literal[
    "up",
    "down",
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
]

ContainerType = Literal[
    "chest",
    "barrel",
    "shulker_box",
    "ender_chest",
    "dispenser",
    "dropper",
    "hopper",
]

QuantitiesOfItems = Dict[str, int]
