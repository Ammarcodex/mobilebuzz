// Curated color names for the admin's color-swatch picker: common
// smartphone marketing names (Apple/Samsung/Xiaomi/OnePlus/etc.) plus
// everyday color names. Hex values are representative, not official —
// admins can fine-tune with the color picker after selecting one.
export interface NamedColor {
  name: string;
  hex: string;
}

export const COLOR_NAMES: NamedColor[] = [
  // Blacks / grays
  { name: "Jet Black", hex: "#0a0a0a" },
  { name: "Midnight Black", hex: "#1c1c1e" },
  { name: "Phantom Black", hex: "#0b0b0d" },
  { name: "Matte Black", hex: "#1a1a1a" },
  { name: "Carbon Black", hex: "#1f1f1f" },
  { name: "Obsidian Black", hex: "#0c0c0e" },
  { name: "Onyx Black", hex: "#17171a" },
  { name: "Cosmic Black", hex: "#1b1b22" },
  { name: "Mystic Black", hex: "#232323" },
  { name: "Awesome Black", hex: "#1d1d1f" },
  { name: "Space Gray", hex: "#4b4b4d" },
  { name: "Space Black", hex: "#2b2b2d" },
  { name: "Graphite", hex: "#41424c" },
  { name: "Charcoal", hex: "#36454f" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Titanium Black", hex: "#3c3c3e" },
  { name: "Titanium Gray", hex: "#7d7d80" },
  { name: "Cosmic Gray", hex: "#55555a" },
  { name: "Mystic Gray", hex: "#5c5c60" },

  // Whites / silvers
  { name: "Pearl White", hex: "#f5f3ee" },
  { name: "Frost White", hex: "#eef3f5" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Snow White", hex: "#fbfbfb" },
  { name: "Phantom White", hex: "#eceae6" },
  { name: "Starlight", hex: "#f0e6d8" },
  { name: "Titanium White", hex: "#f0eee4" },
  { name: "Titanium Natural", hex: "#d6cfc7" },
  { name: "Silver", hex: "#e3e4e5" },
  { name: "Diamond Silver", hex: "#dcdee0" },

  // Blues
  { name: "Midnight Blue", hex: "#1d1d2b" },
  { name: "Navy Blue", hex: "#1a2744" },
  { name: "Royal Blue", hex: "#4169e1" },
  { name: "Sierra Blue", hex: "#a3bdd1" },
  { name: "Pacific Blue", hex: "#1e3a4c" },
  { name: "Sky Blue", hex: "#87ceeb" },
  { name: "Ocean Blue", hex: "#1ca9c9" },
  { name: "Ice Blue", hex: "#c8e8f0" },
  { name: "Glacier Blue", hex: "#a9c6d8" },
  { name: "Alpine Blue", hex: "#3c6e9c" },
  { name: "Titanium Blue", hex: "#4a5a6a" },
  { name: "Awesome Blue", hex: "#2c5fa8" },
  { name: "Peacock Blue", hex: "#1b6b7a" },
  { name: "Steel Blue", hex: "#4682b4" },
  { name: "Cobalt Blue", hex: "#1e4fa0" },

  // Greens
  { name: "Alpine Green", hex: "#506a56" },
  { name: "Forest Green", hex: "#228b22" },
  { name: "Emerald Green", hex: "#50c878" },
  { name: "Emerald Forest", hex: "#1f4d3c" },
  { name: "Olive Green", hex: "#556b2f" },
  { name: "Lime Green", hex: "#32cd32" },
  { name: "Mint Green", hex: "#a8e6cf" },
  { name: "Aurora Green", hex: "#5fc9a0" },
  { name: "Awesome Lime", hex: "#c6e26a" },

  // Purples / pinks
  { name: "Deep Purple", hex: "#4b3b63" },
  { name: "Lavender", hex: "#b19cd9" },
  { name: "Lavender Purple", hex: "#8e7cc3" },
  { name: "Violet", hex: "#7f3fbf" },
  { name: "Aurora Purple", hex: "#8a5fc0" },
  { name: "Mystic Violet", hex: "#6a4b7a" },
  { name: "Phantom Violet", hex: "#6b5b7a" },
  { name: "Awesome Violet", hex: "#7a5ca8" },
  { name: "Magenta", hex: "#c2185b" },
  { name: "Hot Pink", hex: "#ff69b4" },
  { name: "Baby Pink", hex: "#f4c2c2" },
  { name: "Rose Pink", hex: "#e8a0a8" },
  { name: "Rose Gold", hex: "#eacbc2" },
  { name: "Phantom Pink", hex: "#e8b4bc" },
  { name: "Awesome Pink", hex: "#f0a8c0" },
  { name: "Peach", hex: "#ffcba4" },

  // Reds / oranges
  { name: "Product Red", hex: "#c60000" },
  { name: "Coral", hex: "#ff6f61" },
  { name: "Sunrise Orange", hex: "#fd7e14" },
  { name: "Sunset Orange", hex: "#fa7a35" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Maroon", hex: "#800000" },

  // Yellows / golds / browns
  { name: "Gold", hex: "#f1dcb0" },
  { name: "Champagne Gold", hex: "#e8d2a6" },
  { name: "Sunset Gold", hex: "#e0b878" },
  { name: "Amber", hex: "#ffbf00" },
  { name: "Mustard Yellow", hex: "#ffdb58" },
  { name: "Copper", hex: "#b87333" },
  { name: "Bronze", hex: "#cd7f32" },
  { name: "Cream", hex: "#f5f0dc" },
  { name: "Beige", hex: "#f0e6d2" },
  { name: "Mystic Bronze", hex: "#8a6a4a" },

  // Basics (standard web colors, for anything not covered above)
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Gray", hex: "#808080" },
  { name: "Red", hex: "#e53935" },
  { name: "Orange", hex: "#fb8c00" },
  { name: "Yellow", hex: "#fdd835" },
  { name: "Green", hex: "#43a047" },
  { name: "Blue", hex: "#1e88e5" },
  { name: "Purple", hex: "#8e24aa" },
  { name: "Pink", hex: "#ec407a" },
  { name: "Brown", hex: "#6d4c41" },
  { name: "Turquoise", hex: "#1abc9c" },
  { name: "Cyan", hex: "#00bcd4" },
  { name: "Indigo", hex: "#3f51b5" },
];

export function searchColorNames(query: string, limit = 8): NamedColor[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return COLOR_NAMES.filter((c) => c.name.toLowerCase().includes(q)).slice(
    0,
    limit
  );
}
