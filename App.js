import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  CardField,
  StripeProvider,
  createPaymentMethod,
  initPaymentSheet,
  initStripe,
  presentPaymentSheet,
  useStripe,
} from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import axios from "axios";

// const publishableKey =
//   "pk_test_51MxlJlDU0aTyl47mM2L2Upi7bKiFdgtkIXw91dVjONB2fSjle9h7ItIdhl5lZFbtFlkeorSDmNWEXiuNUHr705o400ztCW8j54";

export default function App() {
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useStripe();
  const [publishableKey, setPublishableKey] = useState(
    "pk_test_51MxlJlDU0aTyl47mM2L2Upi7bKiFdgtkIXw91dVjONB2fSjle9h7ItIdhl5lZFbtFlkeorSDmNWEXiuNUHr705o400ztCW8j54"
  );

  useEffect(() => {
    async function initialize() {
      await initStripe({
        publishableKey: publishableKey,
      });
    }
    initialize().catch(console.error);
  }, []);

  useEffect(() => {
    let data = {
      test: 123,
    };
    key = axios
      .post("https://payment-apitest.onrender.com/create_payment", {
        data,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        if (res?.data?.status === 200) {
          console.log("create_payment res", res?.data?.data);

          // console.log("setupIntent ===>>", res?.data?.data?.setupIntent);
          // console.log("ephemeralKey ===>>", res?.data?.data?.ephemeralKey);
          // console.log("customer ===>>", res?.data?.data?.customer);

          //
          //
          //
          //
          //
          // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
          //methods that complete payment after a delay, like SEPA Debit and Sofort.
          // allowsDelayedPaymentMethods: true,
          // defaultBillingDetails: {
          //   name: "Jane Doe",
          // },

          const { paymentIntent, error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: res?.data?.data?.customer,
            customerEphemeralKeySecret: res?.data?.data?.ephemeralKey,
            paymentIntentClientSecret: res?.data?.data?.setupIntent,
            customFlow: true,
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
              name: "Jane Doe",
            },
          })
            .then(async (res) => {
              console.log("initPaymentSheet res", res);
              const { error } = await presentPaymentSheet();
              // .then((res) => {
              //   console.log("res", res);
              // })
              // .catch((err) => {
              //   console.log("err", err);
              // });
              console.log("errrr", error);
            })
            .catch((err) => {
              console.log("initPaymentSheet error", err);
            });

          // if (error) {
          //   console.log(
          //     "confirm Payment failed:",
          //     error.message,
          //     "==>Full Err",
          //     error
          //   );
          // } else if (paymentIntent) {
          //   console.log("confirm Payment succeeded:", paymentIntent);
          // }
        } else {
          console.log("response err", err);
        }
      })
      .catch((err) => {
        console.log("create_payment err", err);
      });
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    const { paymentIntent, error } = await createPaymentMethod({
      amount: 1, // amount in cents
      currency: "usd",
      // type: "Card",
      confirm: true,
      paymentMethodType: "Card",
      billingDetails: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
      paymentMethod: {
        card: {
          number: "4242424242424242",
          expMonth: 12,
          expYear: 2025,
          cvc: "123",
        },
      },
    });
    setLoading(false);
    if (error) {
      console.log("Payment failed:", error.message, "==>", error);
    } else if (paymentIntent) {
      console.log("Payment succeeded:", paymentIntent);
    }
  };

  return (
    // <StripeProvider publishableKey={publishableKey}>
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />

      <Text style={{ fontSize: 24 }}>Card Payment</Text>
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: "4242 4242 4242 4242",
          expMonth: "MM",
          expYear: "YY",
          cvc: "CVC",
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 50,
          flexDirection: "column",
          backgroundColor: "red",
          flex: 0.1,
          marginHorizontal: 20,
        }}
        onCardChange={(cardDetails) => {
          console.log("Card details:", cardDetails);
        }}
        cardStyle={{
          backgroundColor: "#d3ffce",
          textColor: "#0000ff",
        }}
        onFocus={(focusedField) => {
          console.log("focusField", focusedField);
        }}
      />

      <TouchableOpacity onPress={handlePayment} disabled={loading}>
        <View
          style={{
            backgroundColor: "#007bff",
            padding: 10,
            borderRadius: 5,
            borderColor: "#6897bb",
            borderWidth: 1,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
            {loading ? "Loading..." : "Pay Now"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
    // </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c6e2ff",
    alignItems: "center",
    justifyContent: "center",
  },
});

//
// confirm: true,
// currency: "usd",
// amount: 1,
// paymentMethodData: {
//   card: {
//     number: "4242424242424242",
//     expMonth: 12,
//     expYear: 2025,
//     cvc: "123",
//   },
// },
// card: {
//   number: "4242424242424242",
//   expMonth: 12,
//   expYear: 2024,
//   cvc: "123",
// },

// /
// /
// /
// /
// /
// /
// /
// /
// setPublishableKey(res?.data?.data);
// const { paymentIntent, error } = await confirmPayment(
//   // res?.data?.data,
//   "pi_3MxqDjDU0aTyl47m3vqtkfUU",
//   {
//     paymentMethodType: "Card",
//     // amount: 1,
//     // currency: "usd",
//     // confirm: true,

//     billingDetails: {
//       name: "John Doe",
//       email: "john.doe@example.com",
//     },
//     // payment_method_details: {
//     //   card: {
//     //     installments: {
//     //       plan: {
//     //         count: 3,
//     //         interval: "month",
//     //         type: "fixed_count",
//     //       },
//     //     },
//     //   },
//     // },
//   }
// );
