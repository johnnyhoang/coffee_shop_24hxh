import React from 'react';
import './welcome.css'; // Styles for the Welcome Page

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to the RMO App!</h1>
      <p className="welcome-intro">
        Here, you have all the tools and resources you need to efficiently
        manage your capacity, projects and teams. From project capacity planning
        to resource allocation, we&apos;ve got you covered.
      </p>
      <p className="welcome-info">
        Get started by navigating through the menu options on the left. If you
        have any questions or need assistance, don&apos;t hesitate to reach out
        to our support team.
      </p>
      <p className="welcome-ending">
        Let&apos;s make our projects a success together!
      </p>
    </div>
  );
};

export default WelcomePage;
