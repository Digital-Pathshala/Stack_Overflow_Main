import nodemailer from 'nodemailer'

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
service: "gmail",
  auth: {
    user: "tamangadit86@gmail.com",
    pass: 'zhvnhkqqkslbkyse',
  },
});


//
const sendMail = async (email,otp)=>{
    const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: email,
    subject: "Your OTP code",
    // text: "Your OTP code is ", // plain‑text body
    html: `<b>Your OTP code is </b> ${otp}`, // HTML body
  });
  console.log(info)
}

// sendMail("kanchantamang18@gmail.com",otp)

export {sendMail}