import React, { useEffect, useState } from 'react';

export default function LostAndFoundGallery() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [answers, setAnswers] = useState({});
  const [claimStatus, setClaimStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/lost-items');
        if (!res.ok) throw new Error('Failed to load items');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        alert('Unable to load lost items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value.trim() }));
  };

  const handleClaim = async () => {
    if (!selectedItem) return;

    const userAnswers = selectedItem.questions.map((_, idx) => answers[idx] || '');

    try {
      const res = await fetch(`http://localhost:5000/api/lost-items/${selectedItem._id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: userAnswers }),
      });

      const result = await res.json();

      if (res.ok) {
        setClaimStatus('success');
        setItems((prev) =>
          prev.map((item) =>
            item._id === selectedItem._id ? { ...item, status: 'claimed' } : item
          )
        );
      } else {
        setClaimStatus('error');
        alert('Wrong answers. Please try again.');
      }
    } catch (err) {
      setClaimStatus('error');
      alert('Network error. Please try again.');
    }
  };

  const availableItems = items.filter((item) => item.status !== 'claimed');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Lost & Found Gallery</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading items...</p>
        ) : availableItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No lost items available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm border">
                {item.photos?.length > 0 ? (
                  <img
                    src={item.photos[0]}
                    alt={`${item.title}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">No photo</span>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Posted by: {item.contactName}</p>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setAnswers({});
                      setClaimStatus('');
                    }}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Claim This Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Claim Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Claim: {selectedItem.title}</h2>

              {selectedItem.photos?.length > 0 && (
                <img
                  src={selectedItem.photos[0]}
                  alt={selectedItem.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
              )}

              <p className="text-gray-700 mb-6">{selectedItem.description}</p>

              <h3 className="font-semibold mb-3">Answer these questions:</h3>

              {selectedItem.questions.map((q, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-medium mb-1">{idx + 1}. {q.question}</p>
                  <input
                    type="text"
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Your answer"
                  />
                </div>
              ))}

              <button
                onClick={handleClaim}
                className="w-full bg-green-600 text-white py-2 rounded mb-2 hover:bg-green-700"
              >
                Submit & Claim
              </button>

              {claimStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="font-bold">Claim Approved!</p>
                  <p><strong>Name:</strong> {selectedItem.contactName}</p>
                  <p><strong>Phone:</strong> {selectedItem.contactPhone}</p>
                  {selectedItem.contactEmail && <p><strong>Email:</strong> {selectedItem.contactEmail}</p>}
                </div>
              )}

              {claimStatus === 'error' && (
                <p className="mt-4 text-red-600 text-center">Incorrect answers. Try again.</p>
              )}

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setAnswers({});
                  setClaimStatus('');
                }}
                className="w-full mt-2 text-gray-600 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}