import { NotificationsContext } from "@app/shared/notifications-context";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const Jira: React.FC = () => {
  const { t } = useTranslation();
  const { pushNotification } = React.useContext(NotificationsContext);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>ping</PageSection>
    </>
  );
};
