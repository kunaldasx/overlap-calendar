"use client";

import {
  CheckIcon,
  PencilSimpleIcon,
  ShareIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { HelpPopup } from "@/components/help-popup";
import { SettingsDialog } from "@/components/settings-dialog";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCalendarStore } from "@/lib/calendar-store";
import { parseError } from "@/lib/utils";

interface FloatingControlsProps {
  onShareClick: () => void;
  onNameChange: (name: string) => Promise<void>;
}

export function FloatingControls({
  onShareClick,
  onNameChange,
}: FloatingControlsProps) {
  const { calendarName, isDrawMode, setDrawMode } = useCalendarStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(calendarName);
  const [isSavingName, setIsSavingName] = useState(false);

  const handleNameSubmit = async () => {
    if (tempName.trim() && tempName !== calendarName && !isSavingName) {
      setIsSavingName(true);
      try {
        await onNameChange(tempName.trim());
        setIsEditingName(false);
      } catch (error) {
        const errorMessage = parseError(error);
        console.error(`Failed to change calendar name: ${errorMessage}`);
        setTempName(calendarName);
      } finally {
        setIsSavingName(false);
      }
    } else {
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    if (!isSavingName) {
      setTempName(calendarName);
      setIsEditingName(false);
    }
  };

  const handleNameClick = () => {
    setTempName(calendarName);
    setIsEditingName(true);
  };

  return (
    <TooltipProvider>
      <Card className="soft-card border-transparent bg-[rgba(255,255,255,0.72)] p-2 shadow-(--shadow-soft) backdrop-blur-xl dark:border-[rgba(176,192,224,0.18)] dark:bg-[rgba(15,23,36,0.74)] sm:p-3">
        <div className="flex flex-col gap-3 px-2 py-1 sm:px-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            {isMobile ? (
              <Button onClick={handleNameClick} variant="ghost" className="h-auto justify-start gap-2 px-2 py-2 hover:bg-transparent">
                <span className="max-w-[18rem] truncate text-left font-semibold text-lg text-foreground">
                  {calendarName}
                </span>
                <PencilSimpleIcon className="size-4 text-muted-foreground" />
              </Button>
            ) : isEditingName ? (
              <div className="flex max-w-md items-center gap-2">
                <Input
                  autoFocus
                  className="h-10 rounded-xl border border-border bg-white/80 shadow-sm dark:border-[rgba(176,192,224,0.18)] dark:bg-[rgba(11,16,27,0.9)] dark:text-foreground"
                  disabled={isSavingName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSavingName) {
                      handleNameSubmit();
                    }
                    if (e.key === "Escape" && !isSavingName) {
                      handleNameCancel();
                    }
                  }}
                  value={tempName}
                />
                <div className="flex items-center gap-1">
                  <Button className="h-9 w-9 p-0" disabled={isSavingName} onClick={handleNameSubmit} size="icon" variant="secondary">
                    {isSavingName ? <Spinner size="sm" /> : <CheckIcon className="size-4" />}
                  </Button>
                  <Button className="h-9 w-9 p-0" disabled={isSavingName} onClick={handleNameCancel} size="icon" variant="ghost">
                    <XIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleNameClick} variant="ghost" className="h-auto justify-start gap-2 px-2 py-2 hover:bg-transparent">
                <span className="max-w-[20rem] truncate text-left font-semibold text-lg text-foreground sm:max-w-md lg:max-w-lg">
                  {calendarName}
                </span>
                <PencilSimpleIcon className="size-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-wrap items-center gap-2" id="tour-step-1">
              <span className="hidden text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:inline-block">
                {isDrawMode
                  ? `${isMobile ? "Tap, hold," : "Click"} & drag to mark available`
                  : `${isMobile ? "Tap" : "Click"} events to delete`}
              </span>

              <ToggleGroup
                className="justify-center"
                onValueChange={(value) => {
                  if (value) {
                    setDrawMode(value === "draw");
                  }
                }}
                type="single"
                value={isDrawMode ? "draw" : "delete"}
                variant="outline"
              >
                <ToggleGroupItem aria-label="Mark available" value="draw">
                  <CheckIcon className="size-4" />
                  Mark Available
                </ToggleGroupItem>
                <ToggleGroupItem aria-label="Delete available" value="delete">
                  <XIcon className="size-4" />
                  Delete Available
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button onClick={onShareClick} variant="secondary" className="gap-2" id="tour-step-4">
                <ShareIcon className="size-4" />
                Share
              </Button>
              <SettingsDialog />
              <HelpPopup />
            </div>
          </div>
        </div>
      </Card>

      {isMobile && (
        <Drawer onOpenChange={setIsEditingName} open={isEditingName}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Calendar Name</DrawerTitle>
              <DrawerDescription>
                Give your calendar a memorable name that everyone can recognize.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <Input
                autoFocus
                className="data-invalid:border-destructive"
                disabled={isSavingName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSavingName) {
                    handleNameSubmit();
                  }
                }}
                placeholder="Calendar name"
                value={tempName}
              />
            </div>
            <DrawerFooter>
              <Button
                disabled={
                  isSavingName || !tempName.trim() || tempName === calendarName
                }
                onClick={handleNameSubmit}
              >
                {isSavingName ? (
                  <Spinner size="sm" />
                ) : (
                  <PencilSimpleIcon className="size-5" />
                )}
                Save Name
              </Button>
              <DrawerClose asChild>
                <Button
                  disabled={isSavingName}
                  onClick={handleNameCancel}
                  variant="outline"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </TooltipProvider>
  );
}
