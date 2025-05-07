import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaExternalLinkAlt } from "../SVG/index";
import Image from "next/image";

const PopUp = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notifySuccess = (msg: string) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg: string) => toast.error(msg, { duration: 2000 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you can add your own newsletter subscription logic
      // For now, just showing success message
      notifySuccess("Thanks for subscribing!");
      setEmail("");
    } catch {
      notifyError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade popup"
      id="popup_bid"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="image">
              <Image src="/assets/images/backgroup-section/popup.png" alt="Newsletter popup background" width={400} height={200} />
            </div>
            <div className="logo-rotate">
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={60}
                style={{
                  width: "60px",
                  height: "auto",
                }}
              />
            </div>
            <h2>Subscribe to our newsletter</h2>
            <p>Subscribe for our newsletter to stay in the loop</p>
            <fieldset className="email">
              <input
                className="style-1"
                placeholder="Email address*"
                tabIndex={2}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
                required
                type="email"
                id="email"
                name="email"
              />
            </fieldset>
            <div className="button_container_NEWLATER">
              <button
                type="submit"
                disabled={isSubmitting}
                className="tf-button style-2 h50 w190 mr-30"
              >
                Subscribe
                <FaExternalLinkAlt />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
