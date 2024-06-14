"use client";

import * as z from "zod";
import { WorkflowFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { onCreateWorkflow } from "@/app/(main)/(pages)/workflows/_actions/workflow-connections";
import { useModal } from "@/providers/modal-provider";

type Props = {
  title?: string;
  subTitle?: string;
};

export default function WorkflowForm({ subTitle, title }: Props) {
  const { setClose } = useModal();

  const form = useForm<z.infer<typeof WorkflowFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(WorkflowFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const isLoading = form.formState.isLoading;
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof WorkflowFormSchema>) => {
    const workflow = await onCreateWorkflow(values.name, values.description);

    if (workflow) {
      toast.message(workflow.message);
      router.refresh();
    }

    setClose();
  };

  return (
    <Card className="w-full max-w-[650px] border-none">
      {title && subTitle ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subTitle}</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 text-left"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the name..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the description..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={cn(
                "mt-4 text-neutral-950 font-bold hover:font-semibold hover:bg-[#6C47FF] hover:text-white duration-300 transform",
                isLoading ? "bg-[#6C47FF] text-white font-semibold" : ""
              )}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}