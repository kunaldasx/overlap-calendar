"use client";

import {
  CalendarDotsIcon,
  CaretRightIcon,
  SignInIcon,
  SparkleIcon,
  UserPlusIcon,
} from "@phosphor-icons/react";
import * as Form from "@radix-ui/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseError } from "@/lib/utils";

export function WelcomeScreen() {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleCreateCalendar = async () => {
    try {
      const response = await fetch("/api/calendar/create", { method: "POST" });

      if (!response.ok) {
        const errorMessage = (await response.json()).error;
        console.error(`Failed to create calendar: ${errorMessage}`);
        setServerError(`Failed to create calendar: ${errorMessage}`);
        setIsCreating(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem(`calendar-${data.id}`, data.pin);
      router.push(`/calendar/${data.id}`);
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(`Failed to create calendar: ${errorMessage}`);
      setServerError(`Failed to create calendar: ${errorMessage}`);
      setIsCreating(false);
    }
  };

  const handleJoinCalendar = async (id: string, pin: string) => {
    try {
      const response = await fetch("/api/calendar/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pin }),
      });

      if (!response.ok) {
        const errorMessage = (await response.json()).error;
        console.error(`Failed to join calendar: ${errorMessage}`);
        setServerError(`Failed to join calendar: ${errorMessage}`);
        setIsJoining(false);
        return;
      }

      localStorage.setItem(`calendar-${id}`, pin);
      router.push(`/calendar/${id}`);
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(`Failed to join calendar: ${errorMessage}`);
      setServerError(`Failed to join calendar: ${errorMessage}`);
      setIsJoining(false);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setServerError("");
    try {
      await handleCreateCalendar();
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(`Failed to create calendar: ${errorMessage}`);
      setServerError(`Failed to create calendar: ${errorMessage}`);
      setIsCreating(false);
    }
  };

  const handleJoinSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    setIsJoining(true);
    setServerError("");

    try {
      await handleJoinCalendar(
        data["calendar-id"] as string,
        data.pin as string
      );
    } catch (error) {
      const errorMessage = parseError(error);
      console.error(`Failed to join calendar: ${errorMessage}`);
      setServerError(`Failed to join calendar: ${errorMessage}`);
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <div className="app-shell">
        <main className="mt-8 grid gap-6">
          <section className="soft-card rounded-[30px] p-5 sm:p-7 lg:p-8 dark:bg-[rgba(15,23,36,0.72)] flex flex-col items-center justify-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(129,119,196,0.2)] bg-[rgba(217,209,255,0.45)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-primary-foreground">
              <SparkleIcon className="size-3.5" />
              Shared availability
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[0.98]">
              Plan together without the scheduling headache.
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Find the time when everyone is free, share calendars instantly,
              and make decisions without the usual back-and-forth.
            </p>
          

            <div className="w-full mt-7 flex flex-col gap-3 sm:flex-row justify-center">
              <Button className="w-full sm:w-auto" onClick={handleCreate} size="lg">
                {isCreating ? (
                  <Spinner size="sm" variant="secondary" />
                ) : (
                  <SparkleIcon className="size-5" />
                )}
                Create New Calendar
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" size="lg">
                <UserPlusIcon className="size-5" />
                Join a Calendar
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-[rgba(255,255,255,0.5)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(92,104,140,0.08)] dark:bg-[rgba(17,24,39,0.82)] dark:hover:shadow-[0_18px_28px_rgba(2,6,23,0.42)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(217,209,255,0.55)] text-primary-foreground">
                    <CalendarDotsIcon className="size-5" />
                  </div>
                  <span className="rounded-full bg-[rgba(223,243,223,0.8)] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
                    Fresh start
                  </span>
                </div>
                <h2 className="mt-4 font-semibold text-xl text-foreground">
                  Start Fresh
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create a new shared calendar and invite everyone in seconds.
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 font-medium text-sm text-foreground"
                  onClick={handleCreate}
                  type="button"
                >
                  Create calendar
                  <CaretRightIcon className="size-4" />
                </button>
              </div>

              <div className="rounded-3xl border border-border bg-[rgba(255,255,255,0.5)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(92,104,140,0.08)] dark:bg-[rgba(17,24,39,0.82)] dark:hover:shadow-[0_18px_28px_rgba(2,6,23,0.42)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(207,229,255,0.7)] text-primary-foreground">
                    <UserPlusIcon className="size-5" />
                  </div>
                  <span className="rounded-full bg-[rgba(247,217,231,0.7)] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
                    Join
                  </span>
                </div>
                <h2 className="mt-4 font-semibold text-xl text-foreground">
                  Join Friends
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Enter the calendar link or access code to join an existing plan.
                </p>

                <Form.Root
                  className="mt-4 space-y-3"
                  onClearServerErrors={() => setServerError("")}
                  onSubmit={handleJoinSubmit}
                >
                  <Form.Field name="calendar-id">
                    <Form.Control asChild>
                      <Input
                        className="h-11 rounded-2xl border border-border bg-white/80 text-sm dark:border-[rgba(176,192,224,0.18)] dark:bg-[rgba(11,16,27,0.9)] dark:text-foreground"
                        disabled={isCreating || isJoining}
                        placeholder="Calendar ID"
                        required
                        type="text"
                      />
                    </Form.Control>
                  </Form.Field>

                  <Form.Field name="pin">
                    <Form.Control asChild>
                      <Input
                        className="h-11 rounded-2xl border border-border bg-white/80 font-mono tracking-[0.3em] text-sm dark:border-[rgba(176,192,224,0.18)] dark:bg-[rgba(11,16,27,0.9)] dark:text-foreground"
                        disabled={isCreating || isJoining}
                        inputMode="numeric"
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            e.target.value = value;
                          }
                        }}
                        pattern="[0-9]{6}"
                        placeholder="000000"
                        required
                        type="text"
                      />
                    </Form.Control>
                  </Form.Field>

                  {serverError ? (
                    <p className="rounded-xl border border-[rgba(171,101,92,0.2)] bg-[rgba(240,192,184,0.18)] px-3 py-2 text-xs text-[rgb(125,80,71)]">
                      {serverError}
                    </p>
                  ) : null}

                  <Button
                    className="w-full"
                    disabled={isCreating || isJoining}
                    type="submit"
                    variant="secondary"
                  >
                    {isJoining ? (
                      <Spinner size="sm" variant="secondary" />
                    ) : (
                      <SignInIcon className="size-4" />
                    )}
                    Join Calendar
                  </Button>
                </Form.Root>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
