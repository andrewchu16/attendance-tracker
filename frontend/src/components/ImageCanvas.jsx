import React, { useRef, useEffect } from 'react'

function ImageCanvas() {
    const canvasRef = useRef(null)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = '#000000'
        ctx.fillRect(30, 50, 20, 20)
    };
    img.src = "backdrop.png";

    
    return <canvas ref={canvasRef} {...props}/>
}

export default ImageCanvas