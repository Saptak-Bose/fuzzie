"use client";

import WorkflowForm from "@/components/forms/workflow-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";

type Props = {};

export default function WorkflowButton({}: Props) {
  const { setOpen, setClose } = useModal();

  const handleClick = () => {
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Workflows are powerful tools that help you autiomate tasks."
      >
        <WorkflowForm />
      </CustomModal>
    );
  };

  return (
    <Button
      className="hover:bg-[#6C47FF] hover:text-white transform duration-300 font-bold text-primary-foreground hover:font-semibold"
      size="icon"
      onClick={handleClick}
    >
      <Plus />
    </Button>
  );
}
