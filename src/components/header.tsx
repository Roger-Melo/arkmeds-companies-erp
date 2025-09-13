import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg"; // Importando o SVG

function Logo() {
  return <Image src={logo} alt="Logo Arkmeds" width={206} height={45} />;
}

const routes = [
  {
    name: "Início",
    path: "/",
  },
  {
    name: "Cadastrar Empresa",
    path: "/cadastro-de-empresa",
  },
];

export function Header() {
  return (
    <header>
      <Logo />
      <nav>
        <ul>
          {routes.map((route) => (
            <Link key={route.name} href={route.path}>
              {route.name}
            </Link>
          ))}
        </ul>
      </nav>
    </header>
  );
}
