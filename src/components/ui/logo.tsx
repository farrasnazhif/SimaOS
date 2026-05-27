import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SimaOSLogo() {
  return (
    <Link href="/">
      <Image width={80} height={80} alt="Logo" src="/simaos-logo.png" />
    </Link>
  );
}
