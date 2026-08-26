#!/usr/bin/env python3
"""Generate the Overstrand Lifeline app icon PNGs from the SVG sources.
Run:  python3 make_icons.py     (requires ImageMagick `magick` on PATH)

The SVG artwork (icon.svg / icon-maskable.svg) is the source of truth; this
script only rasterizes it.

Outputs: icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png
"""
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent


def render(svg: str, out: str, size: int) -> None:
    subprocess.run(
        ["magick", "-background", "none", str(HERE / svg), "-resize", f"{size}x{size}", str(HERE / out)],
        check=True,
    )
    print("wrote", out)


def main() -> int:
    render("icon.svg", "icon-192.png", 192)
    render("icon.svg", "icon-512.png", 512)
    render("icon-maskable.svg", "icon-maskable-512.png", 512)
    render("icon-maskable.svg", "apple-touch-icon.png", 180)  # iOS masks corners itself
    return 0


if __name__ == "__main__":
    sys.exit(main())
