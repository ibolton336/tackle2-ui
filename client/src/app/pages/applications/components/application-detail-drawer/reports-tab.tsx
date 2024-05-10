import { COLOR_HEX_VALUES_BY_NAME } from "@app/Constants";
import { Application, Task, Identity } from "@app/api/models";
import { SimpleDocumentViewerModal } from "@app/components/SimpleDocumentViewer";
import {
  TextContent,
  Text,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Tooltip,
  Button,
  Divider,
} from "@patternfly/react-core";
import React from "react";
import { ApplicationFacts } from "./application-facts";
import DownloadButton from "./components/download-button";
import { useTranslation } from "react-i18next";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import { EmptyTextMessage } from "@app/components/EmptyTextMessage";
import { useSetting } from "@app/queries/settings";
import { getKindIdByRef } from "@app/utils/model-utils";
import { useFetchFacts } from "@app/queries/facts";
import { useFetchIdentities } from "@app/queries/identities";
import CheckCircleIcon from "@patternfly/react-icons/dist/js/icons/check-circle-icon";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/js/icons/exclamation-circle-icon";
import { MimeType } from "@app/api/models";
import { useFetchDeploymentByID } from "@app/queries/deployments";
import ExternalLink from "@app/components/ExternalLink";
import keycloak from "@app/keycloak";

export interface ReportsTabProps {
  application: Application | null;
  analysisTask: Task | undefined | null;
  craneTask: Task | undefined | null;
  applications?: Application[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  application,
  analysisTask,
  craneTask,
}) => {
  const token = keycloak;
  console.log("token", token);
  const { t } = useTranslation();
  const { identities } = useFetchIdentities();
  const { facts, isFetching } = useFetchFacts(application?.id);
  const { deployment } = useFetchDeploymentByID(application?.deployment?.id);

  const [taskIdToView, setTaskIdToView] = React.useState<number>();

  let matchingSourceCredsRef: Identity | undefined;
  let matchingMavenCredsRef: Identity | undefined;
  if (application && identities) {
    matchingSourceCredsRef = getKindIdByRef(identities, application, "source");
    matchingMavenCredsRef = getKindIdByRef(identities, application, "maven");
  }
  const notAvailable = <EmptyTextMessage message={t("terms.notAvailable")} />;

  const enableDownloadSetting = useSetting("download.html.enabled");

  return (
    <>
      <TextContent className={spacing.mtMd}>
        <Title headingLevel="h3" size="md">
          Credentials
        </Title>
        {matchingSourceCredsRef && matchingMavenCredsRef ? (
          <Text component="small">
            <CheckCircleIcon color="green" />
            <span className={spacing.mlSm}>Source and Maven</span>
          </Text>
        ) : matchingMavenCredsRef ? (
          <Text component="small">
            <CheckCircleIcon color="green" />
            <span className={spacing.mlSm}>Maven</span>
          </Text>
        ) : matchingSourceCredsRef ? (
          <Text component="small">
            <CheckCircleIcon color="green" />
            <span className={spacing.mlSm}>Source</span>
          </Text>
        ) : (
          notAvailable
        )}
        <Title headingLevel="h3" size="md">
          Analysis
        </Title>
        {analysisTask?.state === "Succeeded" && application ? (
          <>
            <DescriptionList isHorizontal columnModifier={{ default: "2Col" }}>
              <DescriptionListGroup>
                <DescriptionListTerm>Details</DescriptionListTerm>
                <DescriptionListDescription>
                  <Tooltip content="View the analysis task details">
                    <Button
                      icon={
                        <span className={spacing.mrXs}>
                          <ExclamationCircleIcon
                            color={COLOR_HEX_VALUES_BY_NAME.blue}
                          ></ExclamationCircleIcon>
                        </span>
                      }
                      type="button"
                      variant="link"
                      onClick={() => setTaskIdToView(analysisTask.id)}
                      className={spacing.ml_0}
                      style={{ margin: "0", padding: "0" }}
                    >
                      View analysis details
                    </Button>
                  </Tooltip>
                </DescriptionListDescription>
                <DescriptionListTerm>Download</DescriptionListTerm>
                <DescriptionListDescription>
                  <Tooltip
                    content={
                      enableDownloadSetting.data
                        ? "Click to download TAR file with HTML static analysis report"
                        : "Download TAR file with HTML static analysis report is disabled by administrator"
                    }
                    position="top"
                  >
                    <DownloadButton
                      application={application}
                      mimeType={MimeType.TAR}
                      isDownloadEnabled={enableDownloadSetting.data}
                    >
                      HTML
                    </DownloadButton>
                  </Tooltip>
                  {" | "}
                  <Tooltip
                    content={
                      enableDownloadSetting.data
                        ? "Click to download YAML file with static analysis report"
                        : "Download YAML file with static analysis report is disabled by administrator"
                    }
                    position="top"
                  >
                    <DownloadButton
                      application={application}
                      mimeType={MimeType.YAML}
                      isDownloadEnabled={enableDownloadSetting.data}
                    >
                      YAML
                    </DownloadButton>
                  </Tooltip>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            <Divider className={spacing.mtMd}></Divider>
          </>
        ) : analysisTask?.state === "Failed" ? (
          analysisTask ? (
            <>
              <Button
                icon={
                  <span className={spacing.mrXs}>
                    <ExclamationCircleIcon
                      color={COLOR_HEX_VALUES_BY_NAME.red}
                    ></ExclamationCircleIcon>
                  </span>
                }
                type="button"
                variant="link"
                onClick={() => setTaskIdToView(analysisTask.id)}
                className={spacing.ml_0}
                style={{ margin: "0", padding: "0" }}
              >
                Analysis details
              </Button>
            </>
          ) : (
            <span className={spacing.mlSm}>
              <ExclamationCircleIcon
                color={COLOR_HEX_VALUES_BY_NAME.red}
              ></ExclamationCircleIcon>
              Failed
            </span>
          )
        ) : (
          <>
            {analysisTask ? (
              <Button
                icon={
                  <span className={spacing.mrXs}>
                    <ExclamationCircleIcon
                      color={COLOR_HEX_VALUES_BY_NAME.blue}
                    ></ExclamationCircleIcon>
                  </span>
                }
                type="button"
                variant="link"
                onClick={() => setTaskIdToView(analysisTask?.id)}
                className={spacing.ml_0}
                style={{ margin: "0", padding: "0" }}
              >
                Analysis details
              </Button>
            ) : (
              notAvailable
            )}
          </>
        )}
        <SimpleDocumentViewerModal
          title={`Analysis details for ${application?.name}`}
          documentId={taskIdToView}
          onClose={() => {
            setTaskIdToView(undefined);
          }}
        />
      </TextContent>
      {!isFetching && !!facts.length && <ApplicationFacts facts={facts} />}
      {deployment ? (
        <>
          <Divider className={spacing.mtMd}></Divider>
          <TextContent className={spacing.mtMd}>
            <Title headingLevel="h3" size="md">
              Deployment
            </Title>
          </TextContent>
          <Text component="small">
            <span className={spacing.mlSm}>
              {deployment?.platform?.name || "N/A"}
            </span>
          </Text>

          <TextContent className={spacing.mtMd}>
            <Title headingLevel="h3" size="md">
              Crane output
            </Title>
          </TextContent>
          <Text component="small">
            <ExternalLink
              // href={
              //   isAuthRequired
              //     ? `/hub/applications/${application?.id}/bucket/crane/?token=${token}`
              //     : `/hub/applications/${application?.id}/bucket/crane/`
              // }
              href={`/hub/applications/${application?.id}/bucket/crane/`}
            >
              Output
            </ExternalLink>
          </Text>
        </>
      ) : null}
    </>
  );
};
