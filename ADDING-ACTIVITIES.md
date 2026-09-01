# Adding an activity to StudyShelf

StudyShelf is already configured so activities can be hosted locally from the same site.

## 1. Create the activity folder

Inside `public/activities/`, make a folder whose name matches the activity `id`:

```text
public/
└── activities/
    └── my-activity/
        ├── index.html
        ├── script.js
        ├── style.css
        └── assets/
```

The important file is `index.html`. It is the page StudyShelf opens.

If the activity has CSS, JavaScript, or images, keep them inside this folder and use relative paths, for example:

```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
<img src="assets/logo.png">
```

## 2. Add a thumbnail

Put the thumbnail in:

```text
public/thumbnails/my-activity.png
```

## 3. Register it in `src/data/activities.js`

Add one object to the `ACTIVITIES` array:

```js
{
  id: "my-activity",
  title: "My Activity",
  description: "A short description.",
  thumbnail: "/thumbnails/my-activity.png",
  url: "/activities/my-activity/index.html",
  tags: ["arcade", "classic"],
  featured: false,
  dateAdded: "2026-08-30",
},
```

There is no category field.

## 4. Final layout

```text
StudyShelf/
├── public/
│   ├── activities/
│   │   └── my-activity/
│   │       ├── index.html
│   │       ├── script.js
│   │       ├── style.css
│   │       └── assets/
│   └── thumbnails/
│       └── my-activity.png
└── src/
    └── data/
        └── activities.js
```

## Removing an activity

1. Delete its object from `src/data/activities.js`.
2. Delete its folder from `public/activities/`.
3. Delete its thumbnail from `public/thumbnails/`.

## Running the project in VS Code on Windows

Open the **StudyShelf folder** in Visual Studio Code.

Open **Terminal → New Terminal**, then run:

```bash
npm install
npm run dev
```

Open the local address Vite prints in the terminal, normally:

```text
http://localhost:5173
```
