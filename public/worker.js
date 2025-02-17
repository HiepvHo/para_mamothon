// public/worker.js
self.onmessage = function(event) {
    // Logic xử lý của Web Worker
    console.log('Worker received message:', event.data);
    postMessage({ result: 'Message received by worker', originalData: event.data });
  };
  