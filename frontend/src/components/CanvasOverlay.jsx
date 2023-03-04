import React, { useRef, useEffect } from "react";

function CanvasOverlay(props) {
  // basically this will be drawn on top of an image element.
  const canvasRef = useRef(null);
  useEffect(() =>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#aa0000";
    ctx.fillRect(5, 0, 10, 10);
  }, []);

  return <canvas ref={canvasRef} className={props.className}/>;
}

export default CanvasOverlay;
