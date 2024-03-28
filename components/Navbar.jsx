import Image from "next/image";
import style from "@styles/Navbar.module.css";
import logo from "@public/logo.svg";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className={style.navbar}>
      <div className={style.logo}>
        <Link href="/">
          <Image src={logo} alt="Custom Video Player" height={60} />
        </Link>
      </div>
      <div className={style.buttonStack}>
        <button className={style.loginBtn}>Login</button>
      </div>
    </nav>
  );
}
