import React, { useEffect, useState } from "react";
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { useTranslation } from "react-i18next";
import { AxiosError, AxiosResponse } from "axios";
import * as yup from "yup";
import {
  ActionGroup,
  Alert,
  Button,
  ButtonVariant,
  FileUpload,
  Form,
} from "@patternfly/react-core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { OptionWithValue, SimpleSelect } from "@app/shared/components";
import { Addon } from "@app/api/models";
// import { duplicateNameCheck, getAxiosErrorMessage } from "@app/utils/utils";
// import schema0 from "./schema-1.0.0.xsd";
// import schema1 from "./schema-1.1.0.xsd";
// import schema2 from "./schema-1.2.0.xsd";
import {
  toOptionLike,
  AddonDropdown,
  toAddonDropdown,
  toAddonDropdownOptionWithValue,
} from "@app/utils/model-utils";
// import { useFetchAddons } from "@app/queries/addons";

//
// import "./identity-form.css";
// import {
//   useCreateIdentityMutation,
//   useFetchIdentities,
//   useUpdateIdentityMutation,
// } from "@app/queries/identities";
// import KeyDisplayToggle from "@app/common/KeyDisplayToggle";
//
// import { XMLValidator } from "fast-xml-parser";
// import { XMLLintValidationResult } from "./validateXML";
import {
  HookFormPFGroupController,
  HookFormPFTextArea,
  HookFormPFTextInput,
} from "@app/shared/components/hook-form-pf-fields";
//
// type UserCredentials = "userpass" | "source";

interface RunAddonFormValues {
  addon: string;
  data: string;
}

export interface Task {
  addon: string;
  data: Object;
}
export interface RunAddonFormProps {
  addons: Addon[];
  onSaved: (response: AxiosResponse<Task>) => void;
  onCancel: () => void;
  // xmlValidator?: (
  //   value: string,
  //   currentSchema: string
  // ) => XMLLintValidationResult;
}

export const RunAddonForm: React.FC<RunAddonFormProps> = ({
  addons,
  onSaved,
  onCancel,
  // xmlValidator,
}) => {
  const { t } = useTranslation();

  // const [axiosError, setAxiosError] = useState<AxiosError>();
  // const [isLoading, setIsLoading] = useState(false);
  // const [task, setTask] = useState(initialTask);
  //
  // useEffect(() => {
  //   setTask(initialTask);
  //   return () => {
  //     setTask(undefined);
  //   };
  // }, []);

  // const getUserCredentialsInitialValue = (
  //   task?: Task
  // ): UserCredentials | undefined => {
  //   if (identity?.kind === "source" && identity?.user && identity?.password) {
  //     return "userpass";
  //   } else if (identity?.kind === "source") {
  //     return "source";
  //   } else {
  //     return undefined;
  //   }
  // };
  // const onCreateUpdateIdentitySuccess = (response: AxiosResponse<Identity>) => {
  //   onSaved(response);
  // };
  //
  // const onCreateUpdateIdentityError = (error: AxiosError) => {
  //   setAxiosError(error);
  // };
  //
  // const { mutate: createIdentity } = useCreateIdentityMutation(
  //   onCreateUpdateIdentitySuccess,
  //   onCreateUpdateIdentityError
  // );
  //
  // const { mutate: updateIdentity } = useUpdateIdentityMutation(
  //   onCreateUpdateIdentitySuccess,
  //   onCreateUpdateIdentityError
  // );
  //
  const onSubmit = (formValues: RunAddonFormValues) => {
    // const payload: Identity = {
    //   name: formValues.name.trim(),
    //   description: formValues.description.trim(),
    //   id: formValues.id,
    //   kind: formValues.kind,
    //   //proxy cred
    //   ...(formValues.kind === "proxy" && {
    //     password: formValues.password.trim(),
    //     user: formValues.user.trim(),
    //     key: "",
    //     settings: "",
    //   }),
    //   // mvn cred
    //   ...(formValues.kind === "maven" && {
    //     settings: formValues.settings.trim(),
    //     key: "",
    //     password: "",
    //     user: "",
    //   }),
    //   //source credentials with key
    //   ...(formValues.kind === "source" &&
    //     formValues.userCredentials === "source" && {
    //     key: formValues.key,
    //     password: formValues.password.trim(),
    //     settings: "",
    //     user: "",
    //   }),
    //   //source credentials with unamepass
    //   ...(formValues.kind === "source" &&
    //     formValues.userCredentials === "userpass" && {
    //     password: formValues.password.trim(),
    //     user: formValues.user.trim(),
    //     key: "",
    //     settings: "",
    //   }),
    // };
    //
    // if (identity) {
    //   updateIdentity({
    //     ...payload,
    //   });
    // } else {
    //   createIdentity(payload);
    // }
  };

  // const { identities } = useFetchIdentities();

  const validationSchema: yup.SchemaOf<RunAddonFormValues> = yup
    .object()
    .shape({
      addon: yup
        .string()
        .trim()
        .required(t("validation.required")),
      data: yup
        .string()
        .required(t("validation.required")),
    });

  const {
    handleSubmit,
    formState: { isSubmitting, isValidating, isValid, isDirty },
    getValues,
    setValue,
    control,
    watch,
  } = useForm<RunAddonFormValues>({
    defaultValues: {
      addon: "",
      data: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // const values = getValues();
  // const [isKeyFileRejected, setIsKeyFileRejected] = useState(false);
  // const [isSettingsFileRejected, setIsSettingsFileRejected] = useState(false);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <HookFormPFGroupController
        control={control}
        name="addon"
        label="Addon"
        fieldId="addon-select"
        isRequired
        renderInput={({ field: { onChange, value, name } }) => (
          <SimpleSelect
            id="addon-select"
            toggleId="addon-select-toggle"
            toggleAriaLabel="Addon select dropdown toggle"
            aria-label={name}
            value={value ? value : undefined}
            options={addons?.map((addon) => toAddonDropdownOptionWithValue(addon))}
            onChange={onChange}
          />
        )}
      />

      <HookFormPFGroupController
        control={control}
        name="data"
        label="Data"
        fieldId="data"
        isRequired
        renderInput={({ field: { onChange, value, name } }) => (
          <CodeEditor
            code="Some example content"
            onChange={onChange}
            language={Language.yaml}
            onEditorDidMount={() => { }}
            height="sizeToFit"
          />
        )}
      />

      <ActionGroup>
        <Button
          type="submit"
          aria-label="submit"
          variant={ButtonVariant.primary}
          isDisabled={
            !isValid || isSubmitting || isValidating // || isLoading || !isDirty
          }
        >
          {"Run"}
        </Button>
        <Button
          type="button"
          aria-label="cancel"
          variant={ButtonVariant.link}
          isDisabled={isSubmitting || isValidating}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </ActionGroup>
    </Form >
  );
};
