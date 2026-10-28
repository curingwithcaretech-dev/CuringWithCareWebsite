# How to post a journalism article

Every article on [curingwithcare.org/journalism](https://curingwithcare.org/journalism) is one file in this folder. When a new file lands on the `main` branch, Vercel rebuilds the site and the article is live about a minute later.

Only people the board has invited can post. Visitors to the website cannot add or change anything.

## Posting with Pages CMS (no code)

1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with the email address you were invited with. (If you have a GitHub account with access to this repository, sign in with GitHub instead.)
2. Open the **CuringWithCareWebsite** repository and choose **Journalism** on the left.
3. Click **Add an entry**, fill in the fields, write the article, and click **Save**.

Saving publishes the article. To take one down, open it and turn on **Draft**, or delete it.

### Photos

- Upload photos straight from your phone or computer as **JPEG, PNG or WebP, at any size**. When the site builds it resizes each photo to web size (at most 1800px on the long side) and removes the camera's hidden data, including the location it was taken, so there is nothing to prepare first.
- iPhone photos saved as **HEIC** cannot be used. Share the photo from the Photos app and choose JPEG, or set *Settings → Camera → Formats* to *Most Compatible* so new photos are JPEGs.
- The **cover photo** is shown wide (16:9) at the top of the article and on the Journalism page, so choose a landscape photo with the subject near the middle.
- To put a photo inside the article, use the image button in the editor. Fill in the description: it is read aloud to people who use screen readers. If you give the photo a title, it appears as a caption underneath.

## Giving someone access (board only)

Open the repository in Pages CMS and invite the person as a **collaborator** by email. They then sign in with that email and can only add and edit Journalism entries and photos; they cannot change the site's code, settings or who else has access. Remove them from the same place. People with write access to this GitHub repository can always sign in with GitHub.

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

![What the photo shows](/journalism/talking-to-a-nurse-at-hillman/photo-1.jpg "A caption under the photo")
```

4. Click **Commit changes** and commit directly to `main`.

**Photos:** upload them to `public/journalism/<article-name>/` (for example `public/journalism/talking-to-a-nurse-at-hillman/cover.jpg`) and refer to them as `/journalism/<article-name>/cover.jpg`. Any size is fine; the build resizes them.

**Fields:** `title` is required. `author`, `role`, `date` (YYYY-MM-DD), `summary`, `cover` and `coverAlt` are optional but recommended. Add `draft: true` to keep an article off the site while you work on it.
