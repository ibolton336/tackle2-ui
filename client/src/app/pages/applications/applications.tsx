import React, { lazy, Suspense, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import {
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import { Paths } from "@app/Paths";
import { AppPlaceholder } from "@app/shared/components";

import { useTranslation } from "react-i18next";

const ApplicationsTableAssessment = lazy(
  () => import("./applications-table-assessment")
);
const ApplicationsTableAnalyze = lazy(
  () => import("./applications-table-analyze")
);
const ApplicationsTableExtras = lazy(
  () => import("./applications-table-extras")
);

const tabs: string[] = ["applicationsAssessmentTab", "applicationsAnalysisTab", "applicationsExtrasTab"];

export const Applications: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case Paths.applicationsAnalysisTab:
        setActiveTabKey(1);
        break;
      case Paths.applicationsExtrasTab:
        setActiveTabKey(2);
        break;
      default:
        setActiveTabKey(0);
        break;
    }
  }, [location.key, location.pathname]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light} className={spacing.pb_0}>
        <Level>
          <LevelItem>
            <Title headingLevel="h1">
              {t("composed.applicationInventory")}
            </Title>
          </LevelItem>
        </Level>
        <Tabs
          className={spacing.mtSm}
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => {
            setActiveTabKey(tabIndex as number);
            history.push(Paths[tabs[tabIndex as number] as keyof typeof Paths]);
          }}
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>{t("terms.assessment")}</TabTitleText>}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>{t("terms.analysis")}</TabTitleText>}
          />
          <Tab
            eventKey={2}
            title={<TabTitleText>{t("terms.extras")}</TabTitleText>}
          />
        </Tabs>
      </PageSection>
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route
              path={Paths.applicationsAssessmentTab}
              component={ApplicationsTableAssessment}
            />
            <Route
              path={Paths.applicationsAnalysisTab}
              component={ApplicationsTableAnalyze}
            />
            <Route
              path={Paths.applicationsExtrasTab}
              component={ApplicationsTableExtras}
            />
            <Redirect
              from={Paths.applications}
              to={Paths.applicationsAssessmentTab}
              exact
            />
          </Switch>
        </Suspense>
      </PageSection>
    </>
  );
};
