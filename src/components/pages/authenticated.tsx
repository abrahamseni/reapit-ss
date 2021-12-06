import React, { useEffect, FC, useState } from "react";
import {
  Loader,
  Title,
  BodyText,
  Table,
  Pagination,
  RowProps,
} from "@reapit/elements";
import {
  useReapitConnect,
  ReapitConnectSession,
} from "@reapit/connect-session";
import { reapitConnectBrowserSession } from "../../core/connect-session";
import { configurationAppointmentsApiService } from "../../platform-api/configuration-api";
import {
  ListItemModel,
  PropertyModel,
  PropertyModelPagedResult,
} from "@reapit/foundations-ts-definitions";
import { useQuery } from "react-query";
import axios from "../../axios";
import Property from "../Card/Property";

export type AuthenticatedProps = {};

async function getAllProperties({
  queryKey,
}: {
  queryKey: [string, ReapitConnectSession | null, number];
}): Promise<PropertyModelPagedResult> {
  const res = await axios.get(
    `properties/?pageNumber=${queryKey[2]}&marketingMode=selling`,
    {
      headers: {
        Authorization: `Bearer ${queryKey[1]?.accessToken}`,
      },
    }
  );
  return res.data;
}

export const Authenticated: FC<AuthenticatedProps> = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession);
  const [appointmentConfigTypes, setAppointmentConfigTypes] = useState<
    ListItemModel[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableData, setTableData] = useState<RowProps[] | undefined>(undefined);

  const properties = useQuery<
    PropertyModelPagedResult,
    Error,
    PropertyModelPagedResult,
    [string, ReapitConnectSession | null, number]
  >(["getAllProperties", connectSession, currentPage], getAllProperties);

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

  useEffect(() => {
    const expandableContent = (embed: PropertyModel) => {
      return {
        content: <Property embed={embed} connectSession={connectSession!} />,
      };
    };

    let newTableData: RowProps[];
    if (data && data._embedded) {
      // @ts-ignore
      newTableData = data._embedded.map((embed: PropertyModel) => {
        let cells = [
          {
            label: "Type",
            value: embed.type ?? [0],
          },
          { label: "Address", value: embed.address?.buildingName },
          { label: "Bedrooms", value: embed.bedrooms },
          {
            label: "Bathrooms",
            value: embed.bathrooms,
          },
          {
            label: "Currency",
            value: embed.currency,
          },
          {
            label: "Price",
            value: embed.selling?.price,
          },
        ];
        return {
          cells,
          expandableContent: expandableContent(embed),
        };
      });
      setTableData(newTableData);
    }
  }, [data, connectSession]);

  return (
    <>
      <Title>Properties for sale</Title>
      {status === "loading" ? (
        <Loader label="='Loading" />
      ) : status === "error" ? (
        <BodyText>{error?.message}</BodyText>
      ) : (
        <>
          <Pagination
            callback={setCurrentPage}
            currentPage={currentPage!}
            numberPages={data?.pageSize!}
          />
          <Table rows={tableData} />
          <Pagination
            callback={setCurrentPage}
            currentPage={currentPage!}
            numberPages={data?.pageSize!}
          />
        </>
      )}
    </>
  );
};

export default Authenticated;
