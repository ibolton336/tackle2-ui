import * as React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  TextContent,
  Text,
  TextVariants,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Spinner,
  Bullseye,
  List,
  ListItem,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  LabelGroup,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import {
  Application,
  Task,
  Ref,
  Archetype,
  AssessmentWithSectionOrder,
} from "@app/api/models";

import {
  getDependenciesUrlFilteredByAppName,
  getIssuesSingleAppSelectedLocation,
} from "@app/pages/issues/helpers";
import {
  IPageDrawerContentProps,
  PageDrawerContent,
} from "@app/components/PageDrawerContext";
import { EmptyTextMessage } from "@app/components/EmptyTextMessage";
import { LabelsFromItems } from "@app/components/labels/labels-from-items/labels-from-items";
import { RiskLabel } from "@app/components/RiskLabel";
import { ReviewFields } from "@app/components/detail-drawer/review-fields";

import { ApplicationTags } from "../application-tags";
import { AssessedArchetypes } from "./components/assessed-archetypes";
import { ApplicationDetailFields } from "./application-detail-fields";
import { ReportsTab } from "./reports-tab";

export interface IApplicationDetailDrawerProps
  extends Pick<IPageDrawerContentProps, "onCloseClick"> {
  application: Application | null;
  analysisTask: Task | undefined | null;
  craneTask: Task | undefined | null;
  applications?: Application[];
  assessments?: AssessmentWithSectionOrder[];
  archetypes?: Archetype[];
  onEditClick: () => void;
}

export enum DetailDrawerTabKey {
  Details = 0,
  Tags,
  Reports,
  Facts,
  Reviews,
}

export const ApplicationDetailDrawer: React.FC<
  IApplicationDetailDrawerProps
> = ({
  onCloseClick,
  application,
  assessments,
  archetypes,
  analysisTask,
  craneTask,
  onEditClick,
}) => {
  const { t } = useTranslation();
  const [activeTabKey, setActiveTabKey] = React.useState<DetailDrawerTabKey>(
    DetailDrawerTabKey.Details
  );

  const isTaskRunning = analysisTask?.state === "Running";

  const reviewedArchetypes =
    application?.archetypes
      ?.map(
        (archetypeRef) =>
          archetypes?.find((archetype) => archetype.id === archetypeRef.id)
      )
      .filter((fullArchetype) => fullArchetype?.review)
      .filter(Boolean) || [];

  return (
    <PageDrawerContent
      isExpanded={!!application}
      onCloseClick={onCloseClick}
      focusKey={application?.id}
      pageKey="app-inventory"
      header={
        <TextContent>
          <Text component="small" className={spacing.mb_0}>
            {t("terms.name")}
          </Text>
          <Title headingLevel="h2" size="lg" className={spacing.mtXs}>
            {application?.name}
          </Title>
        </TextContent>
      }
    >
      <div>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabKey) =>
            setActiveTabKey(tabKey as DetailDrawerTabKey)
          }
          className={spacing.mtLg}
        >
          <Tab
            eventKey={DetailDrawerTabKey.Details}
            title={<TabTitleText>{t("terms.details")}</TabTitleText>}
          >
            <TextContent className={`${spacing.mtMd} ${spacing.mbMd}`}>
              <Text component="small">{application?.description}</Text>
              <List isPlain>
                {application ? (
                  <>
                    <ListItem>
                      <Link
                        to={getIssuesSingleAppSelectedLocation(application.id)}
                      >
                        Issues
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link
                        to={getDependenciesUrlFilteredByAppName(
                          application?.name
                        )}
                      >
                        Dependencies
                      </Link>
                    </ListItem>
                  </>
                ) : null}
              </List>
              <Title headingLevel="h3" size="md">
                {t("terms.effort")}
              </Title>
              <Text component="small">
                <Text component="small">
                  {application?.effort !== 0 &&
                  application?.effort !== undefined
                    ? application?.effort
                    : t("terms.unassigned")}
                </Text>
              </Text>
            </TextContent>
            <>
              <Title headingLevel="h3" size="md">
                {t("terms.archetypes")}
              </Title>
              <DescriptionList
                isHorizontal
                isCompact
                columnModifier={{ default: "1Col" }}
                horizontalTermWidthModifier={{
                  default: "15ch",
                }}
              >
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    {t("terms.associatedArchetypes")}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {application?.archetypes?.length ? (
                      <>
                        <DescriptionListDescription>
                          {application.archetypes.length ?? 0 > 0 ? (
                            <ArchetypeLabels
                              archetypeRefs={application.archetypes as Ref[]}
                            />
                          ) : (
                            <EmptyTextMessage message={t("terms.none")} />
                          )}
                        </DescriptionListDescription>
                      </>
                    ) : (
                      <EmptyTextMessage message={t("terms.none")} />
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>
                    {t("terms.archetypesAssessed")}
                  </DescriptionListTerm>
                  {assessments && assessments.length ? (
                    <DescriptionListDescription>
                      <AssessedArchetypes
                        application={application}
                        assessments={assessments}
                      />
                    </DescriptionListDescription>
                  ) : (
                    <EmptyTextMessage message={t("terms.none")} />
                  )}
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>
                    {t("terms.archetypesReviewed")}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <LabelGroup>
                      {reviewedArchetypes?.length ? (
                        reviewedArchetypes.map((reviewedArchetype) => (
                          <ArchetypeItem
                            key={reviewedArchetype?.id}
                            archetype={reviewedArchetype}
                          />
                        ))
                      ) : (
                        <EmptyTextMessage message={t("terms.none")} />
                      )}
                    </LabelGroup>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
              <TextContent className={spacing.mtLg}>
                <Title headingLevel="h3" size="md">
                  {t("terms.riskFromApplication")}
                </Title>
                <Text component="small" cy-data="comments">
                  <RiskLabel risk={application?.risk || "unknown"} />
                </Text>
              </TextContent>
              <ApplicationDetailFields
                application={application}
                onEditClick={onEditClick}
                onCloseClick={onCloseClick}
              />
            </>
          </Tab>

          <Tab
            eventKey={DetailDrawerTabKey.Tags}
            title={<TabTitleText>Tags</TabTitleText>}
          >
            {application && isTaskRunning ? (
              <Bullseye className={spacing.mtLg}>
                <TextContent>
                  <Text component={TextVariants.h3}>
                    {t("message.taskInProgressForTags")}
                    <Spinner
                      isInline
                      aria-label="spinner when a new analysis is running"
                    />
                  </Text>
                </TextContent>
              </Bullseye>
            ) : null}

            {application ? <ApplicationTags application={application} /> : null}
          </Tab>
          <ReportsTab
            application={application}
            analysisTask={analysisTask}
            craneTask={craneTask}
          />

          <Tab
            eventKey={DetailDrawerTabKey.Reviews}
            title={<TabTitleText>{t("terms.review")}</TabTitleText>}
          >
            <ReviewFields application={application} />
          </Tab>
        </Tabs>
      </div>
    </PageDrawerContent>
  );
};
const ArchetypeLabels: React.FC<{ archetypeRefs?: Ref[] }> = ({
  archetypeRefs,
}) => <LabelsFromItems items={archetypeRefs} />;

const ArchetypeItem: React.FC<{ archetype: Archetype }> = ({ archetype }) => {
  return <Label color="grey">{archetype.name}</Label>;
};
