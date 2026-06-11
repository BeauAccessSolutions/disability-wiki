// Wiki.js pages open with "# Title" in the body; Starlight renders the
// frontmatter title as the page H1, so the body H1 duplicates it.
// Strip the body's leading H1 at build time (content files stay untouched).
export function remarkStripLeadingH1() {
  return (tree) => {
    const first = tree.children.find((n) => n.type !== 'yaml');
    if (first && first.type === 'heading' && first.depth === 1) {
      tree.children.splice(tree.children.indexOf(first), 1);
    }
  };
}
