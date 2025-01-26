"use client";
import { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useRouter } from "next/navigation";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isInstantMeeting" | "isJoinMeeting" | undefined
  >();

  const { toast } = useToast();

  const client = useStreamVideoClient();
  const { user } = useUser();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!user || !client) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);

      if (meetingState === "isInstantMeeting") {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting Created Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create a meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <HomeCard
        title="New Meeting"
        description="Start an instant meeting"
        icon="/icons/add-meeting.svg"
        handleClick={() => setMeetingState("isInstantMeeting")}
        classname="bg-orange-1"
      />
      <HomeCard
        title="Schedule Meeting"
        description="Plan your meeting"
        icon="/icons/schedule.svg"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        classname="bg-blue-1"
      />
      <HomeCard
        title="View Recordings"
        description="Check out your recordings"
        icon="/icons/recordings.svg"
        handleClick={() => router.push("/recordings")}
        classname="bg-purple-1"
      />
      <HomeCard
        title="Join Meeting"
        description="Via invitation link"
        icon="/icons/join-meeting.svg"
        handleClick={() => setMeetingState("isJoinMeeting")}
        classname="bg-yellow-1"
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          className="text-center"
          title="Schedule a meeting"
          buttonText="Schedule Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22px] text-sky-2">
              Select date and time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          className="text-center"
          title="Meeting Created"
          buttonText="Copy Meeting Link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link copied",
            });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        className="text-center"
        title="Start an instant meeting"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === "isJoinMeeting"}
        onClose={() => setMeetingState(undefined)}
        className="text-center"
        title="Type the link here"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
