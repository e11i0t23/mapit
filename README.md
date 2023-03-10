# Mapit

A custom google maps builder using the google maps javascdript api, for creating styled maps which can then be downloaded using the google maps static api. This App is a client only app therefore making use of firebase authentication and firestore for all backend functions.

## Running the application

### Development

To start this app first environmental variables will need to be setup in a .env.local file (see environment.d.ts for detail), when running in dev this app also makes use of firebase emulators.

Initialise Firebase with:

```bash
firebase init
```

Run the Emulators with:

```bash
firebase emulators:start
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

After setting environmental variables, build the app with:

```bash
npm run build
```

## Languages, Frameworks, and Tools Used

- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
  - [Bootsrap](https://getbootstrap.com/)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [Typescript](https://www.typescriptlang.org/)
  - [React](https://reactjs.org/)
  - [NextJS](https://nextjs.org/)
  - [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)
  - [static-google-map](https://github.com/DaddyWarbucks/static-google-map)
- [Git](https://git-scm.com/)
  - [Github](https://github.com/)
- [Netlify](https://www.netlify.com/)
- [firebase](https://firebase.google.com/)
- [Google Maps JS API](https://developers.google.com/maps/documentation/javascript)
- [Google Maps Static API](https://developers.google.com/maps/documentation/maps-static)

## File Tree and Overview

```Bash
├── README.md
├── environmnet.d.ts # Type Definitions for environmental variables
├── firebase.json
├── firestore.indexes.json
├── firestore.rules # Rules for firestore, must manually be set on firebase console
├── lib
│   ├── firebase.ts # Utility fucntions for initialising firebase
│   └── styles.ts # Simple export of the styles, features and elements the app suports
├── mapit.d.ts # Type definitons for the project
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── components
│   │   ├── CurveMarker.tsx # A Component to produce pretty arcs
│   │   ├── Header.tsx # The websites headers
│   │   ├── Map.tsx # The Map function rendering the map container
│   │   ├── MarkerAdder.tsx # The marker adjust sidebar
│   │   ├── Markers.tsx # A utility component to convert our markers array into a jsx elements array
│   │   └── Styles.tsx # The styles adjust sidebar component
│   └── index.tsx # The main entry page for the app
├── public
│   ├── favicon.ico
│   ├── next.svg
│   ├── thirteen.svg
│   └── vercel.svg
├── styles
│   ├── Home.module.css
│   ├── Styles.module.css
│   └── globals.css
└── tsconfig.json

```
