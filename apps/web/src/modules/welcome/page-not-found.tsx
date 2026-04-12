import './page-not-found.css'; // Styles for the 404 Page

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">Oops! Page not found.</p>
      <p className="not-found-info">
        The page you are looking for might be under development or temporarily
        unavailable. It will be available soon!
      </p>
      <p className="not-found-back">
        <a href="/">Go back to Home</a>
      </p>
      {/* DEBUG */}
      <strong>debug-to-be-deleted: </strong>
      <br />
    </div>
  );
};

export default PageNotFound;
