"use client";
import { useGetCall } from "@/hooks/useGetCall";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import MeetingCard from "./MeetingCard";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type Props = {
  type: "ended" | "upcoming" | "recordings";
};

const CallList = ({ type }: Props) => {
  const { endedCalls, callRecordings, upcomingCalls, loading } = useGetCall();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const router = useRouter();
  const [recordingsLoading, setRecordingsLoading] = useState<boolean>(false);
  const {toast} = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No previous calls";
      case "upcoming":
        return "No upcoming calls";
      case "recordings":
        return "No recordings available";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      setRecordingsLoading(true);
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );

        // [["r1","r2"], ["r3"]] --> applying FlatMap --> ["r1","r2","r3"]

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        console.log(error);
        toast({
          title: "Try again later",
        })
      } finally {
        setRecordingsLoading(false);
      }
    };
    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings, toast]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  
  if (loading || recordingsLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <div key={(meeting as Call)?.id}>
            <MeetingCard
              type={type}
              title={
                (meeting as Call)?.state?.custom?.description?.substring(
                  0,
                  26
                ) ||
                (meeting as CallRecording)?.filename?.substring(0, 26) ||
                "Personal Meeting"
              }
              date={
                (meeting as Call)?.state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording)?.start_time?.toLocaleString()
              }
              icon={
                type === "ended"
                  ? "/icons/previous.svg"
                  : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
              }
              buttonIcon1={
                type === "recordings" ? "/icons/play.svg" : undefined
              }
              buttonText={type === "recordings" ? "Play" : "Start"}
              isPreviousMeeting={type === "ended"}
              link={
                type === "recordings"
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                      (meeting as Call).id
                    }`
              }
              handleClick={
                type === "recordings"
                  ? () => router.push(`${(meeting as CallRecording).url}`)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
            />
          </div>
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
