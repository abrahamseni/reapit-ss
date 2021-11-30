import React, { useEffect, FC, useState } from "react";
import {
  Title,
  BodyText,
  Table,
  TableRow,
  TableHeadersRow,
  TableHeader,
  TableCell,
  Icon,
} from "@reapit/elements";
import {
  useReapitConnect,
  ReapitConnectSession,
} from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { configurationAppointmentsApiService } from "../../platform-api/configuration-api";
import { ListItemModel, Properties } from "@reapit/foundations-ts-definitions";
import { BASE_HEADERS } from "../../constants/api";
import { useQuery } from "react-query";
import axios from "../../axios";

export type AuthenticatedProps = {};

async function getAllProperties({
  queryKey,
}: {
  queryKey: [String, ReapitConnectSession | null];
}): Promise<Properties> {
  const res = await axios.get("properties/?marketingMode=selling", {
    headers: {
      Authorization: `Bearer ${queryKey[1]?.accessToken}`,
    },
  });
  return res.data;
}

export const Authenticated: FC<AuthenticatedProps> = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const [appointmentConfigTypes, setAppointmentConfigTypes] = useState<
    ListItemModel[]
  >([]);

  const properties = useQuery<
    Properties,
    Error,
    Properties,
    [String, ReapitConnectSession | null]
  >(["getAllProperties", connectSession], getAllProperties);
  const { status, data, error } = properties;

  useEffect(() => {
    const fetchAppoinmentConfigs = async () => {
      if (!connectSession) return;
      const serviceResponse = await configurationAppointmentsApiService(
        connectSession
      );
      if (serviceResponse) {
        setAppointmentConfigTypes(serviceResponse);
      }
    };
    if (connectSession) {
      fetchAppoinmentConfigs();
    }
  }, [connectSession]);

  // console.log("Appointment Config Types are: ", appointmentConfigTypes);

  const headers = [
    "No",
    "Type",
    "Address",
    "Bathrooms",
    "Bedrooms",
    "Currency",
    "Price",
  ];

  const renderHeader = (headers: string[]) => {
    return headers.map((header) => (
      <TableHeader key={header}>{header}</TableHeader>
    ));
  };

  const renderCell = (property, index: number) => {
    const address = [
      property.address.line1,
      property.address.line2,
      property.address.line3,
      property.address.line4,
    ].reduce((acc, el, i) => {
      if (i === 0) return el;
      if (el !== "") {
        return `${acc}, ${el}`;
      }
      return acc;
    }, "");

    return (
      <>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{property.type[0]}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{property.bathrooms}</TableCell>
        <TableCell>{property.bedrooms}</TableCell>
        <TableCell>{property.currency}</TableCell>
        <TableCell>{property.selling.price}</TableCell>
      </>
    );
  };

  return (
    <>
      <Title>Properties for sale</Title>
      {status === "loading" ? (
        <BodyText>Loading</BodyText>
      ) : status === "error" ? (
        <BodyText>{error?.message}</BodyText>
      ) : (
        <Table>
          <TableHeadersRow>{renderHeader(headers)}</TableHeadersRow>
          {data &&
            data["_embedded"].map((property, index: number) => {
              return (
                <TableRow key={property.id}>
                  {renderCell(property, index)}
                </TableRow>
              );
            })}
        </Table>
      )}
    </>
  );
};

export default Authenticated;
