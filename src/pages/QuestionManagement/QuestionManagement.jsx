import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuestionManagement.css';

const QuestionManagement = () => {
  
  const [questions, setQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [], 
    status: 'open'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/questions');
      setQuestions(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching questions');
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      content: question.content,
      tags: question.tags.join(', ')
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = typeof formData.tags === 'string'
        ? formData.tags.split(',').map(tag => tag.trim())
        : formData.tags;

      if (editingQuestion) {
        // Update existing question
        await axios.put(`http://localhost:5000/api/questions/${editingQuestion._id}`, {
          ...formData,
          tags: tagsArray
        });
      } else {
        // Create new question
        await axios.post('http://localhost:5000/api/questions', {
          ...formData,
          tags: tagsArray
        });
      }

      
      await fetchQuestions();

      // Reset form and close modal
      setShowModal(false);
      setEditingQuestion(null);
      setFormData({ title: '', content: '', tags: '' });
    } catch (error) {
      setError('Failed to save question.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`http://localhost:5000/api/questions/${id}`);
        fetchQuestions();
      } catch (error) {
        setError('Error deleting question');
      }
    }
  };

 
  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setViewModalOpen(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="question-management">
      <div className="header">
        <h2>Question Management</h2>
        <button 
          className="add-btn"
          onClick={() => {
            setEditingQuestion(null);
            setFormData({ title: '', content: '', tags: [] });
            setShowModal(true);
          }}
        >
          Add Question
        </button>
      </div>

      {/* Question Table */}
      <div className="questions-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question._id}>
                <td>{question.title}</td>
                <td>
                  {question.author?.fullName || 'Unknown'}
                </td>
                <td>
                  <div className="tags">
                    {Array.isArray(question.tags) && question.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status ${question.status}`}>
                    {question.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-btn"
                      onClick={() => handleViewQuestion(question)}
                      title="View Question"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(question)}
                      title="Edit Question"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(question._id)}
                      title="Delete Question"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="react, javascript, nodejs"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingQuestion ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingQuestion(null);
                    setFormData({ title: '', content: '', tags: [] });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Question Modal */}
      {viewModalOpen && selectedQuestion && (
        <div className="modal">
          <div className="modal-content view-modal">
            <div className="modal-header">
              <h3>Question Details</h3>
              <button 
                className="close-btn" 
                onClick={() => setViewModalOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="question-details">
              <div className="detail-group">
                <label>Title</label>
                <p className="detail-value">{selectedQuestion.title}</p>
              </div>
              <div className="detail-group">
                <label>Content</label>
                <p className="detail-value content">{selectedQuestion.content}</p>
              </div>
              {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                <div className="detail-group">
                  <label>Tags</label>
                  <div className="tags-container">
                    {selectedQuestion.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="detail-group">
                <label>Status</label>
                <span className={`status ${selectedQuestion.status}`}>
                  {selectedQuestion.status}
                </span>
              </div>
              <div className="detail-group">
                <label>Created At</label>
                <p className="detail-value">
                  {new Date(selectedQuestion.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;