import {
  useReapitConnect,
  ReapitConnectSession,
} from "@reapit/connect-session";
import { AppointmentModelPagedResult } from "@reapit/foundations-ts-definitions";
import { useQuery } from "react-query";
import axios from "../axios";
import { reapitConnectBrowserSession } from "../core/connect-session";

async function getAllAppointments({
  queryKey,
}: {
  queryKey: [string, ReapitConnectSession | null];
}): Promise<AppointmentModelPagedResult> {
  const res = await axios.get(`appointments/`, {
    headers: {
      Authorization: `Bearer ${queryKey[1]?.accessToken}`,
    },
  });
  return res.data;
}

export const useGetAppointments = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const appointments = useQuery<
    AppointmentModelPagedResult,
    Error,
    AppointmentModelPagedResult,
    [string, ReapitConnectSession | null]
  >(["getAllAppointments", connectSession], getAllAppointments);
  return appointments;
};
