import React, { useState, useEffect } from "react";
import {
  GestureRecognizer,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import "./App.css";

function App() {
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [gestureOutput, setGestureOutput] = useState("");
  const [runningMode, setRunningMode] = useState("IMAGE");

  useEffect(() => {
    const initializeGestureRecognizer = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: runningMode,
        });

        setGestureRecognizer(recognizer);
      } catch (error) {
        // Handle the error here
        console.error("Error initializing gesture recognizer:", error);
        // Optionally, you could set a state to indicate an error occurred
        // setError(true);
      }
    };

    initializeGestureRecognizer();
  }, [runningMode]);

  const handleImageClick = async (event) => {
    if (!gestureRecognizer || !event) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }

    const file = event.target.files[0];
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = async () => {
      const results = await gestureRecognizer.recognize(image);
      if (results.gestures.length > 0) {
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(
          results.gestures[0][0].score * 100
        ).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;
        setGestureOutput(
          `GestureRecognizer: ${categoryName}\nConfidence: ${categoryScore}%\nHandedness: ${handedness}`
        );
      } else {
        setGestureOutput("No gesture detected");
      }
    };
  };

  return (
    <div className="App">
      <h1>Hand Gesture Recognition</h1>
      <div>
        <input type="file" accept="image/*" onChange={handleImageClick} />
      </div>
      <div id="gesture_output" style={{ whiteSpace: "pre-wrap" }}>
        {gestureOutput}
      </div>
    </div>
  );
}

export default App;
