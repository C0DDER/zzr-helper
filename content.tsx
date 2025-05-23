import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import "./styles.css";

import { StorageKeys } from "~constants";

export const config: PlasmoCSConfig & {
  exclude_globs: string[];
  include_globs: string[];
} = {
  matches: ["https://dev.azure.com/*"],
  all_frames: true,
  include_globs: [],
  exclude_globs: []
};

type TeamProgress = {
  active: number;
  resolved: number;
  notStarted: number;
};

function Content() {
  const [teamProgress, setTeamProgress] = useState<TeamProgress | null>(null);

  const [isShowContent, setIsShowContent] = useStorage<boolean>(
    StorageKeys.ShowContent,
    false
  );

  const calculateProgress = () => {
    const tableRows = document.querySelectorAll(".grid-row-normal");

    const calculatedProgress = [...tableRows].reduce(
      (acc, row) => {
        const children = Array.from(row.childNodes);

        // @ts-ignore
        const status = children[3].innerText;
        // @ts-ignore
        const storyPoints = +children[6].innerText;

        switch (status) {
          case "Closed":
            acc.resolved = acc.resolved + storyPoints;
            break;

          case "Active":
            acc.active = acc.active + storyPoints;
            break;

          case "Resolved":
            acc.resolved = acc.resolved + storyPoints;
            break;

          default:
            acc.notStarted = acc.notStarted + storyPoints;
            break;
        }

        return acc;
      },
      {
        active: 0,
        resolved: 0,
        notStarted: 0
      }
    );

    setTeamProgress(calculatedProgress);
  };

  useEffect(() => {
    setTimeout(() => {
      const rootContainer = document.querySelector(".plasmo-csui-container");

      if (rootContainer) {
        rootContainer.classList.add("custom-container");
      }
    }, 3000);
  }, []);

  return (
    <>
      {isShowContent ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "absolute",
            width: "380px",
            bottom: 0,
            right: 0
          }}>
          <div
            style={{
              backgroundColor: "#27272a",
              padding: "25px",
              borderRadius: "14px"
            }}>
            {teamProgress ? (
              <div
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                <div
                  style={{
                    marginBottom: "10px",
                    fontFamily: "Arial"
                  }}>
                  <div>
                    <strong>To do:</strong> {teamProgress.notStarted}
                  </div>
                  <div>
                    <strong>Active:</strong> {teamProgress.active}
                  </div>
                  <div>
                    <strong>Resolved:</strong> {teamProgress.resolved}
                  </div>
                </div>
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px"
              }}>
              <button
                onClick={calculateProgress}
                style={{
                  backgroundColor: "white",
                  padding: "10px 15px",
                  color: "#27272a",
                  cursor: "pointer",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "10px"
                }}>
                Calculate team progress
              </button>
              <a
                style={{
                  color: "white",
                  fontSize: "16px",
                  border: "1px solid white",
                  borderRadius: "10px",
                  padding: "10px 15px",
                  textDecoration: "none"
                }}
                target="__blank"
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                Useful link
              </a>
              <button
                onClick={() => setIsShowContent(false)}
                style={{
                  background: "none",
                  color: "#FF5454",
                  cursor: "pointer",
                  fontSize: "18px",
                  border: "none",
                  padding: 0,
                  height: "fit-content",
                  width: "fit-content",
                  position: "absolute",
                  right: "5px",
                  top: "5px"
                }}>
                &#x2715;
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = `
    .plasmo-csui-container {
      top: unset !important;
      left: unset !important;
      bottom: 0px;
      right: 0px;
    }
    
    #plasmo-shadow-container {
      position: absolute !important;
      bottom: 0px;
      right: 0px;
    }
  `;
  return style;
};

export default Content;
