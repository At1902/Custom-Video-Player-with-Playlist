"use client";

import style from "@styles/GlobalError.module.css";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <main className={style.mainSection}>
          <h2>Something went wrong!</h2>
          <div className={style.buttonSection}>
            <button
              style={{
                textTransform: "capitalize",
                minWidth: "18%",
                fontSize: "1rem",
                ":hover": {
                  bgcolor: "rgba(128, 128, 128, 0.211)",
                },
                margin: "2rem 1rem",
              }}
              onClick={() => reset()}
            >
              Try Again
            </button>
            <Link href="/">
              <button
                style={{
                  textTransform: "capitalize",
                  minWidth: "18%",
                  fontSize: "1rem",
                  backgroundColor: "#F89A51",
                  ":hover": {
                    bgcolor: "#F89A51",
                  },
                  margin: "2rem 1rem",
                }}
              >
                Go Back
              </button>
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
