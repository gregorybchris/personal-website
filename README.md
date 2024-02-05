# Personal Website

## About

In 2012 I followed a tutorial series from [thenewboston](https://www.youtube.com/watch?v=k3dJKtQmyd0&list=PLC1322B5A0180C946&index=2) to create my first web page. In those days [Ruby on Rails](https://rubyonrails.org) was just reaching peak popularity, but most introductory resources still focused on [PHP](https://www.php.net). The popular tutorials on [w3schools](https://www.w3schools.com/php) guided me seamlessly from static HTML and CSS to fully interactive websites. To take my websites public I set up a simple [MAMP server](https://www.mamp.info/en/mac) on an old computer in my basement, my first foray into networking and server configuration. Setting up a server from scratch was extremely educational, but the process was just too tedious to keep up, so I bit the bullet and invested in a web hosting service with a brand new domain name.

In 2013 my online portfolio went live at the ironically named ChrisOffline.com and I was extremely proud of the self-teaching that went into the final product. The creativity of graphical programming combined with the connectivity of the open internet had me hooked.

Every few years since that initial release I've recreated my website totally from scratch, each time adding more technologies to my web development toolkit. The latest reincarnation of my website lives at [ChrisGregory.me](https://www.chrisgregory.me) and uses [TypeScript](https://www.typescriptlang.org), [React](https://reactjs.org), and [Vite](https://vitejs.dev) for the UI and [Python](https://www.python.org) and [FastAPI](https://fastapi.tiangolo.com) for the API. The UI is hosted on [Vercel](https://vercel.com) and the API on [Fly.io](https://fly.io). Some additional CDN requirements are handled by [Cloudflare](https://www.cloudflare.com).

## Contributions

While I'm not sure why in the world anyone might want to contribute to my personal portfolio and website, contributions are welcome and appreciated! Please [fork and create a pull request](https://guides.github.com/activities/forking). If you find a bug please feel free to file an issue on this repository.

## Running in Development Mode

### Backend

Requirements:

- [Python](https://www.python.org)
- [Poetry](https://python-poetry.org)

```bash
cd backend
poetry install
poetry run uvicorn chris.app.app:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

Requirements:

- [node](https://nodejs.org)
- [pnpm](https://pnpm.io)
- [A modern web browser](https://www.google.com/chrome)

```bash
cd frontend
pnpm install
pnpm run dev
```
