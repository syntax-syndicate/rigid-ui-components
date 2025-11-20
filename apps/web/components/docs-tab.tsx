"use client";

import { useState, Children, ReactElement, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type TabData = {
  title: string;
  value: string;
  content?: ReactNode;
};

interface TabProps {
  value: string;
  children: ReactNode;
}

export const Tab = ({ children }: TabProps) => {
  return <>{children}</>;
};

interface TabsProps {
  items: string[];
  children: ReactNode;
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}

export const Tabs = ({
  items,
  children,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: TabsProps) => {
  const tabs: TabData[] = [];
  Children.forEach(children, (child, index) => {
    if (child && (child as ReactElement)?.props) {
      const tabElement = child as ReactElement<TabProps>;
      const value = tabElement.props.value;
      const title = items[index] || value;
      tabs.push({
        title,
        value,
        content: tabElement.props.children,
      });
    }
  });

  const [active, setActive] = useState<TabData>(tabs[0] || { title: '', value: '', content: null });

  const handleTabClick = (tab: TabData) => {
    setActive(tab);
  };

  if (!tabs.length) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-start relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => {
              handleTabClick(tab);
            }}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
          >
            {active?.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      {active && (
        <FadeInDiv
          active={active}
          key={active.value}
          className={cn("mt-3", contentClassName)}
        />
      )}
    </>
  );
};

export const FadeInDiv = ({
  className,
  active,
}: {
  className?: string;
  key?: string;
  active: TabData;
}) => {
  return (
    <div className="relative">
      <motion.div
        key={active.value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn("w-full h-full", className)}
      >
        {active.content}
      </motion.div>
    </div>
  );
};
