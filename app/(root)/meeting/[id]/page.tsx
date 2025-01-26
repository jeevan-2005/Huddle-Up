"use client";
import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

// the params field is provided as part of the server-side rendering context, and its type is usually a Promise because it's dynamic and might involve async operations during build or runtime. so use Awaited<> .
type Props = {
  params: Awaited<{
    id: string;
  }>;
};

const Meeting = ({ params }: Props) => {
  const { isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading} = useGetCallById(params.id);

  if(!isLoaded || isCallLoading) return (
    <div className="h-screen flex items-center justify-center w-full">
      <Loader />
    </div>
  )

  return (
    <main>
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupComplete ? <MeetingRoom /> : <MeetingSetup setIsSetupComplete={setIsSetupComplete} />}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
