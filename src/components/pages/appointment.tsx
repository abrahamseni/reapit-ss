import React from "react";
import axiosInstances from "../../axios";
import { useQuery } from "react-query";
import { MainContainer, Title } from "@reapit/elements";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";

interface Props {}

async function getAllAppointment({ queryKey }) {
  const res = await axiosInstances.post(
    `https://graphql.reapit.cloud/graphql`,
    {
      headers: {
        authorization: "8oai7io658fe49mur8efln68h",
        "reapit-connect-token": `${queryKey[1]?.accessToken}`,
      },
      data: {
        query: `query GetAppointments {
        appointments {
          description
          followUp
          propertyId
        }
      }`,
      },
    }
  );
  return res.data;
}

const Appointment = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const appointments = useQuery(
    ["getAllAppointment", connectSession],
    getAllAppointment
  );

  console.log(`appointments`, appointments);

  return (
    <MainContainer>
      <Title>Appointments GraphQL</Title>
    </MainContainer>
  );
};

export default Appointment;
