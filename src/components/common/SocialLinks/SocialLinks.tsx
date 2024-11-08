import * as React from "react";
import style from "./SocialLinks.module.scss";
import { links } from "../../B2_Vote/links";
import { FC } from "react";
import clsx from "clsx";

interface ISocialLinks {
  className: string;
}

export const SocialLinks: FC<ISocialLinks> = ({ className }) => {
  return (
    <div className={clsx(style.socialLinks, className)}>
      {links.map(({ icon, icon_hover, href }, key) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={style.link}
        >
          <img src={icon} alt="" className={style.icon} />
          <img src={icon_hover} alt="" className={style.icon_hover} />
        </a>
      ))}
    </div>
  );
};
