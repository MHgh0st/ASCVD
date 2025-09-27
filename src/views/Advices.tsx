"use client";
import { Accordion, AccordionItem } from "@heroui/react";

export default function Advices() {
  return (
    <div className="flex flex-col gap-y-4">
      <Accordion
        variant="splitted"
        fullWidth
        itemClasses={{
          base: "shadow-none",
        }}
      >
        <AccordionItem title="چگونه سبک زندگی سالم داشته باشیم">
          سلام
        </AccordionItem>
        <AccordionItem title="چگونه سبک زندگی سالم داشته باشیم">
          سلام
        </AccordionItem>
      </Accordion>
    </div>
  );
}
