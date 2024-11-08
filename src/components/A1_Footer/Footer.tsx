import * as React from "react";
import style from "./Footer.module.scss";
import {SocialLinks} from "../common/SocialLinks/SocialLinks";

export const Footer = () => {
    return (
        <footer className={style.footer}>

            <div className={style.texts}>
                <p>PICK or RICK © 2023</p>
                <p>Contacts</p>
            </div>

            <SocialLinks  className={style.socialLinks}/>

        </footer>
    )
}
