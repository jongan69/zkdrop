import React from "react";

import {
  TiSocialVimeo,
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
} from "../SVG/index";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-12">
            <div className="footer-content flex flex-grow">
              <div className="widget-logo flex-grow">
                <div className="logo-footer" id="logo-footer">
                  <a href="/">
                    <img
                      id="logo_footer"
                      src="logo.png"
                      style={{
                        width: "60px",
                        height: "auto",
                      }}
                    />
                  </a>
                </div>
              </div>
              <div className="widget widget-menu style-1">
                <h5 className="title-widget">Learn More</h5>
                <ul>
                  <li>
                    <a href="#">ZK Compression</a>
                  </li>
                  <li>
                    <a href="#">ZK Proofs</a>
                  </li>
                </ul>
              </div>
              <div className="widget widget-menu style-2">
                <h5 className="title-widget">Resource</h5>
                <ul>
                  <li>
                    <a href="#">Whitepaper</a>
                  </li>
                </ul>
              </div>
              <div className="widget widget-menu style-3">
                <h5 className="title-widget">Account</h5>
                <ul>
                  <li>
                    <a href="#">My Collections</a>
                  </li>
                </ul>
              </div>
              <div className="widget-last">
                <div className="widget-menu style-4">
                  <h5 className="title-widget">Company</h5>
                  <ul>
                    <li>
                      <a href="#">Help center</a>
                    </li>
                    <li>
                      <a href="#">Platform status</a>
                    </li>
                  </ul>
                </div>
                <h5 className="title-widget mt-30">Join the community</h5>
                <div className="widget-social">
                  <ul className="flex">
                    {/* <li>
                      <a href="#">
                        <TiSocialFacebook />
                      </a>
                    </li> */}
                    {/* <li>
                      <a href="#">
                        <TiSocialLinkedin />
                      </a>
                    </li> */}
                    <li>
                      <a href="https://x.com/LightProtocol">
                        <TiSocialTwitter />
                      </a>
                    </li>
                    {/* <li>
                      <a href="#">
                        <TiSocialYoutube />
                      </a>
                    </li> */}
                    {/* <li>
                      <a href="#">
                        <TiSocialVimeo />
                      </a>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 ZK Compression Hackathon Submission</p>
          <ul className="flex">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
