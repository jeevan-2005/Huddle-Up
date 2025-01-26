import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

type MeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: ReactNode;
  title: string;
  buttonText?: string;
  handleClick?: () => void;
  image?: string;
  buttonIcon?: string;
};

const MeetingModal = ({
  isOpen,
  onClose,
  className,
  title,
  buttonText,
  handleClick,
  image,
  buttonIcon,
  children,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-[95%] rounded-xl flex-col gap-6 border-none bg-dark-1 px-6 py-9 max-w-[520px] text-white">
        <div className="flex flex-col gap-6">
            {image && (
                <div className="flex justify-center">
                    <Image 
                        src={image}
                        alt="meeting"
                        width={72}
                        height={72}
                    />
                </div>
            )}
            <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>{title}</h1>
            {children}
            <Button className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0" onClick={handleClick} >
                {buttonIcon && (
                    <Image 
                        src={buttonIcon}
                        alt="icon"
                        width={13}
                        height={13}
                        className="mr-2"
                    />
                )}
                {buttonText || "Schedule Meeting"}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
