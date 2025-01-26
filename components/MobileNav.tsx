"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { SidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathName = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          {/* sheetTrigger to open the sheet when clicked on the hamburger icon. */}
          <Image
            src="/icons/hamburger.svg"
            width={32}
            height={32}
            alt="Hamburger"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side={"left"} className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              height={32}
              width={32}
              alt="Huddle-Up"
              className="max-sm:size-10"
            />
            <p className="text-[26px] font-extrabold text-white">Huddle-Up</p>
          </Link>

          <div className="flex flex-col justify-between overflow-y-auto">
            {/* sheet close is to close the sheet when clicked on any link navigating to some other route. */}
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 text-white">
                {SidebarLinks.map((link) => {
                  const isActive =
                    pathName === link.route ||
                    pathName.startsWith(`${link.route}/`);

                  return (
                    <SheetClose key={link.label} asChild>
                      <Link
                        href={link.route}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg w-full transition-all duration-100",
                          {
                            "hover:bg-[#48484854]": !isActive,
                            "bg-blue-1": isActive,
                          }
                        )} // cn -> classnames (to add multiple and dynamic classnames)
                      >
                        <Image
                          src={link.imageUrl}
                          alt={link.label}
                          width={20}
                          height={20}
                        />
                        <p className="font-semibold">{link.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
