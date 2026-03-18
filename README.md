# Tese App

Web application for creating and editing OntoDL ontologies in the cocktails and ingredients domain, with SVG visualization generated from the ontology.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Python scripts for OntoDL processing
- Graphviz for SVG generation

## Prerequisites

- Node.js 20+
- npm
- Python 3.10+
- Graphviz (the `dot` binary available in PATH)

## Python dependencies (and installation)

The Python scripts used by the app import:

- `lark`
- `graphviz` (Python package)
- `matplotlib`

Recommended setup (from the `thesis-project` folder):

```bash
python -m venv .venv
```

### Windows (PowerShell)

```bash
.\.venv\Scripts\Activate.ps1
pip install lark graphviz matplotlib
```

### macOS/Linux

```bash
source .venv/bin/activate
pip install lark graphviz matplotlib
```

Install Graphviz at system level (required to generate SVG):

- Windows (winget): `winget install Graphviz.Graphviz`
- macOS (brew): `brew install graphviz`
- Ubuntu/Debian: `sudo apt-get install graphviz`

Quick checks:

```bash
python --version
dot -V
```

## Running the project

1. Install Node dependencies:

```bash
npm install
```

2. Ensure the Python environment is active and dependencies are installed (previous section).

3. Start in development mode:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Brief summary of implemented features

- Cocktail management:
  - List existing cocktails
  - Create a cocktail with an initial ingredient
  - Open cocktail detail view
- Cocktail detail view:
  - Add ingredient to a cocktail
  - Enable/disable ingredients in a cocktail (with ontology update)
  - Import and export OntoDL

- Ingredient management:
  - List ingredients
  - Create ingredient with type (`Language`, `Library`, `Framework`, `Tool`)
- Ingredient detail view:
  - Edit name, type, and OntoDL blocks
  - Remove ingredient
  - Import and export OntoDL Blocks

- Processing and visualization:
  - Initial ontology generation for cocktails
  - Ontology update when ingredient changes occur
  - Preparation/normalization of imported ontology
  - SVG visualization generation via Graphviz
  - Cognitive production tables for cocktails and ingredients

- Frontend-backend integration:
  - Next.js API routes connecting UI and Python scripts
  - State synchronization in `AppContext`
  - Per-cocktail update queue to avoid write conflicts

## Relevant structure

- `src/app`: pages, layouts, components, and API routes
- `src/python/cocktail`: cocktail and visualization scripts
- `src/python/ingredient`: ingredient ontology scripts

## Important notes

- The app runs Python with `spawn("python", ...)`. The `python` command must be available in the Node process terminal.
- Without Graphviz installed at system level, SVG generation fails.
- OntoDL data is stored in:
  - `src/python/cocktail/data`
  - `src/python/ingredient/data`
- The parser depends on the `ontodl.lark` file inside the Python folders.

## Production build

```bash
npm run build
npm start
```
