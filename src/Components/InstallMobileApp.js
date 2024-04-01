import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

let deferredPrompt;

const InstallMobileApp = (props) => {
  const [showInstallMessageCompopent, setShowInstallMessageCompopent] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowInstallMessageCompopent(true);
    });
  }, []);

  console.log("showInstallMessageCompopent ", showInstallMessageCompopent)

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    }
  };

 return (
    showInstallMessageCompopent && 
    ( props.type === 'button' ? <Button variant='contained' onClick={promptInstall}>Install App</Button> :
     <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={promptInstall}>
       Install App
     </span>  )
     
 );
};

export default InstallMobileApp;
