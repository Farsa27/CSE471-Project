import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadAd.css";

export default function UploadAd() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    order: 0,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Fetch all ads
  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ads");
      setAds(res.data);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("link", formData.link);
      data.append("order", formData.order);
      if (image) {
        data.append("image", image);
      }

      if (editingId) {
        // Update existing ad
        await axios.put(`http://localhost:5000/api/ads/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Ad updated successfully!");
        setEditingId(null);
      } else {
        // Create new ad
        if (!image) {
          setError("Please select an image");
          setLoading(false);
          return;
        }
        await axios.post("http://localhost:5000/api/ads", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Ad uploaded successfully!");
      }

      // Reset form
      setFormData({ title: "", description: "", link: "", order: 0 });
      setImage(null);
      setImagePreview(null);
      fetchAds();
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to upload ad";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete ad
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/ads/${id}`);
      setSuccess("Ad deleted successfully!");
      fetchAds();
    } catch (err) {
      setError("Failed to delete ad");
    }
  };

  // Toggle ad status
  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/ads/${id}/toggle`);
      fetchAds();
    } catch (err) {
      setError("Failed to toggle ad status");
    }
  };

  // Edit ad
  const handleEdit = (ad) => {
    setEditingId(ad._id);
    setFormData({
      title: ad.title,
      description: ad.description || "",
      link: ad.link || "",
      order: ad.order || 0,
    });
    setImagePreview(`http://localhost:5000${ad.imageUrl}`);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", link: "", order: 0 });
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="upload-ad-container">
      <div className="upload-ad-header">
        <h1 className="upload-ad-title">
          {editingId ? "Edit Advertisement" : "Upload Advertisement"}
        </h1>
        <button onClick={() => navigate("/admin-dashboard")} className="btn-back">
          Back to Dashboard
        </button>
      </div>

      {/* Upload Form */}
      <div className="upload-ad-form-section">
        <form onSubmit={handleSubmit} className="upload-ad-form">
          {error && <div className="message error-message">{error}</div>}
          {success && <div className="message success-message">{success}</div>}

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter ad title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter ad description"
            />
          </div>

          <div className="form-group">
            <label>Link URL</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Image * {editingId && "(Upload new to replace)"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editingId}
            />
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Processing..." : editingId ? "Update Ad" : "Upload Ad"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Ads List */}
      <div className="ads-list-section">
        <h2 className="ads-list-title">Existing Advertisements</h2>
        {ads.length === 0 ? (
          <div className="no-ads">No advertisements found</div>
        ) : (
          <div className="ads-grid">
            {ads.map((ad) => (
              <div key={ad._id} className={`ad-card ${!ad.isActive ? "inactive" : ""}`}>
                <div className="ad-image">
                  <img src={`http://localhost:5000${ad.imageUrl}`} alt={ad.title} />
                  <div className="ad-status">
                    {ad.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="ad-content">
                  <h3>{ad.title}</h3>
                  {ad.description && <p>{ad.description}</p>}
                  {ad.link && (
                    <a href={ad.link} target="_blank" rel="noopener noreferrer">
                      Visit Link
                    </a>
                  )}
                  <div className="ad-meta">Order: {ad.order}</div>
                </div>
                <div className="ad-actions">
                  <button onClick={() => handleEdit(ad)} className="btn-edit">
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(ad._id)}
                    className="btn-toggle"
                  >
                    {ad.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(ad._id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
