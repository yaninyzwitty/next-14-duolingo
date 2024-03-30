import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST (req: Request) {
    const body = await req.text();

    const signature = headers().get('Stripe-Signature') as string;

    let event : Stripe.Event;
    try {
        event = Stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
        
    } catch (error: any) {
        return new NextResponse(`Webhook errror, ${error.message}`, {
            status: 400
        });

        
    }

    const session = event.data.object as Stripe.Checkout.Session;
    // const paymentIntent = session.payment_intent as string;
    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);


        if(!session.metadata?.userId) {
            return new NextResponse('User Id is required', { status: 400 })
        }


        await db.insert(userSubscription).values({
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
        
        })
    };


    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await db.update(userSubscription).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }).where(eq(userSubscription.stripeSubscriptionId, subscription.id))

    }

    return new NextResponse(null, {
        status: 200
    })
    
}