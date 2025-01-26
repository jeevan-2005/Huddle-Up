"use client";
import { SidebarLinks } from "../constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathName = usePathname();
  return (
    <section className="flex flex-col justify-between bg-dark-1 p-6 pt-28 sticky left-0 top-0 h-screen w-fit text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-4">
        {SidebarLinks.map((link) => {
          const isActive =
            pathName === link.route || pathName.startsWith(`${link.route}/`);

          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn(
                "flex items-center justify-start gap-4 p-4 rounded-lg transition-all duration-100",
                {
                  "hover:bg-[#48484854]": !isActive,
                  "bg-blue-1": isActive,
                }
              )} // cn -> classnames (to add multiple and dynamic classnames)
            >
              <Image
                src={link.imageUrl}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
