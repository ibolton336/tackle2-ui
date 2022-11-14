import React from "react";
import { AxiosResponse } from "axios";

import { Modal, ModalVariant } from "@patternfly/react-core";
import { RunAddonForm, Task } from "./run-addon-form";
import { Addon } from "@app/api/models";
// import { validateXML } from "../identity-form/validateXML";

export interface RunAddonModalProps {
  addons: Addon[],
  isOpen: boolean;
  onSaved: (response: AxiosResponse<Task>) => void;
  onCancel: () => void;
}

export const RunAddonModal: React.FC<RunAddonModalProps> = ({
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
        addons={addons}
        onSaved={onSaved}
        onCancel={onCancel}
      />
    </Modal>
  );
};
