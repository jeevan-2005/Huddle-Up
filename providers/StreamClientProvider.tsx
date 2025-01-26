"use client";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import tokenProvider from "../actions/stream.action";
import Loader from "../components/Loader";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

type Props = {
  children: React.ReactNode;
};

const StreamVideoProvider = ({ children }: Props) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  // we can get user from clerk using useUser() hook
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error("Stream API key not found");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader />
    </div>
  );

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
