import React from 'react';
import Header from '../Header';

const PrivacyPolicy = () => (
  <>
    <Header />
    <div className='container-md'>
      <h1 className='h1 mb-4'>Privacy Policy</h1>
      <p><strong>Last Updated: December 31, 2025</strong></p>

      <h2 className='h2 mt-4 mb-3'>Introduction</h2>
      <p>
        Rupee For Humanity ("we", "us", "our") operates the website{' '}
        <a href="https://www.rupeeforhumanity.org/">https://www.rupeeforhumanity.org/</a>{' '}
        (the "Website" or "Service"). This Privacy Policy explains how we collect, use, disclose,
        and safeguard your information when you visit our Website, make donations, register for events,
        or interact with our services.
      </p>
      <p>
        We are committed to protecting your privacy and handling your data in an open and transparent manner.
        Please read this Privacy Policy carefully. By using our Service, you consent to the practices
        described in this policy.
      </p>

      <h2 className='h2 mt-4 mb-3'>Information We Collect</h2>

      <h3 className='h3 mt-3'>Personal Information</h3>
      <p>We collect the following personal information when you interact with our Service:</p>
      <ul>
        <li><strong>Contact Information:</strong> Full name, email address, phone number (mobile number)</li>
        <li><strong>Financial Information:</strong> PAN (Permanent Account Number) for tax receipt purposes as required by Indian Income Tax regulations</li>
        <li><strong>Donation Information:</strong> Donation amount, cause/purpose of donation, payment mode, transaction ID</li>
        <li><strong>Event Registration Data:</strong> Marathon participant information, volunteer registration details</li>
        <li><strong>Communication Data:</strong> Feedback, queries, and correspondence with our team</li>
      </ul>

      <h3 className='h3 mt-3'>Automatically Collected Information</h3>
      <p>When you visit our Website, we may automatically collect:</p>
      <ul>
        <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, time spent on pages</li>
        <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to track activity and improve user experience</li>
      </ul>

      <h2 className='h2 mt-4 mb-3'>How We Use Your Information</h2>
      <p>We use the collected information for the following purposes:</p>
      <ul>
        <li><strong>Processing Donations:</strong> To process your donations and issue tax-compliant receipts (80G certificates)</li>
        <li><strong>Email Communications:</strong> To send donation receipts, event confirmations, newsletters, and updates about our charitable activities</li>
        <li><strong>Tax Compliance:</strong> To generate and maintain records as required by Indian Income Tax laws for 80G deduction eligibility</li>
        <li><strong>Event Management:</strong> To manage marathon registrations, volunteer programs, and event participation</li>
        <li><strong>Customer Support:</strong> To respond to your inquiries, provide assistance, and address concerns</li>
        <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our Website and services</li>
        <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
      </ul>

      <h2 className='h2 mt-4 mb-3'>Gmail API Usage and Email Sending</h2>

      <h3 className='h3 mt-3'>How We Use Gmail API</h3>
      <p>
        Our Service uses <strong>Gmail API with OAuth2 authentication</strong> to send automated emails on behalf of
        Rupee For Humanity. Specifically, we use the <code>gmail.send</code> scope for the following purposes:
      </p>
      <ul>
        <li><strong>Donation Receipts:</strong> Sending PDF receipts to donors after successful donations</li>
        <li><strong>Event Confirmations:</strong> Sending confirmation emails for marathon registrations and volunteer sign-ups</li>
        <li><strong>Reminders:</strong> Sending donation reminders to regular donors</li>
        <li><strong>Updates:</strong> Sending newsletters and updates about our charitable activities</li>
      </ul>

      <h3 className='h3 mt-3'>Data Handling with Gmail API</h3>
      <p><strong>Important Gmail API Data Use Disclosure:</strong></p>
      <ul>
        <li>✅ We <strong>ONLY send emails</strong> using Gmail API - we do not read, access, or store any emails from your inbox</li>
        <li>✅ We <strong>DO NOT</strong> access, read, modify, or delete any of your existing emails</li>
        <li>✅ We <strong>DO NOT</strong> share your email address or Gmail data with any third parties for marketing purposes</li>
        <li>✅ We use Gmail API exclusively for sending transactional emails (receipts, confirmations) related to your interaction with Rupee For Humanity</li>
        <li>✅ Your Gmail credentials and access tokens are stored securely and used only for authorized email sending</li>
        <li>✅ We comply with{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
            Google API Services User Data Policy
          </a>, including the Limited Use requirements
        </li>
      </ul>

      <h3 className='h3 mt-3'>Gmail API Limited Use Disclosure</h3>
      <p>
        Rupee For Humanity's use of information received from Gmail APIs adheres to{' '}
        <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer">
          Google API Services User Data Policy
        </a>, including the Limited Use requirements.
      </p>

      <h2 className='h2 mt-4 mb-3'>Data Sharing and Disclosure</h2>

      <h3 className='h3 mt-3'>Third-Party Service Providers</h3>
      <p>We may share your information with trusted third-party service providers who assist us in operating our Service:</p>
      <ul>
        <li><strong>Payment Processors:</strong> PhonePe and other payment gateways to process donations (they have their own privacy policies)</li>
        <li><strong>Email Service:</strong> Gmail API (Google) for sending emails - governed by Google's Privacy Policy</li>
        <li><strong>Hosting Providers:</strong> Vercel, Railway, and MongoDB Atlas for hosting our application and database</li>
        <li><strong>Analytics:</strong> Usage analytics to understand how visitors interact with our Website</li>
      </ul>
      <p>
        These third parties are contractually obligated to use your information only for the purposes
        we specify and to protect your data in accordance with this Privacy Policy.
      </p>

      <h3 className='h3 mt-3'>Legal Requirements</h3>
      <p>We may disclose your information if required to do so by law or in response to:</p>
      <ul>
        <li>Valid legal processes (court orders, subpoenas, search warrants)</li>
        <li>Government or regulatory requests</li>
        <li>Protection of our rights, property, or safety, or that of our users or the public</li>
        <li>Compliance with Indian Income Tax Department requirements for 80G certification</li>
      </ul>

      <h3 className='h3 mt-3'>No Selling of Data</h3>
      <p>
        <strong>We do NOT sell, rent, or trade your personal information to third parties for their marketing purposes.</strong>
      </p>

      <h2 className='h2 mt-4 mb-3'>Data Retention</h2>
      <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:</p>
      <ul>
        <li><strong>Donation Records:</strong> Retained for a minimum of <strong>7 years</strong> as required by Indian Income Tax laws for audit and compliance purposes</li>
        <li><strong>Email Addresses:</strong> Retained as long as you remain engaged with our services or until you request deletion</li>
        <li><strong>Event Registration Data:</strong> Retained for <strong>3 years</strong> for record-keeping and future event planning</li>
        <li><strong>Cookies and Usage Data:</strong> Retained for <strong>90 days</strong> for analytics purposes</li>
      </ul>
      <p>
        After the retention period, we securely delete or anonymize your personal information unless
        legally required to retain it longer.
      </p>

      <h2 className='h2 mt-4 mb-3'>Data Security</h2>
      <p>
        The security of your personal information is important to us. We implement industry-standard
        security measures to protect your data:
      </p>
      <ul>
        <li><strong>Encryption:</strong> HTTPS/TLS encryption for data transmission</li>
        <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
        <li><strong>Secure Storage:</strong> Encrypted database storage with regular backups</li>
        <li><strong>OAuth2 Authentication:</strong> Secure token-based authentication for Gmail API access</li>
        <li><strong>Regular Security Audits:</strong> Periodic review of security practices and infrastructure</li>
      </ul>
      <p>
        However, please note that no method of transmission over the Internet or electronic storage is
        100% secure. While we strive to use commercially acceptable means to protect your data, we cannot
        guarantee its absolute security.
      </p>

      <h2 className='h2 mt-4 mb-3'>Your Rights and Choices</h2>
      <p>You have the following rights regarding your personal information:</p>
      <ul>
        <li><strong>Access:</strong> You can request a copy of the personal information we hold about you</li>
        <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information</li>
        <li><strong>Deletion:</strong> You can request deletion of your personal information (subject to legal retention requirements)</li>
        <li><strong>Opt-Out:</strong> You can unsubscribe from marketing emails using the unsubscribe link in our emails</li>
        <li><strong>Withdraw Consent:</strong> You can withdraw consent for data processing where consent was the legal basis</li>
        <li><strong>Data Portability:</strong> You can request your data in a commonly used electronic format</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us at{' '}
        <a href="mailto:rupee4humanity@gmail.com">rupee4humanity@gmail.com</a>
      </p>

      <h2 className='h2 mt-4 mb-3'>Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar tracking technologies to enhance your experience on our Website.
        Cookies are small text files stored on your device that help us:
      </p>
      <ul>
        <li>Remember your preferences and settings</li>
        <li>Understand how you use our Website</li>
        <li>Improve Website functionality and performance</li>
        <li>Provide personalized content</li>
      </ul>
      <p>
        You can control cookies through your browser settings. However, disabling cookies may affect
        the functionality of certain features on our Website.
      </p>

      <h2 className='h2 mt-4 mb-3'>Children's Privacy</h2>
      <p>
        Our Service is not directed to children under the age of 18. We do not knowingly collect
        personal information from children under 18. If you are a parent or guardian and believe your
        child has provided us with personal information, please contact us, and we will delete such information.
      </p>

      <h2 className='h2 mt-4 mb-3'>International Data Transfers</h2>
      <p>
        Your information may be transferred to and maintained on servers located outside of India,
        including but not limited to the United States (for hosting services). By using our Service,
        you consent to the transfer of your information to countries that may have different data
        protection laws than India.
      </p>

      <h2 className='h2 mt-4 mb-3'>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices,
        technology, legal requirements, or other factors. We will notify you of any material changes by:
      </p>
      <ul>
        <li>Posting the updated Privacy Policy on this page with a new "Last Updated" date</li>
        <li>Sending an email notification to registered users (for significant changes)</li>
      </ul>
      <p>
        We encourage you to review this Privacy Policy periodically. Your continued use of the Service
        after changes are posted constitutes your acceptance of the updated Privacy Policy.
      </p>

      <h2 className='h2 mt-4 mb-3'>Compliance with Indian Laws</h2>
      <p>
        Rupee For Humanity is registered under Section 80G of the Indian Income Tax Act, 1961. We comply with:
      </p>
      <ul>
        <li><strong>Income Tax Act, 1961:</strong> Retention of donor records for tax deduction purposes</li>
        <li><strong>Information Technology Act, 2000:</strong> Data protection and cybersecurity provisions</li>
        <li><strong>Digital Personal Data Protection Act, 2023:</strong> Individual rights and data processing obligations</li>
      </ul>

      <h2 className='h2 mt-4 mb-3'>Contact Us</h2>
      <p>
        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
        please contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:rupee4humanity@gmail.com">rupee4humanity@gmail.com</a></li>
        <li><strong>Website:</strong> <a href="https://www.rupeeforhumanity.org/">https://www.rupeeforhumanity.org/</a></li>
        <li><strong>Organization:</strong> Rupee For Humanity</li>
      </ul>
      <p>
        We will respond to your inquiry within 30 days of receipt.
      </p>

      <hr className="my-5" />

      <p className="text-muted small">
        <strong>Google API Services User Data Policy Compliance:</strong> Rupee For Humanity's use and
        transfer of information received from Google APIs to any other app will adhere to{' '}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
          Google API Services User Data Policy
        </a>, including the Limited Use requirements.
      </p>
    </div>
  </>
);

export default PrivacyPolicy;
