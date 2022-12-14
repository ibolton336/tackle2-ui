import React from "react";
import { AxiosResponse } from "axios";

import { Modal, ModalVariant } from "@patternfly/react-core";
import { RunAddonForm } from "./run-addon-form";
import { Application, Addon, Taskgroup } from "@app/api/models";

export interface RunAddonModalProps {
  applications?: Application[];
  addons: Addon[];
  isOpen: boolean;
  onSaved: (response: AxiosResponse<Taskgroup>) => void;
  onCancel: () => void;
}

export const RunAddonModal: React.FC<RunAddonModalProps> = ({
  applications,
  addons,
  isOpen,
  onSaved,
  onCancel,
}) => {
  return (
    <Modal
      title="Run addon"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <RunAddonForm
        applications={applications}
        addons={addons}
        onSaved={onSaved}
        onCancel={onCancel}
      />
    </Modal>
  );
};
