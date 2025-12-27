import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './LostItemForm.css';

export default function LostItemForm({ onCreated }) {
  const { register, handleSubmit, reset } = useForm();
  const [photoFiles, setPhotoFiles] = useState([]);
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append('title', data.title);
      fd.append('description', data.description);
      fd.append('contactName', data.contactName);
      fd.append('contactPhone', data.contactPhone);
      fd.append('contactEmail', data.contactEmail || '');
      fd.append('status', 'lost');

  
      fd.append('questions', JSON.stringify(questions));

      photoFiles.forEach((f) => fd.append('photos', f));

      
      const resp = await fetch('http://localhost:5000/api/lost-items', {
        method: 'POST',
        body: fd,
      });

      if (!resp.ok) {
        throw new Error(`Failed to create lost item: ${resp.statusText}`);
      }

      const result = await resp.json();
      onCreated?.(result);

     
      reset();
      setQuestions([{ question: '', answer: '' }]);
      setPhotoFiles([]);
    } catch (err) {
      console.error(err);
      alert('Error posting lost item. Please try again.');
    }
  };

  const setQuestionField = (idx, key, val) => {
    const next = [...questions];
    next[idx][key] = val;
    setQuestions(next);
  };

  const addQuestion = () => setQuestions([...questions, { question: '', answer: '' }]);
  const removeQuestion = (idx) => setQuestions(questions.filter((_, i) => i !== idx));

  return (
    <div className="add-container">
      <h2>Post a lost item</h2>
      <form className="form-wrapper" onSubmit={handleSubmit(onSubmit)}>
        <label>Title</label>
        <input {...register('title', { required: true })} />

        <label>Description</label>
        <textarea {...register('description', { required: true })} rows={4} />

        <label>Contact name</label>
        <input {...register('contactName', { required: true })} />

        <label>Contact phone</label>
        <input {...register('contactPhone', { required: true })} />

        <label>Contact email (optional)</label>
        <input {...register('contactEmail')} />

        <label>Photos (up to 4)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotoFiles(Array.from(e.target.files || []).slice(0, 4))}
        />

        <h3>Verification questions</h3>
        {questions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <input
              placeholder="Question"
              value={q.question}
              onChange={(e) => setQuestionField(idx, 'question', e.target.value)}
            />
            <input
              placeholder="Answer"
              value={q.answer}
              onChange={(e) => setQuestionField(idx, 'answer', e.target.value)}
            />
            <button type="button" onClick={() => removeQuestion(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add question</button>

        <button type="submit">Post item</button>
      </form>
    </div>
  );
}
