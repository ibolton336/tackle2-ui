import * as React from "react";
import { useFormContext, UseFormRegister } from "react-hook-form";
import {
  FormGroup,
  Text,
  TextContent,
  Title,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import { IFormValues } from "./analysis-wizard";
import { SimpleSelect } from "@app/shared/components";

const options = [
  <SelectOption key="binary" component="button" value="Binary" isPlaceholder />,
  <SelectOption key="source-code" component="button" value="Source code" />,
  <SelectOption
    key="source-code-deps"
    component="button"
    value="Source code + dependencies"
  />,
];

export const SetMode: React.FunctionComponent = ({}) => {
  const { register, getValues, setValue } = useFormContext(); // retrieve all hook methods

  const { mode } = getValues();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <TextContent>
        <Title headingLevel="h3" size="xl">
          Review analysis details
        </Title>
        <Text>Review the information below, then run the analysis.</Text>
      </TextContent>
      <FormGroup label="Source for analysis" fieldId="sourceType">
        <SimpleSelect
          {...register("mode")}
          variant={SelectVariant.single}
          aria-label="Select user perspective"
          value={mode}
          onChange={(selection) => {
            setValue("mode", selection);
            setIsOpen(!isOpen);
          }}
          options={options}
        />
      </FormGroup>
    </>
  );
};
