import React, { useState, useEffect } from "react";
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
  const [count, setCount] = useState(1);
  useEffect(() => {
    const eventSource = new EventSource(`${url}/events`);

    eventSource.onmessage = (e) => {
      setSrc(markdownToUrl(JSON.parse(e.data).markdown));
    };
  }, []);

  if (!src) {
    return <>"loading"</>;
  }

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <Renderer
        source={src}
        page={count}
        onMessage={(msg, type) => {
          console.log(type, msg);
        }}
        onLoad={(state) => {
          console.log(state.epage, state.epageCount, state.docTitle);
        }}
      />
    </div>
  );
};

export default App;
