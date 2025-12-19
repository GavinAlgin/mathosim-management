"use client";

import { motion, Transition, AnimatePresence } from "framer-motion";
import { useMemo, useCallback } from "react";
import { addDays, format, getYear, isSameDay, isSameMonth, isSunday, startOfDay, startOfWeek } from "date-fns";
import { cva } from "class-variance-authority";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useCalendar } from "@/components/calendar-context";
import { AddEditEventDialog } from "@/components/add-edit-event-dialog";
import { DroppableArea } from "@/components/droppable-area";
import { EventListDialog } from "@/components/events-list-dialog";
import { MonthEventBadge } from "@/components/month-event-badge";
import { WeekViewMultiDayEventsRow } from "@/components/week-view-multi-day-events-row";
import { CalendarTimeline } from "@/components/calendar-time-line";
import { RenderGroupedEvents } from "@/components/render-grouped-events";

import {
  calculateMonthEventPositions,
  getCalendarCells,
  getEventsCount,
  groupEvents,
  navigateDate,
  rangeText,
} from "@/components/helpers";

import type { IEvent, ICalendarCell } from "@/components/interfaces";
import type { TCalendarView, TEventColor } from "@/components/types";

//
// ---------------------------
// Framer Motion transitions
// ---------------------------
export const transition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const slideFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export const slideFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};

//
// ---------------------------
// EventBullet
// ---------------------------
const eventBulletVariants = cva("size-2 rounded-full", {
  variants: {
    color: {
      blue: "bg-blue-600 dark:bg-blue-500",
      green: "bg-green-600 dark:bg-green-500",
      red: "bg-red-600 dark:bg-red-500",
      yellow: "bg-yellow-600 dark:bg-yellow-500",
      purple: "bg-purple-600 dark:bg-purple-500",
      orange: "bg-orange-600 dark:bg-orange-500",
      gray: "bg-gray-600 dark:bg-gray-500",
    },
  },
  defaultVariants: { color: "blue" },
});

export function EventBullet({ color }: { color: TEventColor }) {
  return (
    <motion.div
      className={cn(eventBulletVariants({ color }))}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      transition={transition}
    />
  );
}

//
// ---------------------------
// DateNavigator
// ---------------------------
export function DateNavigator({ view, events }: { view: TCalendarView; events: IEvent[] }) {
  const { selectedDate, setSelectedDate } = useCalendar();
  const month = format(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(() => getEventsCount(events, selectedDate, view), [events, selectedDate, view]);

  const handlePrevious = () => setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () => setSelectedDate(navigateDate(selectedDate, view, "next"));

  const MotionButton = motion(Button);
  const MotionBadge = motion(Badge);

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <motion.span className="text-lg font-semibold" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={transition}>
          {month} {year}
        </motion.span>
        <AnimatePresence mode="wait">
          <MotionBadge
            key={eventCount}
            variant="secondary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={transition}
          >
            {eventCount} events
          </MotionBadge>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <MotionButton variant="outline" size="icon" className="h-6 w-6" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </MotionButton>
        <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}>
          {rangeText(view, selectedDate)}
        </motion.p>
        <MotionButton variant="outline" size="icon" className="h-6 w-6" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </MotionButton>
      </div>
    </div>
  );
}

//
// ---------------------------
// DayCell
// ---------------------------
export function DayCell({ cell, events, eventPositions }: { cell: ICalendarCell; events: IEvent[]; eventPositions: Record<string, number> }) {
  const { day, currentMonth, date } = cell;
  const cellEvents = useMemo(() => events.filter((e) => isSameDay(new Date(e.startDate), date)), [events, date]);

  return (
    <motion.div className="flex flex-col border-l border-t p-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
      <DroppableArea date={date}>
        <span className={cn("text-xs font-semibold", !currentMonth && "opacity-50")}>{day}</span>
        <div className="flex gap-1 mt-1 flex-col">
          {cellEvents.slice(0, 3).map((e, idx) => (
            <EventBullet key={e.id} color={e.color as TEventColor} />
          ))}
        </div>
      </DroppableArea>
    </motion.div>
  );
}

//
// ---------------------------
// CalendarMonthView
// ---------------------------
export function CalendarMonthView({ singleDayEvents, multiDayEvents }: { singleDayEvents: IEvent[]; multiDayEvents: IEvent[] }) {
  const { selectedDate } = useCalendar();
  const allEvents = [...multiDayEvents, ...singleDayEvents];
  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);
  const eventPositions = useMemo(() => calculateMonthEventPositions(multiDayEvents, singleDayEvents, selectedDate), [multiDayEvents, singleDayEvents, selectedDate]);
  const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <motion.div initial="initial" animate="animate" variants={staggerContainer}>
      <div className="grid grid-cols-7">
        {WEEK_DAYS.map((day, index) => (
          <motion.div key={day} className="flex items-center justify-center py-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, ...transition }}>
            <span className="text-xs font-medium text-t-quaternary">{day}</span>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-7 overflow-hidden">
        {cells.map((cell, index) => (
          <DayCell key={index} cell={cell} events={allEvents} eventPositions={eventPositions} />
        ))}
      </div>
    </motion.div>
  );
}

//
// ---------------------------
// CalendarHeader
// ---------------------------
export function CalendarHeader() {
  const { view, events } = useCalendar();
  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <motion.div className="flex items-center gap-3" variants={slideFromLeft} initial="initial" animate="animate" transition={transition}>
        <DateNavigator view={view} events={events} />
      </motion.div>
    </div>
  );
}


// import { cva } from "class-variance-authority";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { transition } from "@/components/animations";
// import type { TEventColor } from "@/components/types";

// const eventBulletVariants = cva("size-2 rounded-full", {
// 	variants: {
// 		color: {
// 			blue: "bg-blue-600 dark:bg-blue-500",
// 			green: "bg-green-600 dark:bg-green-500",
// 			red: "bg-red-600 dark:bg-red-500",
// 			yellow: "bg-yellow-600 dark:bg-yellow-500",
// 			purple: "bg-purple-600 dark:bg-purple-500",
// 			orange: "bg-orange-600 dark:bg-orange-500",
// 			gray: "bg-gray-600 dark:bg-gray-500",
// 		},
// 	},
// 	defaultVariants: {
// 		color: "blue",
// 	},
// });

// export function EventBullet({
// 	color,
// 	className,
// }: {
// 	color: TEventColor;
// 	className?: string;
// }) {
// 	return (
// 		<motion.div
// 			className={cn(eventBulletVariants({ color, className }))}
// 			initial={{ scale: 0, opacity: 0 }}
// 			animate={{ scale: 1, opacity: 1 }}
// 			whileHover={{ scale: 1.2 }}
// 			transition={transition}
// 		/>
// 	);
// }
