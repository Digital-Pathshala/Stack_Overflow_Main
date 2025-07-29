import Contact from "../models/ContactModels.js";

// Handle contact form submission
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, queries } = req.body;
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      queries,
    });
    res
      .status(201)                           
      .json({
        success: true,
        message: "Contact form submitted successfully",
        data: contact,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
