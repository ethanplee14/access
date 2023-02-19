import { UserCircleIcon } from "@heroicons/react/20/solid";
import {
  ArchiveBoxIcon,
  ArrowLeftOnRectangleIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import VaultSearch from "./vault/vault-search";

export default function NavBar() {
  const { status } = useSession();

  return (
    <nav className={"px-10 py-2 shadow-sm border-b border-gray-300"}>
      <div className="flex items-center max-w-8xl mx-auto">
        <h1 className="text-xl font-mono font-bold">
          <Link href={"/"}>
            <a>access</a>
          </Link>
        </h1>
        <div className="flex-1">
          <div className="w-2/3 mx-auto">
            <VaultSearch />
          </div>
        </div>
        {status == "unauthenticated" ? <LoginBar /> : <NavigationOptions />}
      </div>
    </nav>
  );
}

function LoginBar() {
  return (
    <>
      <Link href={"/login"}>
        <a className="btn btn-sm btn-ghost mr-4">Login</a>
      </Link>
      <button className="btn btn-sm gap-2">
        <UserCircleIcon className={"w-5 h-5"} /> Sign Up
      </button>
    </>
  );
}

function NavigationOptions() {
  return (
    <>
      <div className="flex gap-2">
        <div className="tooltip tooltip-bottom" data-tip={"Vault"}>
          <Link href={"/vault"}>
            <a className={"btn btn-circle btn-ghost btn-sm"} title={"Vault"}>
              <ArchiveBoxIcon className={"w-5"} />
            </a>
          </Link>
        </div>
        <div className="tooltip tooltip-bottom" data-tip={"Add resource"}>
          <Link href={"/resource"}>
            <a className={"btn btn-circle btn-ghost btn-sm"}>
              <DocumentPlusIcon className={"w-5"} />
            </a>
          </Link>
        </div>
      </div>
      <div className="divider divider-horizontal" />
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-circle btn-ghost btn-sm">
          <UserCircleIcon className={"w-8"} />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu menu-compact p-2 shadow bg-base-200 rounded-box w-30"
        >
          <li onClick={() => signOut()}>
            <a>
              <ArrowLeftOnRectangleIcon className={"w-5"} /> Logout
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
