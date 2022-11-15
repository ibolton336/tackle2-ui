import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableComposable, Thead, IRow, Tr, Th, Tbody, Td } from '@patternfly/react-table';

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";

import { Application, Task } from "@app/api/models";
import { ApplicationTags } from "../application-tags";
import { ApplicationAnalysisStatus } from "../../components/application-analysis-status";

export interface IApplicationListExpandedAreaProps {
  application: Application;
  tasks: Task[];
}

export const ApplicationListExpandedAreaExtras: React.FC<
  IApplicationListExpandedAreaProps
> = ({ application, tasks }) => {
  const { t } = useTranslation();

  const rows: IRow[] = [];
  tasks?.forEach((task) => {
    rows.push(
      <Tr key="Name">
        <Td dataLabel="Addon">{task.addon}</Td>
        <Td dataLabel="Status">
          <ApplicationAnalysisStatus state={task.state? task.state : "No task"} />
        </Td>
      </Tr>
    )
  })

  var tasksGroup;
  if (tasks.length > 0) {
    tasksGroup = (
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.tasks")}</DescriptionListTerm>
        <TableComposable aria-label="Simple table">
          <Thead>
            <Tr>
              <Th>Addon</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
          {rows}
          </Tbody>
        </TableComposable>
      </DescriptionListGroup>
    )
  }

  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.tags")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="tags">
          <ApplicationTags application={application} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.comments")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="comments">
          {application.comments}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {tasksGroup}
    </DescriptionList>
  );
};
