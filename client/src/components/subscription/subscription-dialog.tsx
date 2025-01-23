import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret);

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      toast({
        title: "Success!",
        description: "Your premium subscription is now active.",
      });

      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Get unlimited access to all premium content and features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Premium Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Access to all premium lessons</li>
              <li>Advanced AI recommendations</li>
              <li>Exclusive historical content</li>
              <li>Ad-free experience</li>
            </ul>
          </div>

          <Button 
            onClick={handleSubscribe} 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Subscribe Now"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}