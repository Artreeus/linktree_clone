"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, Save } from "lucide-react";

interface AddLinkFormProps {
  preset: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: React.Dispatch<React.SetStateAction<"list" | "form">>;
}

export default function AddLinkForm({
  preset,
  setOpen,
  setStep,
}: AddLinkFormProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validateUsername = (value: string) => {
    if (!value.trim()) {
      setError("Username is required");
      return false;
    }
    if (preset.usernameRegex) {
      const regex = new RegExp(preset.usernameRegex);
      if (!regex.test(value)) {
        setError("Invalid username format");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateUsername(username)) return;
    const url = `${preset.baseUrl}${username}`;
    console.log(`Username: ${username}, URL: ${url}, Name:${preset.label}`);
  };

  return (
    <div className="flex flex-col flex-1 p-5 justify-between">
      <div className="space-y-4">
        <label className="text-sm font-medium">Username</label>
        <Input
          placeholder={preset.placeholderUsername || "Enter username"}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) validateUsername(e.target.value);
          }}
          className={error ? "border-destructive" : ""}
        />
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {username.trim() && !error && (
          <div className="p-4 bg-muted rounded-lg space-y-1">
            <p className="text-sm font-medium">Preview URL</p>
            <a
              href={`${preset.baseUrl}${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1 break-all"
            >
              {preset.baseUrl}
              <span className="font-semibold">{username}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      <div className="pt-6 border-t mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setStep("list");
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button disabled={!username.trim() || !!error} onClick={handleSave}>
          <Save className="w-4 h-4 mr-1" />
          Save Link
        </Button>
      </div>
    </div>
  );
}
