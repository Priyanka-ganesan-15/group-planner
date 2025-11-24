"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function InviteBox({
  inviteCode,
  inviteLink,
}: {
  inviteCode: string;
  inviteLink: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1200);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="font-semibold">Invite friends</div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Invite code</label>
          <div className="flex gap-2">
            <Input value={inviteCode} readOnly />
            <Button
              variant="secondary"
              onClick={() => copy(inviteCode, "code")}
              className="gap-1"
            >
              <Copy className="h-4 w-4" />
              {copied === "code" ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Invite link</label>
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly />
            <Button
              variant="secondary"
              onClick={() => copy(inviteLink, "link")}
              className="gap-1"
            >
              <Copy className="h-4 w-4" />
              {copied === "link" ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
