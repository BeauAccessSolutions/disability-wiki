// Wiki.js-era pages pin heading anchors with a trailing `{#id}` attribute
// (`## Canadá {#canada}`) so Spanish pages keep the English anchors that
// cross-page links target. Plain CommonMark doesn't know that syntax: the
// literal `{#canada}` rendered in the heading text and was slugged into the id,
// leaving every `#canada` link dead. Honor it: strip the suffix from the text
// and set it as the heading id (Astro's heading-id pass keeps an existing id).
//
// The id is read from the raw source when positions are available: smartypants
// runs before user plugins and turns `{#track--field}` into `{#track—field}`
// in the text node, which would silently change the anchor.
const ATTR = /\s*\{#([^\s{}]+)\}\s*$/;

export function remarkHeadingIds() {
  return (tree, file) => {
    const source = typeof file?.value === 'string' ? file.value : null;
    const visit = (node) => {
      if (node.type === 'heading') {
        const last = node.children[node.children.length - 1];
        const m = last && last.type === 'text' ? ATTR.exec(last.value) : null;
        if (m) {
          const { start, end } = node.position || {};
          const raw = source && start && end ? ATTR.exec(source.slice(start.offset, end.offset)) : null;
          last.value = last.value.slice(0, m.index);
          if (!last.value) node.children.pop();
          node.data = node.data || {};
          node.data.hProperties = { ...(node.data.hProperties || {}), id: (raw || m)[1] };
        }
        return;
      }
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
  };
}
