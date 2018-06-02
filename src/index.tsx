import React from 'react';
import ReactDOM from 'react-dom';
import { render } from "react-dom";
import { Texture } from 'pixi.js';
import { Sprite, Stage, TilingSprite } from "react-pixi-fiber";

function Bunny(props: { x: number, y: number }) {
    return (
        <Sprite texture={Texture.fromImage('./bunny.png')} {...props} />
    );
}

render(
    <Stage width={800} height={600} options={{ 
        backgroundColor: 0x10bb99,
        forceCanvas: true,
    }}>
        <Bunny x={200} y={200} />
        <TilingSprite
            texture={Texture.fromImage('./bunny.png')}  
            width={300}
            height={100}
        />
    </Stage>,
    document.getElementById("container")
);
