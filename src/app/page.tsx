import { CompaniesList } from "@/components/companies-list";
import { PaginationControls } from "@/components/pagination-controls";
import { getPaginatedCompanies } from "@/utils/get-paginated-companies";
import { companiesSchema } from "@/types";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.COMPANIES_API_TOKEN}`,
  },
};

const companiesApiEndpoint =
  "https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies/";

const perPage = 10;

type HomeProps = {
  searchParams: { page?: string };
};

export default async function Home({ searchParams }: HomeProps) {
  const response = await fetch(companiesApiEndpoint, options);
  const companies = await response.json();
  const validatedCompanies = companiesSchema.safeParse(companies);
  const currentPage = parseInt((await searchParams).page || "1");

  if (!validatedCompanies.success) {
    // lança erro que vai cair no error.tsx
    throw new Error("Lançou erro de schema!");
  }

  const totalPages = Math.ceil(validatedCompanies.data.length / perPage);
  const paginatedCompanies = getPaginatedCompanies({
    currentPage,
    perPage,
    validatedCompanies: validatedCompanies.data,
  });

  return (
    <>
      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      <CompaniesList companies={paginatedCompanies} />
    </>
  );
}

/*
[
    {
        "cnpj": "11828067831111",
        "estado": "SP",
        "municipio": "Ribeirão Preto",
        "nome_fantasia": "Fino Pão do Paulo",
        "razao_social": "Premium Café do Rafael Ltda.",
        "id": "d98660b3-86b3-4362-8b08-26511b65263b"
    },
    {
        "cnpj": "47424893272768",
        "estado": "CE",
        "municipio": "Sobral",
        "nome_fantasia": "Caseiro Frutas da Júlia",
        "razao_social": "Delicioso Lanches da Clara Ltda.",
        "id": "274bc5db-8333-4c8c-8cba-ec85f838698c"
    },
    {
        "cnpj": "53517229131137",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Saboroso Sabores da Júlia",
        "razao_social": "Popular Pão do Paulo Ltda.",
        "id": "436d0789-177d-4c4d-a2ac-5a463c1fb88c"
    },
    {
        "cnpj": "54324714417591",
        "estado": "RS",
        "municipio": "Santa Maria",
        "nome_fantasia": "Premium Mel da Júlia",
        "razao_social": "Fino Flores do Carlos Ltda.",
        "id": "9861883c-71d5-4e2f-ba65-839e77a078cd"
    },
    {
        "cnpj": "29416697330919",
        "estado": "CE",
        "municipio": "Maracanaú",
        "nome_fantasia": "Natural Doces da Júlia",
        "razao_social": "Caseiro Doces do Paulo Ltda.",
        "id": "a5521451-a231-431c-b9c9-7803f7bcfc6a"
    },
    {
        "cnpj": "90717232656488",
        "estado": "SC",
        "municipio": "Florianópolis",
        "nome_fantasia": "Premium Queijos da Clara",
        "razao_social": "Delicioso Flores do Rafael Ltda.",
        "id": "320ee6fd-34d4-4d00-83d1-53353f07e18b"
    },
    {
        "cnpj": "41631089201974",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Delicioso Café do Carlos",
        "razao_social": "Natural Frutas da Clara Ltda.",
        "id": "78dec92d-e98c-40a7-9e91-62b3bf7bbedb"
    },
    {
        "cnpj": "60402148537067",
        "estado": "RS",
        "municipio": "Porto Alegre",
        "nome_fantasia": "Delicioso Pão do José",
        "razao_social": "Caseiro Queijos da Júlia Ltda.",
        "id": "e28f758e-c29d-4f10-ab7d-5b5529c97e86"
    },
    {
        "cnpj": "52048577410560",
        "estado": "SC",
        "municipio": "Joinville",
        "nome_fantasia": "Doce Sabores do Rafael",
        "razao_social": "Doce Sabores do Carlos Ltda.",
        "id": "7a396ca0-7b68-4348-8b5e-27886f340e08"
    },
    {
        "cnpj": "80124746515194",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Delicioso Flores da Júlia",
        "razao_social": "Fino Pão da Júlia Ltda.",
        "id": "002e28a7-2b84-44bc-9896-3a486d70ea1a"
    },
    {
        "cnpj": "45661084168914",
        "estado": "BA",
        "municipio": "Camaçari",
        "nome_fantasia": "Premium Café do Pedro",
        "razao_social": "Fresco Café da Júlia Ltda.",
        "id": "0b11a70d-d156-45d6-aefc-554016330054"
    },
    {
        "cnpj": "57379088356567",
        "estado": "CE",
        "municipio": "Sobral",
        "nome_fantasia": "Fresco Café da Maria",
        "razao_social": "Delicioso Pão do Paulo Ltda.",
        "id": "72d95248-ca00-40a3-8245-aff62098ab0a"
    },
    {
        "cnpj": "81836429251483",
        "estado": "RJ",
        "municipio": "Niterói",
        "nome_fantasia": "Premium Frutas do José",
        "razao_social": "Saboroso Frutas do Carlos Ltda.",
        "id": "ea90175e-1f3e-44ca-978a-c4ee157ea0f1"
    },
    {
        "cnpj": "93031409403738",
        "estado": "CE",
        "municipio": "Caucaia",
        "nome_fantasia": "Fino Lanches do Paulo",
        "razao_social": "Doce Lanches da Ana Ltda.",
        "id": "3e068f70-50a4-4e58-b8ef-3e39c6be874b"
    },
    {
        "cnpj": "51031761897344",
        "estado": "SC",
        "municipio": "Criciúma",
        "nome_fantasia": "Popular Lanches do Rafael",
        "razao_social": "Fresco Lanches do Rafael Ltda.",
        "id": "f28da5a3-6aaf-4fb5-8a2d-fc059d83fbd5"
    },
    {
        "cnpj": "93609869725534",
        "estado": "MG",
        "municipio": "Juiz de Fora",
        "nome_fantasia": "Especial Bolos da Clara",
        "razao_social": "Caseiro Pão do José Ltda.",
        "id": "1e7e6a2c-bebc-4d6b-adf7-393aa61ed12c"
    },
    {
        "cnpj": "83116780222212",
        "estado": "MG",
        "municipio": "Uberlândia",
        "nome_fantasia": "Popular Lanches da Maria",
        "razao_social": "Natural Flores do Pedro Ltda.",
        "id": "ddbe17ac-af24-46e0-92b6-2597d8fdf648"
    },
    {
        "cnpj": "49938866859396",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Natural Mel do Pedro",
        "razao_social": "Popular Mel da Clara Ltda.",
        "id": "9c638ce9-002c-468d-8156-c6b27ad532ff"
    },
    {
        "cnpj": "12989105436838",
        "estado": "SP",
        "municipio": "São Paulo",
        "nome_fantasia": "Premium Frutas do Rafael",
        "razao_social": "Fino Frutas da Júlia Ltda.",
        "id": "5860bc27-89f3-4d39-b6ed-2fa1ae3704bb"
    },
    {
        "cnpj": "61400727447745",
        "estado": "MG",
        "municipio": "Juiz de Fora",
        "nome_fantasia": "Fino Mel da Ana",
        "razao_social": "Caseiro Café do João Ltda.",
        "id": "ee08cf09-f6c8-45e3-a0f1-181a44b12849"
    },
    {
        "cnpj": "69885398274142",
        "estado": "SC",
        "municipio": "Blumenau",
        "nome_fantasia": "Delicioso Sabores do Carlos",
        "razao_social": "Saboroso Sabores do João Ltda.",
        "id": "8a416e58-2ccd-49c1-a8b3-e49d942e10c5"
    },
    {
        "cnpj": "58944287944589",
        "estado": "SP",
        "municipio": "Santos",
        "nome_fantasia": "Fresco Doces da Maria",
        "razao_social": "Delicioso Café da Ana Ltda.",
        "id": "e322e4e4-af43-4937-adfd-04334d2f03e0"
    },
    {
        "cnpj": "52700510863557",
        "estado": "PE",
        "municipio": "Jaboatão dos Guararapes",
        "nome_fantasia": "Popular Bolos da Júlia",
        "razao_social": "Caseiro Queijos do Carlos Ltda.",
        "id": "5eb5ac88-2cdd-4721-9749-b7c59d73cd3f"
    },
    {
        "cnpj": "84207123588147",
        "estado": "SP",
        "municipio": "Ribeirão Preto",
        "nome_fantasia": "Delicioso Frutas da Clara",
        "razao_social": "Delicioso Lanches da Maria Ltda.",
        "id": "2032594e-9597-468e-a269-25d7a2af8bae"
    },
    {
        "cnpj": "32237436940724",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Fresco Lanches da Clara",
        "razao_social": "Caseiro Sabores do José Ltda.",
        "id": "72bfaca9-aa62-48f5-87da-4446d0beeb41"
    },
    {
        "cnpj": "71402144139485",
        "estado": "MG",
        "municipio": "Juiz de Fora",
        "nome_fantasia": "Fino Pão do Carlos",
        "razao_social": "Delicioso Sabores da Júlia Ltda.",
        "id": "c3e1c48b-3d52-462c-abe2-9fa8270a43a8"
    },
    {
        "cnpj": "81694156384248",
        "estado": "CE",
        "municipio": "Fortaleza",
        "nome_fantasia": "Delicioso Café do José",
        "razao_social": "Natural Sabores do Pedro Ltda.",
        "id": "a6aa9151-9245-4145-aad5-ea7826f41779"
    },
    {
        "cnpj": "71092837496656",
        "estado": "RJ",
        "municipio": "Campos dos Goytacazes",
        "nome_fantasia": "Fresco Flores do Pedro",
        "razao_social": "Fino Doces da Ana Ltda.",
        "id": "ef3cb050-0981-49e3-bf9d-d047ddc9d39c"
    },
    {
        "cnpj": "16288785802331",
        "estado": "RJ",
        "municipio": "Petrópolis",
        "nome_fantasia": "Popular Bolos do José",
        "razao_social": "Especial Flores do Carlos Ltda.",
        "id": "5649b5a3-f28f-442c-aae1-9dffda3470cd"
    },
    {
        "cnpj": "44731659871146",
        "estado": "SC",
        "municipio": "Blumenau",
        "nome_fantasia": "Popular Café do José",
        "razao_social": "Delicioso Lanches do José Ltda.",
        "id": "9a5e7134-b076-4672-8ed2-d5e6a8514acd"
    },
    {
        "cnpj": "91546672955099",
        "estado": "SC",
        "municipio": "Florianópolis",
        "nome_fantasia": "Saboroso Mel da Ana",
        "razao_social": "Saboroso Sabores da Clara Ltda.",
        "id": "ccf3228a-e551-4e5d-8408-37a546226cdb"
    },
    {
        "cnpj": "11462489939348",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Fino Pão do Rafael",
        "razao_social": "Premium Bolos do Rafael Ltda.",
        "id": "1ebf474b-1dda-4aa2-84d8-331a388da684"
    },
    {
        "cnpj": "87154848890478",
        "estado": "SC",
        "municipio": "Joinville",
        "nome_fantasia": "Fresco Lanches do Paulo",
        "razao_social": "Delicioso Bolos do Carlos Ltda.",
        "id": "cd4ae6a3-3f1a-4812-85e7-d9ae57b69e54"
    },
    {
        "cnpj": "47664221808019",
        "estado": "MG",
        "municipio": "Uberlândia",
        "nome_fantasia": "Premium Sabores do José",
        "razao_social": "Especial Flores da Júlia Ltda.",
        "id": "9c67e609-3b67-4289-8cc7-b1b796e07bb8"
    },
    {
        "cnpj": "39939080979168",
        "estado": "MG",
        "municipio": "Contagem",
        "nome_fantasia": "Delicioso Sabores do Carlos",
        "razao_social": "Delicioso Sabores do Carlos Ltda.",
        "id": "67933466-6556-418f-83bd-79f41e2c4291"
    },
    {
        "cnpj": "20044148196737",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Natural Café do Rafael",
        "razao_social": "Premium Café do Rafael Ltda.",
        "id": "969cb2bd-11a3-4178-9520-b1d3ddc003c4"
    },
    {
        "cnpj": "83636142488352",
        "estado": "SC",
        "municipio": "Criciúma",
        "nome_fantasia": "Premium Lanches do Paulo",
        "razao_social": "Especial Flores da Júlia Ltda.",
        "id": "7fec0c46-851c-420f-a3d0-08bef3eaf311"
    },
    {
        "cnpj": "41431225804767",
        "estado": "PR",
        "municipio": "Londrina",
        "nome_fantasia": "Especial Flores da Júlia",
        "razao_social": "Caseiro Pão da Maria Ltda.",
        "id": "2f4715c8-c4dd-4b23-8501-12aea2344746"
    },
    {
        "cnpj": "99653863276412",
        "estado": "SP",
        "municipio": "Santos",
        "nome_fantasia": "Premium Sabores do Paulo",
        "razao_social": "Saboroso Lanches do Rafael Ltda.",
        "id": "ef9a370f-9ea9-4851-a224-4d44b6a07eec"
    },
    {
        "cnpj": "64772870271211",
        "estado": "CE",
        "municipio": "Fortaleza",
        "nome_fantasia": "Popular Flores do João",
        "razao_social": "Especial Flores da Maria Ltda.",
        "id": "9cdedd21-8845-408c-b1f4-a1bd8c940b22"
    },
    {
        "cnpj": "37922373144723",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Especial Doces do Rafael",
        "razao_social": "Fino Pão da Ana Ltda.",
        "id": "1a883217-a99e-4da0-98cc-7a70f4b14928"
    },
    {
        "cnpj": "42546702787335",
        "estado": "SC",
        "municipio": "Criciúma",
        "nome_fantasia": "Natural Lanches da Júlia",
        "razao_social": "Caseiro Flores do Pedro Ltda.",
        "id": "a16cfc16-d614-4f5f-b0c4-3aebcf9cfde1"
    },
    {
        "cnpj": "40321397304975",
        "estado": "PE",
        "municipio": "Jaboatão dos Guararapes",
        "nome_fantasia": "Doce Flores do Rafael",
        "razao_social": "Delicioso Flores do Rafael Ltda.",
        "id": "80ee84da-fbf9-4e4e-b4ec-cf3476633bec"
    },
    {
        "cnpj": "27623485132959",
        "estado": "RJ",
        "municipio": "Campos dos Goytacazes",
        "nome_fantasia": "Fino Café da Ana",
        "razao_social": "Premium Pão da Clara Ltda.",
        "id": "e83fc544-cefe-4be0-9b20-8c48a582446b"
    },
    {
        "cnpj": "34610247697694",
        "estado": "DF",
        "municipio": "Brasília",
        "nome_fantasia": "Especial Flores da Maria",
        "razao_social": "Especial Café do José Ltda.",
        "id": "0b1e3d11-c115-4987-a3b2-6fab0d262752"
    },
    {
        "cnpj": "72369029645031",
        "estado": "MG",
        "municipio": "Belo Horizonte",
        "nome_fantasia": "Saboroso Flores do João",
        "razao_social": "Doce Café do Paulo Ltda.",
        "id": "db269e78-796e-4d1a-be3c-ec20eef1123f"
    },
    {
        "cnpj": "13197544556056",
        "estado": "SP",
        "municipio": "Santos",
        "nome_fantasia": "Delicioso Lanches do João",
        "razao_social": "Caseiro Doces da Maria Ltda.",
        "id": "bea07e01-1423-4912-b42f-ce4b13148ea4"
    },
    {
        "cnpj": "87115042299499",
        "estado": "SC",
        "municipio": "Itajaí",
        "nome_fantasia": "Caseiro Sabores da Júlia",
        "razao_social": "Fresco Sabores do Paulo Ltda.",
        "id": "22d31975-205f-4b02-b9fe-9bdd54bfbf85"
    },
    {
        "cnpj": "97091482713686",
        "estado": "CE",
        "municipio": "Caucaia",
        "nome_fantasia": "Especial Doces do Paulo",
        "razao_social": "Premium Frutas do João Ltda.",
        "id": "5b082155-29f2-4722-9eee-0146c011eaa5"
    },
    {
        "cnpj": "80499561944830",
        "estado": "SP",
        "municipio": "Sorocaba",
        "nome_fantasia": "Saboroso Sabores da Clara",
        "razao_social": "Especial Mel do Rafael Ltda.",
        "id": "7ded7c4d-595b-417c-a133-7ae26ff42e4e"
    },
    {
        "cnpj": "12345678000199",
        "estado": "SP",
        "municipio": "Ribeirão Preto",
        "nomeFantasia": "Fino Pão do Paulo",
        "razaoSocial": "Premium Café do Rafael Ltda.",
        "id": "e2c6d8d8-b37e-49bf-b668-ee1271fea938",
        "nome_fantasia": "Fino Pão do Paulo",
        "razao_social": "Premium Café do Rafael Ltda."
    }
]
*/
