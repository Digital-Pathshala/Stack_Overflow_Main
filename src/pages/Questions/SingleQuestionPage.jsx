import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";


const SingleQuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [user, setUser] = useState(null); // From localStorage

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/question/getQuestionsById/${id}`);
        setQuestion(res.data);
        setAnswers(res.data.answers || []);
      } catch (err) {
        console.error('Error fetching question:', err);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleAnswerSubmit = async () => {
    if (!user) {
      alert("Please login to post an answer.");
      return;
    }

    if (!newAnswer.trim()) {
      alert("Answer cannot be empty.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/answer/postAnswer`, {
        questionId: id,
        answerText: newAnswer,
        answeredBy: user.userName,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });

      if (res.status === 201 || res.data.success) {
        setAnswers(prev => [...prev, res.data.answer]);
        setNewAnswer('');
      }
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  if (!question) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
      <p className="text-gray-700 mb-4">{question.content}</p>
      <div className="mb-4">
        <strong>Tags:</strong>{" "}
        {question.tags?.map((tag, i) => (
          <span key={i} className="inline-block bg-gray-200 text-sm px-2 py-1 rounded mr-2">{tag}</span>
        ))}
      </div>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-3">Answers ({answers.length})</h2>
      {answers.length === 0 ? (
        <p className="text-gray-500">No answers yet.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {answers.map((answer, index) => (
            <li key={index} className="border p-4 rounded bg-gray-50">
              <p>{answer.answerText}</p>
              <div className="text-sm text-gray-500 mt-2">
                Answered by <strong>{answer.answeredBy}</strong> · {new Date(answer.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr className="my-4" />

      {user ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Answer</h3>
          <textarea
            rows="5"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Write your answer here..."
          ></textarea>
          <button
            onClick={handleAnswerSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <p className="text-red-500 font-medium">Please login to post an answer.</p>
      )}
    </div>
  );
};

export default SingleQuestionPage;
