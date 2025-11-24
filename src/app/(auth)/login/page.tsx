import Link from "next/link";
import { signIn } from "../actions";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const next = searchParams?.next ?? "/";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {searchParams?.error && (
            <p className="text-sm text-red-600">{searchParams.error}</p>
          )}

          <form action={signIn} className="space-y-3">
            <input type="hidden" name="next" value={next} />
            <Input name="email" placeholder="Email" type="email" required />
            <Input name="password" placeholder="Password" type="password" required />
            <Button className="w-full" type="submit">Continue</Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="ml-1 underline text-foreground">
            Create account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
