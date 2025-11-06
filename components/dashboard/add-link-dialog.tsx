"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import AddLinkListView from "./AddLinkListView";
import AddLinkForm from "./addLinkForm";
import { PRESETS } from "@/lib/preset";

interface AddLinkDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddLinkDialog({ open, setOpen }: AddLinkDialogProps) {
  const [step, setStep] = useState<"list" | "form">("list");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const selected = PRESETS.find((p) => p.key === selectedPreset);

  const handleBack = () => {
    setStep("list");
    setSelectedPreset(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 rounded-2xl bg-background max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          {step === "form" ? (
            <>
              <button
                onClick={handleBack}
                className="flex items-center justify-center cursor-pointer gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <DialogTitle className="text-lg font-semibold mr-5 transform -translate-y-0.5">
                {selected?.label || "Add Link"}
              </DialogTitle>
            </>
          ) : (
            <>
              <DialogTitle className="text-lg font-semibold">
                Add Link
              </DialogTitle>
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative overflow-hidden" style={{ height: "500px" }}>
          {/* List View */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
              step === "list" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <AddLinkListView
              onSelect={(key) => {
                setSelectedPreset(key);
                setStep("form");
              }}
            />
          </div>
          {/* Form View */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
              step === "form" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selected && (
              <AddLinkForm
                preset={selected}
                setOpen={setOpen}
                setStep={setStep}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
