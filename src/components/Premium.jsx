import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
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
    };
    const rzp = new window.Razorpay(options);

    rzp.open();
  };
  return (
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
  );
};

export default Premium;
