import { Link, graphql, navigate } from "gatsby";
import React, { useEffect } from "react";
import { css, cx } from "@emotion/react";
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

import mouth from "../images/mouth.jpg";

export default () => {
  useEffect(() => {
    const boxItems = Array.from(document.getElementsByClassName("box-item"));
    const eyeballs = document.getElementsByClassName("eyeball");

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
          `position: absolute; 
          top: ${
            (200 + 0.4 * event.pageY) * (1 / Math.pow(1.6, -(i + 1))) * 0.1
          }px; 
          left: ${
            (400 + 0.4 * event.pageX) * (1 / Math.pow(1.6, -(i + 1))) * 0.1
          }px; 
          width: ${200 * (1 / Math.pow(1.3, -(i + 1))) * 0.4}px; 
          height: ${100 * (1 / Math.pow(1.3, -(i + 1))) * 0.4}px; 
          border-radius: 8px;
          box-shadow: 2px 2px 10px rgba(0,0,0,.4);
          background-image: ${grads[i]};
          `
        );
      }
      for (const eyeball of eyeballs) {
        const cx = 50 + 0.1 * event.pageX * (1 / Math.pow(1.6, -(1 + 1))) * 0.1;
        const cy = 50 + 0.1 * event.pageY * (1 / Math.pow(1.6, -(1 + 1))) * 0.1;

        eyeball.setAttribute("cx", cx > 85 ? 85 : cx);
        eyeball.setAttribute("cy", cy > 85 ? 85 : cy);
      }
    };

    const addMouseMove = () =>
      window.addEventListener("mousemove", handleMouseMove);
    const removeMouseMove = () =>
      window.removeEventListener("mousemove", handleMouseMove);

    for (const eyeball of eyeballs) {
      eyeball.addEventListener("mouseenter", addMouseMove);
      eyeball.addEventListener("click", removeMouseMove);
    }

    for (let i = 0; i < boxItems.length; i++) {
      boxItems[i].setAttribute(
        "style",
        `position: absolute; 
        top: ${(200 + 0.2 * 500) * (1 / Math.pow(1.6, -(i + 1))) * 0.1}px; 
        left: ${(400 + 0.2 * 500) * (1 / Math.pow(1.6, -(i + 1))) * 0.1}px; 
        width: ${200 * (1 / Math.pow(1.3, -(i + 1))) * 0.4}px; 
        height: ${100 * (1 / Math.pow(1.3, -(i + 1))) * 0.4}px; 
        border-radius: 8px;
        box-shadow: 2px 2px 10px rgba(0,0,0,.4);
        background-image: ${grads[i]};`
      );
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      eyeballs.forEach((eyeball) => {
        eyeball.removeEventListener("mouseenter", addMouseMove);
        eyeball.removeEventListener("mouseenter", removeMouseMove);
      });
    };
  }, []);

  return (
    <div
      className="container"
      style={{
        display: `block`,
        backgroundImage: gradientBlack,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Desc />
      <Eyeball top={20} left={"- 60px"} />
      <Eyeball top={20} left={"+ 60px"} />
      <div
        className="mouth"
        css={css`
          & {
            position: absolute;
            left: 30%;
            top: calc(30% + 30px);
            transform: translate(-36%, 0);
          }
        `}
      >
        <img src={mouth} width="200px" height="150px" />
      </div>
      <div
        className="box-wrap"
        css={css`
          & {
            position: relative;
            top: 30%;
            left: 30%;
          }
        `}
      >
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
              css={css`
                & {
                  position: relative;
                  height: 100%;
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  &:hover::after {
                    content: "";
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0, 0, 0, 0.1);
                  }
                }
              `}
            >
              <span
                style={{
                  display: `inline`,
                  color: `#891548`,
                  fontSize: "32px",
                  fontFamily: "Georgia, serif",
                }}
              >
                Blog
              </span>
            </div>
          </Link>
        </div>
        <div className="box-item box-item-4"></div>
      </div>
    </div>
  );
};

const Eyeball = ({ top, left }) => {
  return (
    <div
      css={css`
        & {
          position: absolute;
          left: calc(30% ${left});
          top: ${top}%;
          transform: translate(-30%, -30%);
          // box-shadow: 0 0 40px white;
          border-radius: 8px;
          padding: 10px;
          font-size: 18px;
          color: #cd6191;
          font-family: Lobster, Heveltica;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}
    >
      <svg width="100px" height="100px">
        <circle className="eye" cx="50" cy="50" r="50" fill="white" />
        <circle className="eyeball" cx="50" cy="50" r="15" fill="black" />
      </svg>
    </div>
  );
};

const Desc = () => {
  return (
    <div
      css={css`
        & {
          position: fixed;
          left: 0;
          top: 0;
          padding: 30px;
        }
      `}
    >
      <div
        className="title"
        css={css`
          & {
            font-size: 28px;
            color: #d0d0d0;
            font-family: Lobster, Heveltica;
          }
        `}
      >
        <span
          css={css`
            & {
              font-family: Lobster, Heveltica;
            }
          `}
        >
          Johan Pan
        </span>
        <span
          css={css`
            & {
              font-family: Georgia, serif;
            }
          `}
        >
          's Borderland
        </span>
      </div>
    </div>
  );
};
