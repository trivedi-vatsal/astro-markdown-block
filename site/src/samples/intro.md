# Release checklist

Paste this into an agent, or read it here first. Use the **Markdown** button to see the raw source, and the copy button to grab it exactly as written.

## Before you tag

1. Run the full test suite on a clean checkout.
2. Bump the version in `package.json`.
3. Write the changelog entry. Keep it short and say what changed for users, not how.

## After you tag

- Watch the release workflow until it goes green.
- Install the new version in a scratch project and import it once.
- Link the release from the [changelog](https://keepachangelog.com/).

> If anything fails after publishing, deprecate the version with `npm deprecate` rather than unpublishing it.

```sh
git tag v0.1.0
git push origin v0.1.0
```
