# How to post a journalism article

Every article on [curingwithcare.org/journalism](https://curingwithcare.org/journalism) is one file in this folder. When a new file lands on the `main` branch, Vercel rebuilds the site and the article is live about a minute later.

Only people with write access to this GitHub repository can post. Visitors to the website cannot add or change anything.

## The easy way: Pages CMS (no code)

1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with your GitHub account.
2. Open the **CuringWithCareWebsite** repository and choose **Journalism** on the left.
3. Click **Add an entry**, fill in the fields, write the article, and click **Save**.

Saving publishes the article. To take one down, open it and turn on **Draft**, or delete it.

## The manual way: GitHub

1. In this folder on GitHub, click **Add file → Create new file**.
2. Name it after the article, lowercase with dashes, ending in `.md`: `talking-to-a-nurse-at-hillman.md`. That name becomes the web address: `/journalism/talking-to-a-nurse-at-hillman`.
3. Paste this at the top, fill it in, then write the article underneath:

```markdown
---
title: Talking to a nurse at Hillman
author: Jane Doe
role: CARE Journalism
date: 2026-10-22
summary: One or two sentences shown on the Journalism page.
cover: /journalism/talking-to-a-nurse-at-hillman/cover.jpg
coverAlt: A nurse standing in the lobby of the UPMC Hillman Cancer Center
---

The article starts here. Leave a blank line between paragraphs.

## A heading

> A quote from someone you interviewed.

- A list item
- Another one
```

4. Click **Commit changes** and commit directly to `main`.

**Photos:** upload them to `public/journalism/<article-name>/` (for example `public/journalism/talking-to-a-nurse-at-hillman/cover.jpg`) and refer to them as `/journalism/<article-name>/cover.jpg`. Keep photos under about 2 MB. To put a photo inside the article: `![What the photo shows](/journalism/talking-to-a-nurse-at-hillman/photo-1.jpg)`.

**Fields:** `title` is required. `author`, `role`, `date` (YYYY-MM-DD), `summary`, `cover` and `coverAlt` are optional but recommended. Add `draft: true` to keep an article off the site while you work on it.
