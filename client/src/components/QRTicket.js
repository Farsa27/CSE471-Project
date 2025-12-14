import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const QRTicket = () => {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);

  const generateTicket = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return alert("Please login first");

    const user = JSON.parse(userStr);
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // ticket will expire after 1 week
    const ticket = {
      userId: user._id,
      name: user.name,
      expiresAt: expiry.toISOString(),
    };

    setTicketData(ticket);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow max-w-md w-full text-center">
        <h2 className="text-xl font-bold mb-4">Generate QR Ticket</h2>

        {!ticketData ? (
          <button
            onClick={generateTicket}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Get My QR Ticket
          </button>
        ) : (
          <div className="space-y-4">
            <QRCodeCanvas
              value={JSON.stringify(ticketData)}
              size={256}
              className="mx-auto"
            />
            <p className="text-gray-700">
              Ticket for <strong>{ticketData.name}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Expires at: {new Date(ticketData.expiresAt).toLocaleString()}
            </p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 px-4 py-2 border rounded hover:bg-gray-50"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRTicket;
