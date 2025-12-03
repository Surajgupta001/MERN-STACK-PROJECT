import { Webhook } from "svix";
import User from "../models/user.models.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.models.js";
import Course from "../models/course.models.js";

// API Controller function to manage Clerk User with database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        // Handle user created event
        const userData = {
          _id: data.id,
          name: data.first_name + " " + data.last_name,
          email: data.email_addresses[0].email_address,
          imageUrl: data._image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        // Handle user updated event
        const userData = {
          name: data.first_name + " " + data.last_name,
          email: data.email_addresses[0].email_address,
          imageUrl: data._image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        // Handle user deleted event
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Error handling Clerk webhook:", error);
    res.status(400).json({
      message: error.message,
    });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  let event;

  try {
    const sig = request.headers["stripe-signature"];
    // request.body is a raw Buffer because server.js uses express.raw({ type: 'application/json' })
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      try {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session?.data?.length) {
          console.warn(
            "[Stripe] No checkout session found for PI:",
            paymentIntentId
          );
          break;
        }

        const metadata = session.data[0].metadata || {};
        const purchaseId = metadata.purchaseId;

        if (!purchaseId) {
          console.warn(
            "[Stripe] Missing purchaseId in session metadata for PI:",
            paymentIntentId
          );
          break;
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.warn("[Stripe] Purchase not found:", purchaseId);
          break;
        }

        if (purchaseData.status === "completed") {
          console.log(
            "[Stripe] Purchase already completed, skipping:",
            purchaseId
          );
          break;
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(
          purchaseData.courseId.toString()
        );

        if (!userData || !courseData) {
          console.warn("[Stripe] Missing user or course", {
            userId: purchaseData.userId,
            courseId: purchaseData.courseId?.toString?.(),
          });
          break;
        }

        // Ensure arrays exist
        if (!Array.isArray(courseData.enrolledStudents))
          courseData.enrolledStudents = [];
        if (!Array.isArray(userData.enrolledCourses))
          userData.enrolledCourses = [];

        // Add student to course.enrolledStudents (string id array)
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        // Add course to user.enrolledCourses (ObjectId array)
        const courseIdStr = courseData._id.toString();
        const hasCourse = userData.enrolledCourses.some(
          (id) => id.toString() === courseIdStr
        );
        if (!hasCourse) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("[Stripe] Purchase completed:", {
          purchaseId,
          userId: userData._id,
          courseId: courseIdStr,
        });
      } catch (err) {
        console.error("[Stripe] Error handling payment_intent.succeeded:", err);
      }

      break;
    }
    case "payment_intent.payment_failed": {
      try {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session?.data?.length) {
          console.warn(
            "[Stripe] No checkout session found for failed PI:",
            paymentIntentId
          );
          break;
        }

        const metadata = session.data[0].metadata || {};
        const purchaseId = metadata.purchaseId;
        if (!purchaseId) {
          console.warn(
            "[Stripe] Missing purchaseId in failed session metadata for PI:",
            paymentIntentId
          );
          break;
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.warn("[Stripe] Purchase not found on failure:", purchaseId);
          break;
        }

        purchaseData.status = "failed";
        await purchaseData.save();

        console.log("[Stripe] Purchase marked failed:", purchaseId);
      } catch (err) {
        console.error(
          "[Stripe] Error handling payment_intent.payment_failed:",
          err
        );
      }

      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({
    received: true,
  });
};
