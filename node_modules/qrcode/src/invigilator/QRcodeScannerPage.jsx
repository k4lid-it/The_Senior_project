import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import './QRcodeScannerPage.css';
import { io } from "socket.io-client";


const QRCodeScannerPage = () => {
  const [result, setResult] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const SocketClient = io("http://localhost:3003");

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      setShowPopup(true);

      // Socket 
      SocketClient.emit('server', data); // Sends the scanned "data" to the server
      SocketClient.on("connect", () => {
        console.log("React Client Connected to Server");
      });
      // End socket 

    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="qrcode-scanner-page">
      <div className="qrcode-scanner-container">
        <h1 className="qrcode-scanner-title">Scan student's QR Code</h1>
        {!showPopup && ( // Conditionally render the QR scanner if showPopup is false
          <div className="qrcode-scanner">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              facingMode="environment"
              style={{ width: '100%' }}
            />
          </div>
        )}

        {showPopup && (
          <div className="qrcode-popup">
            <div className="qrcode-popup-content">
              <h2>Result:</h2>
              <p>{result && result.text}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeScannerPage;
