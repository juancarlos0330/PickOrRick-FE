import * as React from "react";
import style from "./Video.module.scss";
import video from "../../assets/png/B5_Video/video.png";
import { svgIcons } from "../../assets/svgIcons";
import group from "../../assets/png/B3_About/group.png";
import Arrow from "../../assets/png/B5_Video/arrow.png";
import ReactPlayer from "react-player";
// @ts-ignore
import src from "../../assets/mp4/src.mp4";
import { useState, useRef, useEffect } from "react";

const text =
  "The King of all meme coins backed by the biggest degens in the world... The Rick & Morty community!";

const Video = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [firstStatus, setFirstStatus] = useState(false);
  const [fullscreenStatus, setFullscreenStatus] = useState(false);

  useEffect(() => {
    const videoElement: any = document.getElementById("videoId");
    videoElement?.addEventListener("fullscreenchange", function (event: any) {
      console.log("Hello");
      if (document.fullscreenElement === null) {
        setFullscreenStatus(false);
      }
    });
  }, []);

  const onClick = () => {
    setPlaying(true);
    setPlayed(true);
    setFirstStatus(true);
  };

  const onEnd = () => {
    setPlaying(false);
    setPlayed(false);
    setFirstStatus(false);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const fullscreenMode = () => {
    const elements: any = document.getElementById("videoId");
    setFullscreenStatus(true);
    if (elements.requestFullscreen) {
      elements.requestFullscreen();
    } else if (elements.webkitRequestFullscreen) {
      /* Safari */
      elements.webkitRequestFullscreen();
    } else if (elements.msRequestFullscreen) {
      /* IE11 */
      elements.msRequestFullscreen();
    }
  };

  return (
    <div className={style.video}>
      <img src={group} alt="" className={style.mobile} />
      <img src={group} alt="" className={style.desktop} />
      <h2 className={style.title}>CLICK</h2>
      <div className={style.arrowdiv}>
        <img src={Arrow} alt="" className={style.arrow} />
      </div>
      <div className={style.videoWrapper}>
        <img
          src={video}
          style={{
            display: played ? "none" : "block",
            zIndex: 100,
          }}
          alt=""
          className={style.preview}
        />
        <ReactPlayer
          id="videoId"
          ref={playerRef}
          playing={playing}
          url={src}
          controls={fullscreenStatus}
          height="100%"
          width="100%"
          onEnded={onEnd}
        />
        {!playing && (
          <button
            className={style.playBtn}
            onClick={onClick}
            style={{ display: !firstStatus ? "block" : "" }}
          >
            {svgIcons.play}
          </button>
        )}
        {playing && (
          <button className={style.pauseBtn} onClick={onPause}>
            {svgIcons.pause}
          </button>
        )}
        <button className={style.fullscreenBtn} onClick={fullscreenMode}>
          {svgIcons.fullscreen}
        </button>
      </div>

      <p className={style.text}>{text}</p>
    </div>
  );
};

export default Video;
