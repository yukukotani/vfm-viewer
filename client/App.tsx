import React, { useState, useEffect } from "react";
import { VFM } from "@vivliostyle/vfm";

import { Renderer } from "@vivliostyle/react";

const processor = VFM({ partial: true, language: "ja" });

function markdownToUrl(markdown: string): string {
  const html = processor.processSync(markdown).toString();
  const raw = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
${html}
</body>
</html>`;
  console.log(raw);
  return URL.createObjectURL(
    new Blob([raw], {
      type: "text/html",
    })
  );
}

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");
  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3000/events`);

    eventSource.onmessage = (e) => {
      setMarkdown(JSON.parse(e.data).markdown);
    };
  });

  if (!markdown) {
    return <>"loading"</>;
  }

  return (
    <Renderer
      source={markdownToUrl(markdown)}
      page={1}
      renderAllPages={true}
      autoResize={true}
      onMessage={(msg, type) => {
        console.log(type, msg);
      }}
    />
  );
};

export default App;
