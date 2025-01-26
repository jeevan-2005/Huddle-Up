import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { avatarImages } from "../constants/index";

interface MeetingCardProps {
  type: "ended" | "upcoming" | "recordings";
  title: string;
  date: string;
  icon: string;
  buttonIcon1?: string;
  buttonText?: string;
  isPreviousMeeting?: boolean;
  link: string;
  handleClick: () => void;
}

const MeetingCard = ({
  type,
  title,
  date,
  icon,
  buttonIcon1,
  buttonText,
  isPreviousMeeting,
  link,
  handleClick,
}: MeetingCardProps) => {
  const { toast } = useToast();
  return (
    <section className="flex flex-col min-h-[258px] rounded-[14px] px-4 py-8 justify-between w-full bg-dark-1 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt={type} width={28} height={28} />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-base font-normal">{date}</p>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>
        <div className="relative flex w-full max-sm:hidden">
          {avatarImages?.map((img, index) => (
            <Image
              src={img}
              alt="attendees"
              key={index}
              height={40}
              width={40}
              className={cn("rounded-full", {
                absolute: index > 0,
              })}
              style={{ top: 0, left: index * 28 }}
            />
          ))}
          <div className="flex justify-center items-center absolute left-[136px] size-10 rounded-full border-[5px] bg-dark-4 border-dark-3">
            +5
          </div>
        </div>
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-dark-4 px-6"
            >
              <Image src="/icons/copy.svg" alt="copy" height={20} width={20} />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
