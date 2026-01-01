import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './lostitemForm.css';
import { useTranslation } from 'react-i18next';

export default function LostItemForm({ onCreated }) {
  const { t, i18n } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [photoFiles, setPhotoFiles] = useState([]);
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const onSubmit = async (data) => {
    const validQuestions = questions.filter(
      (q) => q.question.trim() && q.answer.trim()
    );

    if (validQuestions.length === 0) {
      alert(
        t('Please add at least one verification question with both question and answer.')
      );
      return;
    }

    try {
      const fd = new FormData();

      fd.append('title', data.title.trim());
      fd.append('description', data.description.trim());
      fd.append('contactName', data.contactName.trim());
      fd.append('contactPhone', data.contactPhone.trim());

      if (data.contactEmail?.trim()) {
        fd.append('contactEmail', data.contactEmail.trim());
      }

      fd.append('questions', JSON.stringify(validQuestions));

      photoFiles.forEach((file) => {
        fd.append('photos', file);
      });

      const resp = await fetch('http://localhost:5000/api/lost-items', {
        method: 'POST',
        body: fd,
      });

      const result = await resp.json();

      if (!resp.ok) {
        const msg = result.errors
          ? result.errors.join('\n')
          : result.message || t('Unknown error');
        alert(t('Error posting lost item:') + '\n' + msg);
        return;
      }

      alert(t('Lost item posted successfully!'));
      onCreated?.(result);

      reset();
      setQuestions([{ question: '', answer: '' }]);
      setPhotoFiles([]);
    } catch (err) {
      console.error('Network or unexpected error:', err);
      alert(t('Network error. Please try again.'));
    }
  };

  const setQuestionField = (idx, key, val) => {
    const next = [...questions];
    next[idx][key] = val;
    setQuestions(next);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-title">{t('Lost & Found')}</div>
        <ul>
          <li>{t('Post Lost Item')}</li>
          <li>{t('View Lost Items')}</li>
          <li>{t('View Found Items')}</li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <button className="language" onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en')}>{i18n.language === 'en' ? 'BN' : 'EN'}</button>
          <button className="logout-btn">{t('logout')}</button>
        </div>

        <section className="form-section">
          <h2>{t('Post a Lost Item')}</h2>

          <form className="form-wrapper" onSubmit={handleSubmit(onSubmit)}>
            <label>{t('Title')} *</label>
            <input
              {...register('title', { required: t('Title is required') })}
            />
            {errors.title && (
              <p style={{ color: 'red' }}>{errors.title.message}</p>
            )}

            <label>{t('Description')} *</label>
            <textarea
              rows={4}
              {...register('description', {
                required: t('Description is required'),
              })}
            />
            {errors.description && (
              <p style={{ color: 'red' }}>{errors.description.message}</p>
            )}

            <label>{t('Contact Name')} *</label>
            <input
              {...register('contactName', {
                required: t('Contact name is required'),
              })}
            />
            {errors.contactName && (
              <p style={{ color: 'red' }}>{errors.contactName.message}</p>
            )}

            <label>{t('Contact Phone')} *</label>
            <input
              {...register('contactPhone', {
                required: t('Phone is required'),
              })}
            />
            {errors.contactPhone && (
              <p style={{ color: 'red' }}>{errors.contactPhone.message}</p>
            )}

            <label>{t('Contact Email (optional)')}</label>
            <input type="email" {...register('contactEmail')} />

            <label>{t('Photos (up to 4)')}</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 4);
                setPhotoFiles(files);
              }}
            />

            <h3 style={{ marginTop: 24 }}>{t('Verification Questions')}</h3>
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              {t('At least one question and answer is required to verify the owner.')}
            </p>

            {questions.map((q, idx) => (
              <div className="question-row" key={idx}>
                <input
                  placeholder={t('Question')}
                  value={q.question}
                  onChange={(e) =>
                    setQuestionField(idx, 'question', e.target.value)
                  }
                />
                <input
                  placeholder={t('Answer (case-insensitive)')}
                  value={q.answer}
                  onChange={(e) =>
                    setQuestionField(idx, 'answer', e.target.value)
                  }
                />
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      background: 'rgba(248, 113, 113, 0.18)',
                      color: '#b91c1c',
                      fontWeight: 600,
                    }}
                  >
                    {t('Remove')}
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              style={{
                marginTop: 4,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid rgba(148,163,184,0.6)',
                background: 'rgba(148,163,184,0.08)',
                color: 'rgb(15 23 42)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('+ Add Another Question')}
            </button>

            <button type="submit" className="submit-btn">
              {t('Post Lost Item')}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
