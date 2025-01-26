import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCall = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const client = useStreamVideoClient();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !user?.id) return;
    setLoading(true);
    const loadCalls = async () => {
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user?.id },
              { members: { $in: [user?.id] } },
            ],
          },
        });
        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadCalls();
  }, [client, user?.id]);

  const now = new Date();

  const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  return {
    upcomingCalls,
    endedCalls,
    callRecordings: calls,
    loading,
  };
};
