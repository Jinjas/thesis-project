// app/data.ts
import { Ingredient, Cocktail } from "../types";

const FRONTEND_BASIC_ONTO = `
Ontologia FrontendBasic

concepts {
    Language,
    Library,
    Framework,
    Tool
}

individuals {
    FrontendBasic,
    FrontendBasicDevelopment,
    FrontendBasicCocktail,
    JavaScript,
    TypeScript,
    %ReactJS,
    NextJS,
    TailwindCSS,
    SQL,
    ESLint
}

relations {
    uses,
    requires
}

triples {
    JavaScript = iof => Language;
    TypeScript = iof => Language;
    %ReactJS = iof => Library;
    NextJS = iof => Framework;
    TailwindCSS = iof => Tool;
    SQL = iof => Language;
    ESLint = iof => Tool;
    
    FrontendBasic = requires => FrontendBasicDevelopment;
    FrontendBasicDevelopment = uses => FrontendBasicCocktail;

    SQL = supports => ArchitectsPortal;

    JavaScript = pof => FrontendBasicCocktail;
    TypeScript = pof => FrontendBasicCocktail;
    %ReactJS = pof => FrontendBasicCocktail;
    NextJS = pof => FrontendBasicCocktail;
    TailwindCSS = pof => FrontendBasicCocktail;
    ESLint = pof => FrontendBasicCocktail;
}
.`.trim();

const Backend_BASIC_ONTO = `
Ontologia AutomaiseIA

concepts {
	Resource,
	Language,
	Library,
	Framework,
  Tool
}

individuals {
	AutomaiseIA,
	AutomaiseIADevelopment,
	AutomaiseIACocktail,
	ApacheAirFlow,
	Celery,
	Flower,
	JupyterNotebook,
	Python,
	PyTorch,
	TensorFlow,
	Tornado,
  TBD,
  VisualStudioCode,
  GeneralProgramming
}

relations {
	uses,
	requires
}

triples {
	ApacheAirFlow = iof => Resource;
	Celery = iof => Resource;
	Flower = iof => Resource;
	JupyterNotebook = iof => Resource;
	Python = iof => Language;
	PyTorch = iof => Framework;
	TensorFlow = iof => Library;
	Tornado = iof => Framework;
  VisualStudioCode = iof => Tool;

	Python = is_used_for => TBD;
	PyTorch = is_used_for => TBD;
	TensorFlow = is_used_for => TBD;
	Tornado = is_used_for => TBD;
  VisualStudioCode= is_used_for => GeneralProgramming;

	ApacheAirFlow = supports => AutomaiseIA;
	Celery = supports => AutomaiseIA;
	Flower = supports => AutomaiseIA;
	JupyterNotebook = supports => AutomaiseIA;

	AutomaiseIA = requires => AutomaiseIADevelopment;
	AutomaiseIADevelopment = uses => AutomaiseIACocktail;

	Python = pof => AutomaiseIACocktail;
	PyTorch = pof => AutomaiseIACocktail;
	TensorFlow = pof => AutomaiseIACocktail;
	Tornado = pof => AutomaiseIACocktail;
  VisualStudioCode = pof => AutomaiseIACocktail;
}
.`.trim();

const hitachi = `
Ontologia HitachiDataWarehouse

concepts {
	Resource,
	Language,
	Library,
	Tool,
	GeneralProgramming,
	TBD
}

individuals {
	HitachiDataWarehouse,
	HitachiDataWarehouseDevelopment,
	HitachiDataWarehouseCocktail,
	ApacheParquet,
	ApacheSpark,
	ApacheSparkSQL,
	AzureDataLake,
	AzureDevOps,
	AzureSQLDB,
	AzureSQLPool,
	AzureSynapse,
	JSON,
	PySpark,
	Python,
	SQL,
	TSQL,
	VisualStudio
}

relations {
	uses,
	requires
}

triples {
	ApacheParquet = iof => Resource;
	ApacheSpark = iof => Resource;
	ApacheSparkSQL = iof => Resource;
	AzureDataLake = iof => Resource;
	AzureDevOps = iof => Resource;
	AzureSQLDB = iof => Resource;
	AzureSQLPool = iof => Resource;
	AzureSynapse = iof => Resource;
	JSON = iof => Language;
	PySpark = iof => Library;
	Python = iof => Language;
	SQL = iof => Language;
	TSQL = iof => Language;
	VisualStudio = iof => Tool;

	JSON = is_used_for => TBD;
	PySpark = is_used_for => TBD;
	Python = is_used_for => TBD;
	SQL = is_used_for => TBD;
	TSQL = is_used_for => TBD;
	VisualStudio = is_used_for => GeneralProgramming;

	ApacheParquet = supports => HitachiDataWarehouse;
	ApacheSpark = supports => HitachiDataWarehouse;
	ApacheSparkSQL = supports => HitachiDataWarehouse;
	AzureDataLake = supports => HitachiDataWarehouse;
	AzureDevOps = supports => HitachiDataWarehouse;
	AzureSQLDB = supports => HitachiDataWarehouse;
	AzureSQLPool = supports => HitachiDataWarehouse;
	AzureSynapse = supports => HitachiDataWarehouse;

	HitachiDataWarehouse = requires => HitachiDataWarehouseDevelopment;
	HitachiDataWarehouseDevelopment = uses => HitachiDataWarehouseCocktail;

	JSON = pof => HitachiDataWarehouseCocktail;
	PySpark = pof => HitachiDataWarehouseCocktail;
	Python = pof => HitachiDataWarehouseCocktail;
	SQL = pof => HitachiDataWarehouseCocktail;
	TSQL = pof => HitachiDataWarehouseCocktail;
	VisualStudio = pof => HitachiDataWarehouseCocktail;
}

.`.trim();

export const INGREDIENTS: Ingredient[] = [
  {
    id: "ts",
    name: "TypeScript",
    type: "Language",
    characteristics: "",
    extraData: "",
    code: "",
  },
  {
    id: "js",
    name: "JavaScript",
    type: "Language",
    characteristics: "",
    extraData: "",
    code: "",
  },
  {
    id: "react",
    name: "ReactJS",
    type: "Library",
    characteristics: "",
    extraData: "",
    code: "",
  },
  {
    id: "next",
    name: "NextJS",
    type: "Framework",
    characteristics: "",
    extraData: "",
    code: "",
  },
  {
    id: "tailwind",
    name: "TailwindCSS",
    type: "Tool",
    characteristics: "",
    extraData: "",
    code: "",
  },
  {
    id: "vite",
    name: "Vite",
    type: "Tool",
    characteristics: "",
    extraData: "",
    code: "",
  },
  {
    id: "sql",
    name: "SQL",
    type: "Language",
    characteristics: "",
    extraData: "",
    code: "",
  },
];

export const COCKTAILS: Cocktail[] = [
  {
    id: "frontend-basic",
    name: "Frontend Basic",
    viz: "",
    ingredients: {},
    onto: FRONTEND_BASIC_ONTO,
  },
  {
    id: "modern-stack",
    name: "Modern Stack",
    viz: "",
    ingredients: {},
    onto: Backend_BASIC_ONTO,
  },
  {
    id: "HitachiDataWarehouse",
    name: "Hitachi DataWarehouse",
    viz: "",
    ingredients: {},
    onto: hitachi,
  },
  {
    id: "vanilla-dev",
    name: "Vanilla Dev",
    viz: "",
    ingredients: {},
    onto: "",
  },
];
