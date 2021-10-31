import { Link, graphql, navigate } from "gatsby";
import React, { useEffect } from "react";
import { css } from "@emotion/react";
import "../styles/components/index.css";
import "../styles/components/typography.css";
import Layout from "../components/layout";
import {
  gradientBlack,
  gradientBlue,
  gradientGreen,
  gradientOrange,
  gradientPink,
  gradientYellowOrange,
  gradientYellow,
} from "../styles/variables";

export default () => {
  useEffect(() => {
    const boxItems = Array.from(document.getElementsByClassName("box-item"));
    const grads = [
      gradientYellow,
      gradientYellowOrange,
      gradientOrange,
      gradientPink,
    ];

    const handleMouseMove = (event) => {
      for (let i = 0; i < boxItems.length; i++) {
        boxItems[i].setAttribute(
          "style",
          `position: fixed; top: ${
            event.pageY * (1 / Math.pow(2, -(i + 1))) * 0.1
          }px; left: ${
            event.pageX * (1 / Math.pow(2, -(i + 1))) * 0.1
          }px; width: 200px; height: 100px; background-image: ${grads[i]}`
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    for (let i = 0; i < boxItems.length; i++) {
      boxItems[i].setAttribute(
        "style",
        `position: fixed; top: ${i * 200}px; left: ${
          i * 400
        }px; width: 200px; height: 100px; background-image: ${grads[i]}`
      );
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  /* useEffect(() => {
    const canvas = document.getElementById("canvas"); // 获取元素

    const ctx = canvas.getContext("2d"); // 获取元素的 context

    drawStuff({ pageX: 100, pageY: 100 }, ctx);
    window.addEventListener("mousemove", (event) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawStuff(event, ctx);
    });

    window.addEventListener("resize", resizeCanvas, false);
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    canvas.addEventListener("mousedown", handleCanvasMouseClick);

    function handleCanvasMouseClick(event) {
      console.log("[event]", event);
      let triggedIndex = -1;
      getElements(event.x, event.y).forEach(([x, y, width, height], index) => {
        if (
          event.x > x &&
          event.x < x + width &&
          event.y > y &&
          event.y < y + height
        ) {
          triggedIndex = index;
        }
      });
      console.log("[index]", triggedIndex);
      switch (triggedIndex) {
        case 0:
          navigate("/blog/");
          break;
        case 1:
          navigate("/about/");
          break;
        case 2:
          navigate("/contact/");
          break;
      }
    }

    const getElements = (x, y) => {
      return [
        [x / 10, y / 10, 150, 100],
        [200 + x / 50, 400 - y / 50, 150, 100],
        [800 + Math.sin(x), 300 - Math.sqrt(y * 3), 100, 150],
      ];
    };

    resizeCanvas();

    function drawStuff(event, ctx) {
      // console.log(event.pageX, event.pageY);

      ctx.fillStyle = "green"; // 拿到context就能够实现 HTMLCanvasElement 接口进行渲染了
      ctx.fillRect(event.pageX / 10, event.pageY / 10, 150, 100); // x, y, width, height
      ctx.fillStyle = "white";
      ctx.font = "18px helvetica";
      ctx.fillText("Blog", event.pageX / 10 + 50, event.pageY / 10 + 50);

      ctx.fillStyle = "black";
      ctx.fillRect(200 + event.pageX / 50, 400 - event.pageY / 50, 150, 100);
      ctx.fillStyle = "white";
      ctx.font = "18px helvetica";
      ctx.fillText("About", 250 + event.pageX / 50, 450 - event.pageY / 50);

      ctx.fillStyle = "white";
      ctx.fillRect(
        800 + Math.sin(event.pageX),
        300 - Math.sqrt(event.pageY * 3),
        100,
        150
      );
      ctx.fillStyle = "black";
      ctx.font = "18px helvetica";
      ctx.fillText(
        "Contact",
        820 + Math.sin(event.pageX),
        375 - Math.sqrt(event.pageY * 3)
      );

      ctx.fillStyle = "gray";
      // ctx.moveTo(500 + event.pageX / 10, 20 + event.pageY / 20);
      // ctx.lineTo(510 + event.pageX / 10, 20 + event.pageY / 20);
      // ctx.lineTo(200 + event.pageX / 50, 520 + event.pageY / 50);
      // ctx.lineTo(190 + event.pageX / 50, 520 + event.pageY / 50);
      // ctx.closePath();
      // ctx.fill();

      ctx.rotate((25 * Math.PI) / 180);
      ctx.fillRect(
        700 + Math.sqrt(event.pageX),
        -200 + Math.log1p(event.pageY),
        15,
        600
      );
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }, []); */

  return (
    <div
      className="container"
      style={{
        display: `flex`,
        backgroundImage: gradientBlack,
        width: "100vw",
        height: "100vh",
      }}
    >
      <canvas id="canvas"></canvas>
      <div className="box-item box-item-1"></div>
      <div className="box-item box-item-2"></div>
      <div className="box-item box-item-3">
        <Link
          to="/blog"
          style={{
            textShadow: `none`,
            backgroundImage: `none`,
          }}
        >
          <div
            style={{
              height: `100%`,
              width: `100%`,
              display: `flex`,
              justifyContent: `center`,
              alignItems: `center`,
            }}
          >
            <span
              style={{
                display: `inline`,
                color: `white`,
                fontFamily: `'Lobster', Helvetica`,
              }}
            >
              Johan Pan
            </span>
          </div>
        </Link>
      </div>
      <div className="box-item box-item-4"></div>
    </div>
  );
};
