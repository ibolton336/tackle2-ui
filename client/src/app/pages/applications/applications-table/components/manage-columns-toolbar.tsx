import {
  Button,
  OverflowMenu,
  OverflowMenuGroup,
  OverflowMenuItem,
  ToolbarItem,
} from "@patternfly/react-core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnState } from "@app/hooks/table-controls/column/useColumnState";
import { ManageColumnsModal } from "./manage-columns-modal";

// Define props to accept columns and setColumns directly
interface ManageColumnsToolbarProps<TColumnKey extends string> {
  columns: ColumnState<TColumnKey>[];
  setColumns: (newColumns: ColumnState<TColumnKey>[]) => void;
}

export const ManageColumnsToolbar = <TColumnKey extends string>({
  columns,
  setColumns,
}: ManageColumnsToolbarProps<TColumnKey>) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ToolbarItem variant="overflow-menu">
        <OverflowMenu breakpoint="md">
          <OverflowMenuGroup groupType="button" isPersistent>
            <OverflowMenuItem isPersistent>
              <Button variant="link" onClick={() => setIsOpen(true)}>
                Manage columns
              </Button>
            </OverflowMenuItem>
          </OverflowMenuGroup>
        </OverflowMenu>
      </ToolbarItem>

      <ManageColumnsModal
        showModal={isOpen}
        onClose={() => setIsOpen(false)}
        description={t("Selected columns will be displayed in the table.")}
        setColumns={setColumns}
        columns={columns}
        saveLabel={t("Save")}
        cancelLabel={t("Cancel")}
        title={t("Manage Columns")}
      />
    </>
  );
};
