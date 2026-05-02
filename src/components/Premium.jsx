import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/premium/verify",
        {},
        {
          withCredentials: true,
        },
      );
      if (res.data.isPremium) {
        setIsUserPremium(true);
      } else {
        setIsUserPremium(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuyClick = async (membershipType) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType },
      { withCredentials: true },
    );
    // const { orderId } = order.data;
    const { amount, key, currency, notes, orderId } = order.data;
    const options = {
      key: key,
      amount: amount,
      currency: currency,
      notes: notes,
      order_id: orderId,
      name: "DevTinder",
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.email,
        contact: "9999999999",
      },
      handler: verifyPremiumUser,
    };
    const rzp = new window.Razorpay(options);

    rzp.open();
  };

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(
          BASE_URL + "/premium/verify",
          {},
          {
            withCredentials: true,
          },
        );
        setIsUserPremium(res.data.isPremium);
      } catch (err) {
        console.log(err);
      }
    };
    verify();
  }, []);

  return !isUserPremium ? (
    <div className="m-10">
      <div className="flex w-full">
        <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
          <h1 className="font-bold text-3xl">Sliver Membership</h1>
          <ul>
            <li> - Chat with people</li>
            <li> - 100 connection requests per day</li>
            <li> - Blue tick</li>
            <li> - 3 months</li>
          </ul>
          <button
            className="btn btn-primary"
            onClick={() => handleBuyClick("silver")}
          >
            Buy Silver
          </button>
        </div>
        <div className="divider divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-80m grow place-items-center">
          <h1 className="font-bold text-3xl">Gold Membership</h1>
          <ul>
            <li> - Chat with people</li>
            <li> - 100 connection requests per day</li>
            <li> - Blue tick</li>
            <li> - 6 months</li>
          </ul>
          <button
            className="btn btn-primary"
            onClick={() => handleBuyClick("gold")}
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="m-10">
      <h1 className="font-bold text-3xl">You are a premium user! 🎉</h1>
    </div>
  );
};

export default Premium;
