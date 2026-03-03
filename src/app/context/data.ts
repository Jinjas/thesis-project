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
    requires,
    is_composed_of,
    supports,
    is_used_for
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

    FrontendBasicCocktail = is_composed_of => JavaScript;
    FrontendBasicCocktail = is_composed_of => TypeScript;
    %FrontendBasicCocktail = is_composed_of => ReactJS;
    FrontendBasicCocktail = is_composed_of => NextJS;
    FrontendBasicCocktail = is_composed_of => TailwindCSS;
    FrontendBasicCocktail = is_composed_of => ESLint;
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
	requires,
	is_composed_of,
	supports,
	is_used_for
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

	AutomaiseIACocktail = is_composed_of => Python;
	AutomaiseIACocktail = is_composed_of => PyTorch;
	AutomaiseIACocktail = is_composed_of => TensorFlow;
	AutomaiseIACocktail = is_composed_of => Tornado;
  AutomaiseIACocktail = is_composed_of => VisualStudioCode;
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
	requires,
	is_composed_of,
	supports,
	is_used_for
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

	HitachiDataWarehouseCocktail = is_composed_of => JSON;
	HitachiDataWarehouseCocktail = is_composed_of => PySpark;
	HitachiDataWarehouseCocktail = is_composed_of => Python;
	HitachiDataWarehouseCocktail = is_composed_of => SQL;
	HitachiDataWarehouseCocktail = is_composed_of => TSQL;
	HitachiDataWarehouseCocktail = is_composed_of => VisualStudio;
}

.`.trim();

export const INGREDIENTS: Ingredient[] = [
  {
    id: "ts",
    name: "TypeScript",
    type: "Language",
    characteristics: "",
    code: "",
  },
  {
    id: "js",
    name: "JavaScript",
    type: "Language",
    characteristics: "",
    code: "",
  },
  {
    id: "react",
    name: "ReactJS",
    type: "Library",
    characteristics: "",
    code: "",
  },
  {
    id: "next",
    name: "NextJS",
    type: "Framework",
    characteristics: "",
    code: "",
  },
  {
    id: "tailwind",
    name: "TailwindCSS",
    type: "Tool",
    characteristics: "",
    code: "",
  },
  {
    id: "vite",
    name: "Vite",
    type: "Tool",
    characteristics: "",
    code: "",
  },
  {
    id: "sql",
    name: "SQL",
    type: "Language",
    characteristics: "",
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
