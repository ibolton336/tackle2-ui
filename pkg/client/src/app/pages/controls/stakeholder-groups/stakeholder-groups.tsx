import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { useSelectionState } from "@konveyor/lib-ui";

import {
  Button,
  ButtonVariant,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ToolbarChip,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  expandable,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
  TableText,
} from "@patternfly/react-table";

import { useDispatch } from "react-redux";
import { alertActions } from "@app/store/alert";
import { confirmDialogActions } from "@app/store/confirmDialog";

import {
  AppPlaceholder,
  AppTableActionButtons,
  AppTableWithControls,
  ConditionalRender,
  SearchFilter,
  AppTableToolbarToggleGroup,
  NoDataEmptyState,
} from "@app/shared/components";
import {
  useTableControls,
  useFetchStakeholderGroups,
  useDelete,
} from "@app/shared/hooks";

import { getAxiosErrorMessage } from "@app/utils/utils";
import {
  deleteStakeholderGroup,
  StakeholderGroupSortBy,
  StakeholderGroupSortByQuery,
} from "@app/api/rest";
import { StakeholderGroup } from "@app/api/models";

import { NewStakeholderGroupModal } from "./components/new-stakeholder-group-modal";
import { UpdateStakeholderGroupModal } from "./components/update-stakeholder-group-modal";

const ENTITY_FIELD = "entity";

const getRow = (rowData: IRowData): StakeholderGroup => {
  return rowData[ENTITY_FIELD];
};

export const StakeholderGroups: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState<StakeholderGroup>();

  const { requestDelete: requestDeleteStakeholderGroup } =
    useDelete<StakeholderGroup>({
      onDelete: (t: StakeholderGroup) => deleteStakeholderGroup(t.id!),
    });

  const { stakeholderGroups, isFetching, fetchError, fetchStakeholderGroups } =
    useFetchStakeholderGroups(true);

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls({
    sortByQuery: { direction: "asc", index: 1 },
  });

  const {
    isItemSelected: isItemExpanded,
    toggleItemSelected: toggleItemExpanded,
  } = useSelectionState<StakeholderGroup>({
    items: stakeholderGroups || [],
    isEqual: (a, b) => a.id === b.id,
  });

  useEffect(() => {
    fetchStakeholderGroups();
  }, [fetchStakeholderGroups]);

  const columns: ICell[] = [
    {
      title: t("terms.name"),
      transforms: [sortable, cellWidth(30)],
      cellFormatters: [expandable],
    },
    { title: t("terms.description"), transforms: [cellWidth(35)] },
    {
      title: t("terms.memberCount"),
      transforms: [sortable],
    },
    {
      title: "",
      props: {
        className: "pf-u-text-align-right",
      },
    },
  ];

  const rows: IRow[] = [];
  stakeholderGroups?.forEach((item) => {
    const isExpanded = isItemExpanded(item);
    rows.push({
      [ENTITY_FIELD]: item,
      isOpen: isExpanded,
      cells: [
        {
          title: <TableText wrapModifier="truncate">{item.name}</TableText>,
        },
        {
          title: (
            <TableText wrapModifier="truncate">{item.description}</TableText>
          ),
        },
        {
          title: item.stakeholders ? item.stakeholders.length : 0,
        },
        {
          title: (
            <AppTableActionButtons
              onEdit={() => editRow(item)}
              onDelete={() => deleteRow(item)}
            />
          ),
        },
      ],
    });

    if (isExpanded) {
      rows.push({
        parent: rows.length - 1,
        fullWidth: false,
        cells: [
          <div className="pf-c-table__expandable-row-content">
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  {t("terms.member(s)")}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {item.stakeholders?.map((f) => f.name).join(", ")}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </div>,
        ],
      });
    }
  });

  // Rows

  const collapseRow = (
    event: React.MouseEvent,
    rowIndex: number,
    isOpen: boolean,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    const row = getRow(rowData);
    toggleItemExpanded(row);
  };

  const editRow = (row: StakeholderGroup) => {
    setRowToUpdate(row);
  };

  const deleteRow = (row: StakeholderGroup) => {
    dispatch(
      confirmDialogActions.openDialog({
        // t("terms.stakeholderGroup")
        title: t("dialog.title.delete", {
          what: t("terms.stakeholderGroup").toLowerCase(),
        }),
        titleIconVariant: "warning",
        message: t("dialog.message.delete"),
        confirmBtnVariant: ButtonVariant.danger,
        confirmBtnLabel: t("actions.delete"),
        cancelBtnLabel: t("actions.cancel"),
        onConfirm: () => {
          dispatch(confirmDialogActions.processing());
          requestDeleteStakeholderGroup(
            row,
            () => {
              dispatch(confirmDialogActions.closeDialog());
              if (stakeholderGroups?.length === 1) {
                handlePaginationChange({ page: paginationQuery.page - 1 });
              } else {
                fetchStakeholderGroups();
              }
            },
            (error) => {
              dispatch(confirmDialogActions.closeDialog());
              dispatch(alertActions.addDanger(getAxiosErrorMessage(error)));
            }
          );
        },
      })
    );
  };

  // Create Modal

  const handleOnOpenCreateNewModal = () => {
    setIsNewModalOpen(true);
  };

  const handleOnCreatedNew = (response: AxiosResponse<StakeholderGroup>) => {
    setIsNewModalOpen(false);
    fetchStakeholderGroups();

    dispatch(
      alertActions.addSuccess(
        t("toastr.success.added", {
          what: response.data.name,
          type: "stakeholder group",
        })
      )
    );
  };

  const handleOnCreateNewCancel = () => {
    setIsNewModalOpen(false);
  };

  // Update Modal

  const handleOnUpdated = () => {
    setRowToUpdate(undefined);
    fetchStakeholderGroups();
  };

  const handleOnUpdatedCancel = () => {
    setRowToUpdate(undefined);
  };

  return (
    <>
      <ConditionalRender
        when={isFetching && !(stakeholderGroups || fetchError)}
        then={<AppPlaceholder />}
      >
        <AppTableWithControls
          onCollapse={collapseRow}
          cells={columns}
          rows={rows}
          // actions={actions}
          isLoading={isFetching}
          loadingVariant="skeleton"
          fetchError={fetchError}
          toolbarActions={
            <ToolbarGroup variant="button-group">
              <ToolbarItem>
                <Button
                  type="button"
                  aria-label="create-stakeholder-group"
                  variant={ButtonVariant.primary}
                  onClick={handleOnOpenCreateNewModal}
                >
                  {t("actions.createNew")}
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          }
          noDataState={
            <NoDataEmptyState
              // t('terms.stakeholderGroups')
              title={t("composed.noDataStateTitle", {
                what: t("terms.stakeholderGroups").toLowerCase(),
              })}
              // t('terms.stakeholderGroup')
              description={
                t("composed.noDataStateBody", {
                  what: t("terms.stakeholderGroup").toLowerCase(),
                }) + "."
              }
            />
          }
        />
      </ConditionalRender>

      <NewStakeholderGroupModal
        isOpen={isNewModalOpen}
        onSaved={handleOnCreatedNew}
        onCancel={handleOnCreateNewCancel}
      />
      <UpdateStakeholderGroupModal
        stakeholderGroup={rowToUpdate}
        onSaved={handleOnUpdated}
        onCancel={handleOnUpdatedCancel}
      />
    </>
  );
};
