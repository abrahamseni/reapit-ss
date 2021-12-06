import React from "react";
import { useQuery } from "react-query";
import {
  PropertyModel,
  PropertyImageModel,
} from "@reapit/foundations-ts-definitions";
import { Card } from "@reapit/elements";
import axiosInstances from "../../axios";
import { ReapitConnectSession } from "@reapit/connect-session";

async function fetchPropertyImage({
  queryKey,
}: {
  queryKey: [string, ReapitConnectSession, string];
}): Promise<PropertyImageModel> {
  const res = await axiosInstances.get(
    `propertyImages/?propertyId=${queryKey[2]}`,
    {
      headers: {
        Authorization: `Bearer ${queryKey[1]?.accessToken}`,
      },
    }
  );
  return res.data;
}

type PropertyProps = {
  connectSession: ReapitConnectSession;
  embed: PropertyModel;
};

const Property = (props: PropertyProps) => {
  const { id, type, address, longDescription, description } = props.embed;
  const propertyImage = useQuery<
    PropertyImageModel,
    Error,
    PropertyImageModel,
    [string, ReapitConnectSession, string]
  >([`property-image-${id}`, props.connectSession, id!], fetchPropertyImage, {
    enabled: !!id,
  });
  return (
    <Card
      hasMainCard
      hasListCard
      mainContextMenuItems={[
        {
          icon: "trashSystem",
          onClick: () => console.log("Clicking"),
          intent: "danger",
        },
        {
          icon: "shareSystem",
          onClick: () => console.log("Clicking"),
        },
      ]}
      mainCardHeading={`${type ?? [0]} at ${address?.buildingName} No. ${
        address?.buildingNumber
      }`}
      mainCardSubHeading={description}
      // mainCardSubHeadingAdditional="Main Subheading Additional"
      mainCardBody={longDescription}
      mainCardImgUrl={propertyImage.data?.url}
      // listCardHeading="List Card Heading"
      // listCardSubHeading="List Card Sub Heading"
      listCardItems={[
        {
          listCardItemHeading: "Applicant",
          listCardItemSubHeading: "Bob Smith",
          listCardItemIcon: "applicantInfographic",
          onClick: () => console.log("Clicking"),
        },
        {
          listCardItemHeading: "Property",
          listCardItemSubHeading: address?.buildingName,
          listCardItemIcon: "houseInfographic",
          onClick: () => console.log("Clicking"),
        },
      ]}
      listContextMenuItems={[
        {
          icon: "trashSystem",
          onClick: () => console.log("Clicking"),
          intent: "danger",
        },
        {
          icon: "shareSystem",
          onClick: () => console.log("Clicking"),
        },
      ]}
    />
  );
};

export default Property;
