import React from "react";
import { Flex, FlexItem, Icon, Tooltip } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import TimesCircleIcon from "@patternfly/react-icons/dist/esm/icons/times-circle-icon";
import InProgressIcon from "@patternfly/react-icons/dist/esm/icons/in-progress-icon";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import UnknownIcon from "@patternfly/react-icons/dist/esm/icons/unknown-icon";
import QuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/question-circle-icon";

export type IconedStatusPreset =
  | "Inherited"
  | "Canceled"
  | "Completed"
  | "Error"
  | "Failed"
  | "InProgress"
  | "NotStarted"
  | "Ok"
  | "Scheduled"
  | "Unknown";

export type IconedStatusStatusType =
  | "custom"
  | "info"
  | "success"
  | "warning"
  | "danger";

type IconedStatusPresetType = {
  [key in IconedStatusPreset]: Omit<IIconedStatusProps, "preset">;
};

export interface IIconedStatusProps {
  preset?: IconedStatusPreset;
  status?: IconedStatusStatusType;
  icon?: React.ReactNode;
  className?: string;
  label?: React.ReactNode | string;
  tooltipMessage?: string;
  tooltipCount?: number;
}

export const IconedStatus: React.FC<IIconedStatusProps> = ({
  preset,
  status,
  icon,
  className = "",
  label,
  tooltipCount = 0,
}: IIconedStatusProps) => {
  const { t } = useTranslation();
  const presets: IconedStatusPresetType = {
    Inherited: {
      icon: <QuestionCircleIcon />,
      status: "info",
      label: t("terms.inherited"),
      tooltipMessage: t("message.inheritedReviewTooltip", {
        count: tooltipCount,
      }),
    },
    Canceled: {
      icon: <TimesCircleIcon />,
      status: "info",
      label: t("terms.canceled"),
    },
    Completed: {
      icon: <CheckCircleIcon />,
      status: "success",
      label: t("terms.completed"),
    },
    Error: {
      icon: <ExclamationCircleIcon />,
      status: "danger",
      label: t("terms.error"),
    },
    Failed: {
      icon: <ExclamationCircleIcon />,
      status: "danger",
      label: t("terms.failed"),
    },
    InProgress: {
      icon: <InProgressIcon />,
      status: "info",
      label: t("terms.inProgress"),
    },
    NotStarted: {
      icon: <TimesCircleIcon />,
      label: t("terms.notStarted"),
    },
    Ok: {
      icon: <CheckCircleIcon />,
      status: "success",
    },
    Scheduled: {
      icon: <InProgressIcon />,
      status: "info",
      label: t("terms.scheduled"),
    },
    Unknown: {
      icon: <UnknownIcon />,
    },
  };
  const presetProps = preset && presets[preset];

  const IconWithOptionalTooltip: React.FC<{ children: React.ReactElement }> = ({
    children,
  }) =>
    presetProps?.tooltipMessage ? (
      <Tooltip content={presetProps?.tooltipMessage}>{children}</Tooltip>
    ) : (
      <>{children}</>
    );

  return (
    <Flex
      flexWrap={{ default: "nowrap" }}
      spaceItems={{ default: "spaceItemsSm" }}
    >
      <FlexItem>
        <IconWithOptionalTooltip>
          <Icon status={status || presetProps?.status} className={className}>
            {icon || presetProps?.icon || <UnknownIcon />}
          </Icon>
        </IconWithOptionalTooltip>
      </FlexItem>
      <FlexItem>{label || presetProps?.label}</FlexItem>
    </Flex>
  );
};
