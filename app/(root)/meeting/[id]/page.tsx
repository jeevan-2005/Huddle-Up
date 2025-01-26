"use client";
import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Meeting = () => {
  const params = useParams();
  const { isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.id as string);

  if (!isLoaded || isCallLoading)
    return (
      <div className="h-screen flex items-center justify-center w-full">
        <Loader />
      </div>
    );

  return (
    <main>
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupComplete ? (
            <MeetingRoom />
          ) : (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
