const nodemailer = require("nodemailer");

const sendUserDetails = async (userProfile, jobDetails) => {
  try {
    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: 587,
      secure:false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // Ensure correct SSL/TLS compatibility
        minVersion: "TLSv1.2", // Force TLS 1.2+
        rejectUnauthorized: false // (Optional) Bypass SSL verification issues
      },
    });

    if (!userProfile || !jobDetails) {
      console.warn("Handshake Warning: Incomplete profile or job metadata for email dispatch.");
      return "Handshake partially successful (Sync recorded, no notification dispatch)";
    }

    const htmlTemplate = `
        <html>
        <body style="text-align: left; max-width:100%; font-family: Arial, sans-serif;">
          <h1>Job application received!</h1>
          <h1>User Profile Details</h1>
          <p>First Name: ${userProfile.firstName || 'Not provided'}</p>
          <p>Last Name: ${userProfile.lastName || 'Not provided'}</p>
          <p>Email: ${userProfile.email || 'Not provided'}</p>
          <p>Phone Number: ${userProfile.phoneNumber || 'Not provided'}</p>
          <p>Role: ${userProfile.role || 'Not provided'}</p>
          <p>Street Address: ${userProfile.streetAddress || 'Not provided'}</p>
          <p>City: ${userProfile.city || 'Not provided'}</p>
          <p>State/Province: ${userProfile.stateProvince || 'Not provided'}</p>
          <p>Preferred Job Type: ${userProfile.preferredJobType || 'Not provided'}</p>
          <p>Preferred Locations: ${userProfile.preferredLocations || 'Not provided'}</p>
          <p>Available Start Date: ${userProfile.availableStartDate || 'Not provided'}</p>
          <p>Availability: ${userProfile.availability?.join(", ") || 'Not provided'}</p>
          <p>Days Available: ${userProfile.daysAvailable?.join(", ") || 'Not provided'}</p>
          <p>Method of Transportation: ${userProfile.methodOfTransportation?.join(", ") || 'Not provided'}</p>
          <p>Additional Notes: ${userProfile.additionalNotes || 'None'}</p>
          <p>Years of Construction Experience: ${userProfile.yearsOfConstructionExperience || '0'}</p>
          <p>Other Experience: ${userProfile.otherExperience?.join(", ") || 'None'}</p>
          <p>Equipments Owned: ${userProfile.equipmentsOwned?.join(", ") || 'None'}</p>
          <h1>Job Details</h1>
          <p>Title: ${jobDetails.title || 'Unknown'}</p>
          <p>Address: ${jobDetails.address || 'Unknown'}</p>
          <p>Compensation: ${jobDetails.compensation || 'Unknown'}</p>
          <p>Department: ${jobDetails.department || 'Unknown'}</p>
          <p>Employment Type: ${jobDetails.employmentType || 'Unknown'}</p>
          <p>Minimum Experience: ${jobDetails.minimumExperience || '0'}</p>
        </body>
        </html>
    `;
    // Create an array to store the attachments
    const attachments = [];

    // Iterate over each certification and attach its PDF
    if (userProfile.certifications && Array.isArray(userProfile.certifications)) {
        userProfile.certifications.forEach((certification, index) => {
          const pdfBuffer = Buffer.from(certification.base64Pdf, "base64");
          const attachment = {
            filename: certification.originalname,
            content: pdfBuffer,
          };
          attachments.push(attachment);
        });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL,
      subject: "Job application received!",
      html: htmlTemplate,
      attachments: attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return "Job application email sent successfully";
  } catch (error) {
    console.error("Email dispatch failed:", error.message);
  }
};
const sendSuccessMessage = async (userProfile, jobDetails) => {
  try {
    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: 587,
      secure:false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // Ensure correct SSL/TLS compatibility
        minVersion: "TLSv1.2", // Force TLS 1.2+
        rejectUnauthorized: false // (Optional) Bypass SSL verification issues
      },
    });

    if (!userProfile || !userProfile.email) {
      console.warn("Handshake Warning: No email profile found for user.");
      return;
    }

    const htmlTemplate = `
        <html>
        <body style="text-align: left; max-width:100%; font-family: Arial, sans-serif;">
        <h1>Hey ${userProfile.firstName || 'User'},</h1>
        <p>Your Job application for the position ${jobDetails?.title || 'a new role'} was received. Our personnel will reach out to you if you are chosen for the role.</p>
        </body>
        </html>
    `;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: userProfile.email,
      subject: "Job application received!",
      html: htmlTemplate,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return "Job application email sent successfully";
  } catch (error) {
    console.error("Success message email failed:", error.message);
  }
};
const sendAssignmentEmail = async (userEmail, jobDetails) => {
  try {
   
    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: 587,
      secure:false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // Ensure correct SSL/TLS compatibility
        minVersion: "TLSv1.2", // Force TLS 1.2+
        rejectUnauthorized: false // (Optional) Bypass SSL verification issues
      },
    });
    const signinPage = `${process.env.VITE_FRONTEND_URL}/signin`;
    const htmlTemplate = `
        <html>
        <body style="max-width:100%; font-family: Arial, sans-serif;">
          <h1>Congratulations!</h1>
          <p>You have been successfully assigned to a new role:</p>
          <h2>Job Details</h2>
          <p>Title: ${jobDetails.title}</p>
          <p>Address: ${jobDetails.address}</p>
          <p>Compensation: ${jobDetails.compensation}</p>
          <p>Department: ${jobDetails.department}</p>
          <p>Employment Type: ${jobDetails.employmentType}</p>
          <p>Minimum Experience: ${jobDetails.minimumExperience}</p>
          <h1>Login to your account to view more details in the <a href="${signinPage}" style="color: #333; font-size: 24px;">Job Openings page</a></h1>
        </body>
        </html>
    `;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: userEmail,
      subject: "Congratulations! You've been assigned a new role",
      html: htmlTemplate,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return "Assignment email sent successfully";
  } catch (error) {
    console.error("Assignment email failed:", error.message);
  }
};

const sendNewJobEmail = async (userEmails, jobDetails) => {
  try {
    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // Ensure correct SSL/TLS compatibility
        minVersion: "TLSv1.2", // Force TLS 1.2+
        rejectUnauthorized: false // (Optional) Bypass SSL verification issues
      },
    });
    const signinPage = `${process.env.VITE_FRONTEND_URL}/signin`;
    const htmlTemplate = `
        <html>
        <body style="max-width:100%; font-family: Arial, sans-serif;">
          <h1>New Job Uploaded!</h1>
          <p>A new job has been uploaded to our platform:</p>
          <h2>Job Details</h2>
          <p>Title: ${jobDetails.title}</p>
          <p>Address: ${jobDetails.address}</p>
          <p>Compensation: ${jobDetails.compensation}</p>
          <p>Department: ${jobDetails.department}</p>
          <p>Employment Type: ${jobDetails.employmentType}</p>
          <p>Minimum Experience: ${jobDetails.minimumExperience}</p>
          <h1>Login to your account to view more details in the <a href="${signinPage}" style="color: #333; font-size: 24px;">Job Openings page</a></h1>
        </body>
        </html>
    `;

    const mailOptionsPromises = userEmails.map(async (userEmail) => {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: userEmail,
        subject: "New Job Uploaded to Platform",
        html: htmlTemplate,
      };
      return transporter.sendMail(mailOptions);
    });

    const results = await Promise.all(mailOptionsPromises);
    console.log("Emails sent:", results);
    return "New job emails sent successfully";
  } catch (error) {
    console.error("New job email failed:", error.message);
  }
};

const sendEmailWithScreenshot = async (screenshotData) => {
  try {
    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: 587,
      secure:false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // Ensure correct SSL/TLS compatibility
        minVersion: "TLSv1.2", // Force TLS 1.2+
        rejectUnauthorized: false // (Optional) Bypass SSL verification issues
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL,
      subject: "User filled out timesheet and submitted",
      html: "<p>Attached is a filled copy of the weekly timesheet</p>",
      attachments: [
        {
          filename: "Timesheet.png", // or .jpg, .jpeg, etc. based on the format
          content: screenshotData,
          encoding: "base64",
        },
      ],
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return "Timesheet successfully submitted!";
  } catch (error) {
    console.error("Timesheet screenshot email failed:", error.message);
  }
};

// Function to send email with employer data
const sendEmployerDataEmail = async (emailContent) => {
  try {
    // Create nodemailer transporter
    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: 587,
      secure:false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // Ensure correct SSL/TLS compatibility
        minVersion: "TLSv1.2", // Force TLS 1.2+
        rejectUnauthorized: false // (Optional) Bypass SSL verification issues
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.RECIPIENT_EMAIL, // Update with the recipient email address
      subject: "Employer Data Submission",
      text: emailContent,
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Employer data email failed:", error.message);
  }
};

// Function to send email with contact form data
const sendContactFormEmail = async (emailContent) => {
  try {
    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST, 
      port: 587, 
      secure:false, // true for port 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL, // Sender email from environment variable
        pass: process.env.APP_PASSWORD, // App password or SMTP password
      },
      tls: {
        ciphers: "SSLv3", // Ensure correct SSL/TLS compatibility
        minVersion: "TLSv1.2", // Force TLS 1.2+
        rejectUnauthorized: false // (Optional) Bypass SSL verification issues
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.SENDER_EMAIL, // Sender email address
      to: process.env.RECIPIENT_EMAIL, // Recipient email address
      subject: "Employer Data Submission", // Email subject
      text: emailContent, // Plain text body
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
  } catch (error) {
    console.error("Contact form email failed:", error.message);
  }
};


module.exports = {
  sendUserDetails,
  sendSuccessMessage,
  sendAssignmentEmail,
  sendNewJobEmail,
  sendEmailWithScreenshot,
  sendEmployerDataEmail,
  sendContactFormEmail,
};
