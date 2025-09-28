"use client";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Advice } from "@/types/AdviceTypes";

interface AdvicesProps {
  onBack?: () => void;
  advices: Advice[];
}

export default function Advices(props: AdvicesProps = { advices: [] }) {
  return (
    <div className="flex flex-col gap-y-4">
      {props.onBack && (
        <Button
          color="primary"
          variant="flat"
          startContent={
            <Icon icon="solar:arrow-right-bold-duotone" className="text-xl" />
          }
          onPress={props.onBack}
          className="w-fit"
        >
          بازگشت به نتایج
        </Button>
      )}
      <Accordion
        variant="splitted"
        fullWidth
        itemClasses={{
          base: "shadow-none",
        }}
      >
        {props.advices?.map((advice) => (
          <AccordionItem key={advice.id} title={advice.title}>
            {advice.details}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
