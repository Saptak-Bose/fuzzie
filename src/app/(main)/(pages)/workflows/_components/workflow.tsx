import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  description: string;
  id: string;
  publish: boolean | null;
};

export default function Workflow({ description, id, name, publish }: Props) {
  // WIP: Wire up db

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <Link href={`/workflows/editor/${id}`}>
          <div className="flex flex-row gap-2">
            <Image
              className="object-contain"
              src="/googleDrive.png"
              height={30}
              width={30}
              alt="google-drive"
            />
            <Image
              className="object-contain"
              src="/notion.png"
              height={30}
              width={30}
              alt="notion"
            />
            <Image
              className="object-contain"
              src="/discord.png"
              height={30}
              width={30}
              alt="discord"
            />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        <Label htmlFor="publishing" className="text-muted-foreground">
          On
        </Label>
        <Switch
          id="publishing"
          //   onClick={onPublishFlow}
          //   defaultChecked={publish!}
        />
      </div>
    </Card>
  );
}
