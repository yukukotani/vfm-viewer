import React, { useState, useEffect, useCallback } from "react";
import { VFM } from "@vivliostyle/vfm";

import { Renderer } from "@vivliostyle/react";

const url = window.location.origin;

const processor = VFM({ partial: true, language: "ja" });

function markdownToUrl(markdown: string): string {
  const html = processor.processSync(markdown).toString();
  const raw = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" type="text/css" href="${url}/client/theme.css" />
</head>
<body>
${html}
</body>
</html>`;
  return URL.createObjectURL(
    new Blob([raw], {
      type: "text/html",
    })
  );
}

const App: React.FC = () => {
  const [src, setSrc] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number | undefined>(undefined);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && totalPage && totalPage > page) {
        setPage((page) => page + 1);
      } else if (e.key === "ArrowLeft" && page > 1) {
        setPage(page - 1);
      }
    },
    [page, totalPage]
  );

  useEffect(() => {
    const eventSource = new EventSource(`${url}/events`);

    eventSource.onmessage = (e) => {
      setSrc(markdownToUrl(JSON.parse(e.data).markdown));
    };
  }, []);

  useEffect(() => {
    if (!totalPage) {
      return;
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {});

  if (!src) {
    return <>"loading"</>;
  }

  return (
    <div>
      <Renderer
        source={src}
        page={page}
        onMessage={(msg, type) => {
          console.log(type, msg);
        }}
        onLoad={(state) => {
          setTotalPage(state.epageCount);
          console.log(state.epage, state.epageCount, state.docTitle);
        }}
      />
    </div>
  );
};

export default App;
