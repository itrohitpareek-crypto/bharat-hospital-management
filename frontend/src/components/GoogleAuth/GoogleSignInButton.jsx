import React, { useEffect, useRef } from "react";

// Renders Google's official "Sign in with Google" button and calls
// onSuccess(idToken) once the user picks their account.
const GoogleSignInButton = ({ onSuccess, onError }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const renderButton = () => {
      if (!window.google || !buttonRef.current || !clientId) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else if (onError) {
            onError("No credential returned from Google");
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
        shape: "pill",
      });
    };

    // The GSI script loads async, so poll briefly until it's ready
    if (window.google) {
      renderButton();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          renderButton();
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [onSuccess, onError]);

  return <div ref={buttonRef}></div>;
};

export default GoogleSignInButton;