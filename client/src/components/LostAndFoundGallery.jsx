import React, { useEffect, useState } from 'react';
import './LostAndFoundGallery.css';
import { useTranslation } from 'react-i18next';

export default function LostAndFoundGallery() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [answers, setAnswers] = useState({});
  const [claimStatus, setClaimStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/lost-items');
        if (!res.ok) throw new Error(t('Failed to load items'));
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        alert(t('Unable to load lost items. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [t]);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value.trim() }));
  };

  const handleClaim = async () => {
    if (!selectedItem) return;

    const userAnswers = selectedItem.questions.map((_, idx) => answers[idx] || '');

    try {
      const res = await fetch(`/api/lost-items/${selectedItem._id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: userAnswers }),
      });

      await res.json();

      if (res.ok) {
        setClaimStatus('success');
        setItems((prev) =>
          prev.map((item) =>
            item._id === selectedItem._id ? { ...item, status: 'claimed' } : item
          )
        );
      } else {
        setClaimStatus('error');
        alert(t('Wrong answers. Please try again.'));
      }
    } catch (err) {
      setClaimStatus('error');
      alert(t('Network error. Please try again.'));
    }
  };

  const availableItems = items.filter((item) => item.status !== 'claimed');

  return (
    <div className="gallery-container">
      <div className="max-w-5xl mx-auto px-4">
        <h1>{t('Lost & Found Gallery')}</h1>

        {loading ? (
          <p className="text-center text-gray-600">{t('Loading items...')}</p>
        ) : availableItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            {t('No lost items available right now.')}
          </p>
        ) : (
          <div className="gallery-grid">
            {availableItems.map((item) => (
              <div key={item._id} className="gallery-card">
                {item.photos?.length > 0 ? (
                  <img
                    src={item.photos[0]}
                    alt={`${item.title}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-300">{t('No photo')}</span>
                  </div>
                )}

                <div className="gallery-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p className="text-sm text-gray-400">{t('Posted by:')} {item.contactName}</p>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setAnswers({});
                      setClaimStatus('');
                    }}
                    className="submit-btn"
                  >
                    {t('Claim This Item')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Claim Modal */}
        {selectedItem && (
          <div className="modal-overlay">
            <div className="claim-modal">
              <h2>{t('Claim')}: {selectedItem.title}</h2>

              {selectedItem.photos?.length > 0 && (
                <img
                  src={selectedItem.photos[0]}
                  alt={selectedItem.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
              )}

              <p className="mb-6 text-slate-300">{selectedItem.description}</p>

              <h3 className="font-semibold mb-3 text-slate-100">{t('Answer these questions:')}</h3>

              {selectedItem.questions.map((q, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-medium mb-1 text-slate-200">{idx + 1}. {q.question}</p>
                  <input
                    type="text"
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder={t('Your answer')}
                  />
                </div>
              ))}

              <button
                onClick={handleClaim}
                className="submit-btn"
              >
                {t('Submit & Claim')}
              </button>

              {claimStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="font-bold">{t('Claim Approved!')}</p>
                  <p><strong>{t('Name:')}</strong> {selectedItem.contactName}</p>
                  <p><strong>{t('Phone:')}</strong> {selectedItem.contactPhone}</p>
                  {selectedItem.contactEmail && <p><strong>{t('Email:')}</strong> {selectedItem.contactEmail}</p>}
                </div>
              )}

              {claimStatus === 'error' && (
                <p className="mt-4 text-red-500 text-center">{t('Incorrect answers. Try again.')}</p>
              )}

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setAnswers({});
                  setClaimStatus('');
                }}
                className="cancel-btn"
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}