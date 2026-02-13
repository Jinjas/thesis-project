#!/usr/bin/env python3
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from odlc import generate_svg

def main():
    onto_text = sys.stdin.read()
    if not onto_text:
        return

    try:
        svg = generate_svg(onto_text, os.path.dirname(__file__))
        if isinstance(svg, bytes):
            sys.stdout.buffer.write(svg)
        else:
            sys.stdout.write(svg)
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)

if __name__ == '__main__':
    main()
