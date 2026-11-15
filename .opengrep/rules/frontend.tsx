// Fixtures for frontend.yml, run with `opengrep test .opengrep/rules`.
import { trustHTML } from "octane";

declare const reply: string;
declare const node: HTMLElement;
declare const frame: HTMLIFrameElement;
declare const range: Range;

export function Sinks() {
  // ruleid: frontend-raw-html-sink
  node.innerHTML = reply;
  // ruleid: frontend-raw-html-sink
  node.outerHTML = reply;
  // ruleid: frontend-raw-html-sink
  frame.srcdoc = reply;
  // ruleid: frontend-raw-html-sink
  node.insertAdjacentHTML("beforeend", reply);
  // ruleid: frontend-raw-html-sink
  range.createContextualFragment(reply);
  // ruleid: frontend-raw-html-sink
  document.write(reply);
  // ok: frontend-raw-html-sink
  node.textContent = reply;
  // ok: frontend-raw-html-sink
  const html = node.innerHTML;
  return (
    <section>
      {/* ruleid: frontend-raw-html-sink */}
      <div class="a" dangerouslySetInnerHTML={{ __html: reply }} />
      {/* ruleid: frontend-raw-html-sink */}
      <div dangerouslySetInnerHTML={trustHTML(html)}></div>
      {/* ok: frontend-raw-html-sink */}
      <p>{reply}</p>
    </section>
  );
}

export function Code() {
  // ruleid: frontend-code-from-string
  eval(reply);
  // ruleid: frontend-code-from-string
  new Function("a", reply);
  // ruleid: frontend-code-from-string
  setTimeout("alert(1)", 10);
  // ok: frontend-code-from-string
  setTimeout(() => node.focus(), 10);
}

export function Links() {
  return (
    <nav>
      {/* ruleid: frontend-javascript-url */}
      <a href="javascript:void(0)">x</a>
      {/* ruleid: frontend-javascript-url */}
      <a href=" JavaScript:alert(1)">y</a>
      {/* ok: frontend-javascript-url */}
      <a href="https://github.com/">z</a>
    </nav>
  );
}
