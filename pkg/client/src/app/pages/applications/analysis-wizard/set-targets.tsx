import React from "react";
import {
  Title,
  Stack,
  StackItem,
  TextContent,
  Text,
} from "@patternfly/react-core";

import { SelectCardGallery } from "./components/select-card-gallery";
import { useFormContext } from "react-hook-form";

export const SetTargets: React.FunctionComponent = ({}) => {
  const { getValues, setValue } = useFormContext(); // retrieve all hook methods
  const { targets } = getValues();
  return (
    <>
      <TextContent>
        <Title headingLevel="h3" size="xl">
          Set targets
        </Title>
        <Text>
          Select one or more target options in focus for the analysis.
        </Text>
      </TextContent>
      <Stack>
        <StackItem>
          <SelectCardGallery
            values={targets}
            onChange={(value) => {
              setValue("targets", value);
            }}
          />
        </StackItem>
      </Stack>{" "}
    </>
  );
};
