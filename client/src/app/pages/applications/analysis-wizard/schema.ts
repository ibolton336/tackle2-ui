import * as yup from "yup";
import {
  Application,
  IReadFile,
  Ref,
  Repository,
  RuleBundle,
  RuleBundleImage,
  RuleBundleKind,
  FileLoadError,
} from "@app/api/models";
import { useTranslation } from "react-i18next";
import { useAnalyzableApplicationsByMode } from "./utils";

export const ANALYSIS_MODES = [
  "binary",
  "source-code",
  "source-code-deps",
  "binary-upload",
] as const;
export type AnalysisMode = (typeof ANALYSIS_MODES)[number];

export type AnalysisScope = "app" | "app,oss" | "app,oss,select";

export interface ModeStepValues {
  mode: AnalysisMode;
  artifact: File | undefined | null;
}

const useModeStepSchema = ({
  applications,
}: {
  applications: Application[];
}): yup.SchemaOf<ModeStepValues> => {
  const { t } = useTranslation();
  const analyzableAppsByMode = useAnalyzableApplicationsByMode(applications);
  return yup.object({
    mode: yup
      .mixed<AnalysisMode>()
      .required(t("validation.required"))
      .test(
        "isModeCompatible",
        "Selected mode not supported for selected applications", // Message not exposed to the user
        (mode) => {
          const analyzableApplications = mode ? analyzableAppsByMode[mode] : [];
          if (mode === "binary-upload") {
            return analyzableApplications.length === 1;
          }
          return analyzableApplications.length > 0;
        }
      ),
    artifact: yup.mixed<File>().when("mode", {
      is: "binary-upload",
      then: (schema) => schema.required(),
    }),
  });
};

export interface TargetsStepValues {
  formTargets: string[];
  formRuleBundles: RuleBundle[];
}
export const ruleBundleSchema: yup.SchemaOf<RuleBundle> = yup.object({
  createTime: yup.string(),
  createUser: yup.string(),
  description: yup.string(),
  id: yup.number().required(),
  name: yup.string().required(),
  image: yup.mixed<RuleBundleImage>(),
  kind: yup.mixed<RuleBundleKind>(),
  rulesets: yup.array(),
  custom: yup.boolean(),
  repository: yup.mixed<Repository>(),
  identity: yup.mixed<Ref>(),
  updateUser: yup.string(),
});

const useTargetsStepSchema = (): yup.SchemaOf<TargetsStepValues> => {
  const { t } = useTranslation();
  return yup.object({
    formTargets: yup.array(),
    formRuleBundles: yup
      .array()
      .of(ruleBundleSchema)
      .min(1, "At least 1 target is required"), // TODO translation here
  });
};

export interface ScopeStepValues {
  withKnown: AnalysisScope;
  includedPackages: string[];
  hasExcludedPackages: boolean;
  excludedPackages: string[];
}

const useScopeStepSchema = (): yup.SchemaOf<ScopeStepValues> => {
  const { t } = useTranslation();
  return yup.object({
    withKnown: yup.mixed<AnalysisScope>().required(t("validation.required")),
    includedPackages: yup
      .array()
      .of(yup.string().defined())
      .when("withKnown", (withKnown, schema) =>
        withKnown.includes("select") ? schema.min(1) : schema
      ),
    hasExcludedPackages: yup.bool().defined(),
    excludedPackages: yup
      .array()
      .of(yup.string().defined())
      .when("hasExcludedPackages", (hasExcludedPackages, schema) =>
        hasExcludedPackages ? schema.min(1) : schema
      ),
  });
};

export interface CustomRulesStepValues {
  formSources: string[];
  customRulesFiles: IReadFile[];
  rulesKind: string;
  repositoryType?: string;
  sourceRepository?: string;
  branch?: string;
  rootPath?: string;
  associatedCredentials?: Ref;
}
export const customRulesFilesSchema: yup.SchemaOf<IReadFile> = yup.object({
  fileName: yup.string().required(),
  fullFile: yup.mixed<File>(),
  loadError: yup.mixed<FileLoadError>(),
  loadPercentage: yup.number(),
  loadResult: yup.mixed<"danger" | "success" | undefined>(),
  data: yup.string(),
  responseID: yup.number(),
});

const useCustomRulesStepSchema = (): yup.SchemaOf<CustomRulesStepValues> => {
  const { t } = useTranslation();
  return yup.object({
    formSources: yup.array().of(yup.string().defined()),
    rulesKind: yup.string().defined(),
    customRulesFiles: yup
      .array()
      .of(customRulesFilesSchema)
      .when("rulesKind", {
        is: "manual",
        then: yup.array().of(customRulesFilesSchema),
        otherwise: (schema) => schema,
      }),
    repositoryType: yup.mixed<string>().when("rulesKind", {
      is: "repository",
      then: yup.mixed<string>().required(),
    }),
    sourceRepository: yup.mixed<string>().when("rulesKind", {
      is: "repository",
      then: yup
        .string()
        .required("This value is required")
        .min(3, t("validation.minLength", { length: 3 }))
        .max(120, t("validation.maxLength", { length: 120 })),
    }),
    branch: yup.mixed<string>().when("rulesKind", {
      is: "repository",
      then: yup.mixed<string>(),
    }),
    rootPath: yup.mixed<string>().when("rulesKind", {
      is: "repository",
      then: yup.mixed<string>(),
    }),
    associatedCredentials: yup.mixed<any>().when("rulesKind", {
      is: "repository",
      then: yup.mixed<any>(),
    }),
  });
};

export interface OptionsStepValues {
  diva: boolean;
  excludedRulesTags: string[];
  autoTaggingEnabled: boolean;
}

const useOptionsStepSchema = (): yup.SchemaOf<OptionsStepValues> => {
  const { t } = useTranslation();
  return yup.object({
    diva: yup.bool().defined(),
    excludedRulesTags: yup.array().of(yup.string().defined()),
    autoTaggingEnabled: yup.bool().defined(),
  });
};

export type AnalysisWizardFormValues = ModeStepValues &
  TargetsStepValues &
  ScopeStepValues &
  CustomRulesStepValues &
  OptionsStepValues;

export const useAnalysisWizardFormValidationSchema = ({
  applications,
}: {
  applications: Application[];
}) => {
  const schemas = {
    modeStep: useModeStepSchema({ applications }),
    targetsStep: useTargetsStepSchema(),
    scopeStep: useScopeStepSchema(),
    customRulesStep: useCustomRulesStepSchema(),
    optionsStep: useOptionsStepSchema(),
  };
  const allFieldsSchema: yup.SchemaOf<AnalysisWizardFormValues> =
    schemas.modeStep
      .concat(schemas.targetsStep)
      .concat(schemas.scopeStep)
      .concat(schemas.customRulesStep)
      .concat(schemas.optionsStep);
  return {
    schemas,
    allFieldsSchema,
  };
};
