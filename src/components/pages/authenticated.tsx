import React, { useEffect, FC, useState } from "react";
import {
  Title,
  BodyText,
  Table,
  TableRow,
  TableHeadersRow,
  TableHeader,
  TableCell,
} from "@reapit/elements";
import { useReapitConnect } from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { configurationAppointmentsApiService } from "../../platform-api/configuration-api";
import { ListItemModel } from "@reapit/foundations-ts-definitions";
import { BASE_HEADERS } from "../../constants/api";

export type AuthenticatedProps = {};

export const Authenticated: FC<AuthenticatedProps> = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const [appointmentConfigTypes, setAppointmentConfigTypes] = useState<
    ListItemModel[]
  >([]);

  const [properties, setProperties] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  console.log("Appointment Config Types are: ", appointmentConfigTypes);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!connectSession) return;
      try {
        setLoading(true);
        const res = await fetch(
          "https://platform.reapit.cloud/properties/?marketingMode=selling",
          {
            method: "GET",
            headers: {
              ...BASE_HEADERS,
              Authorization: `Bearer ${connectSession.accessToken}`,
            },
          }
        );
        const data = await res.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMessage("Error fetching Properties");
        console.error("Error fetching Properties", error);
      }
    };

    fetchProperties();
  }, [connectSession]);

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
    let address =
      `${property.address.line1}, ${property.address.line2}, ${property.address.line3}, ${property.address.line4}`.replace(
        /,(\s,)*$/,
        ""
      );
    return (
      <>
        <TableCell>{index}</TableCell>
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
      <Table>
        <TableHeadersRow>{renderHeader(headers)}</TableHeadersRow>
        {loading ? (
          <BodyText>Loading</BodyText>
        ) : errorMessage !== "" ? (
          <BodyText>{errorMessage}</BodyText>
        ) : (
          properties &&
          properties["_embedded"].map((property, index: number) => {
            return (
              <TableRow key={property.id}>
                {renderCell(property, index)}
              </TableRow>
            );
          })
        )}
      </Table>
    </>
  );
};

export default Authenticated;
