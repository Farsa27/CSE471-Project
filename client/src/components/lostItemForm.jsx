import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './LostItemForm.css';

export default function LostItemForm({ onCreated }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [photoFiles, setPhotoFiles] = useState([]);
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const onSubmit = async (data) => {
    console.log('Raw form data from react-hook-form:', data);


    const validQuestions = questions.filter(q => q.question.trim() && q.answer.trim());

    console.log(' Raw questions state:', questions);
    console.log('Valid questions (after filtering empty):', validQuestions);

    if (validQuestions.length === 0) {
      alert("Please add at least one verification question with both question and answer.");
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


      photoFiles.forEach((file, index) => {
        fd.append('photos', file);
        console.log(`Photo ${index + 1}:`, file.name, file.type, file.size);
      });

      console.log('Final validQuestions being sent:', validQuestions);
      console.log('Total photos being sent:', photoFiles.length);

      console.log(' Full FormData contents:');
      for (let [key, value] of fd.entries()) {
        if (value instanceof File) {
          console.log(`   ${key}: [File] ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`   ${key}:`, value);
        }
      }

      const resp = await fetch('http://localhost:5000/api/lost-items', {
        method: 'POST',
        body: fd,
      });

      const result = await resp.json();

      console.log(' Response status:', resp.status);
      console.log('Response body:', result);

      if (!resp.ok) {
        const msg = result.errors
          ? result.errors.join("\n")
          : result.message || "Unknown error";
        alert("Error posting lost item:\n" + msg);
        console.error('Backend error:', msg);
        return;
      }

      alert("Lost item posted successfully!");
      console.log('Success! Item created:', result);

      onCreated?.(result);


      reset();
      setQuestions([{ question: '', answer: '' }]);
      setPhotoFiles([]);
    } catch (err) {
      console.error(' Network or unexpected error:', err);
      alert('Network error. Please try again.');
    }
  };

  const setQuestionField = (idx, key, val) => {
    const next = [...questions];
    next[idx][key] = val;
    setQuestions(next);
  };

  const addQuestion = () => {
    console.log('➕Adding new question');
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (idx) => {
    console.log('➖ Removing question at index:', idx);
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <div className="add-container">
      <h2>Post a Lost Item</h2>
      <form className="form-wrapper" onSubmit={handleSubmit(onSubmit)}>
        <label>Title *</label>
        <input {...register('title', { required: "Title is required" })} />
        {errors.title && <p style={{color: 'red'}}>{errors.title.message}</p>}

        <label>Description *</label>
        <textarea {...register('description', { required: "Description is required" })} rows={4} />
        {errors.description && <p style={{color: 'red'}}>{errors.description.message}</p>}

        <label>Contact Name *</label>
        <input {...register('contactName', { required: "Contact name is required" })} />
        {errors.contactName && <p style={{color: 'red'}}>{errors.contactName.message}</p>}

        <label>Contact Phone *</label>
        <input {...register('contactPhone', { required: "Phone is required" })} />
        {errors.contactPhone && <p style={{color: 'red'}}>{errors.contactPhone.message}</p>}

        <label>Contact Email (optional)</label>
        <input type="email" {...register('contactEmail')} />

        <label>Photos (up to 4)</label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []).slice(0, 4);
            setPhotoFiles(files);
            console.log(' Photos selected:', files.map(f => f.name));
          }}
        />

        <h3>Verification Questions (at least one required)</h3>
        {questions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 12, padding: 8, border: '1px solid #ccc' }}>
            <input
              placeholder="Question"
              value={q.question}
              onChange={(e) => setQuestionField(idx, 'question', e.target.value)}
              style={{ width: '45%', marginRight: 8 }}
            />
            <input
              placeholder="Answer (case-insensitive)"
              value={q.answer}
              onChange={(e) => setQuestionField(idx, 'answer', e.target.value)}
              style={{ width: '45%' }}
            />
            {questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(idx)} style={{ marginLeft: 8 }}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add Another Question</button>

        <button type="submit" style={{ marginTop: 20, padding: 12, fontSize: 16 }}>
          Post Lost Item
        </button>
      </form>
    </div>
  );
}