# Personal Website

## About

In 2012 I followed a tutorial series from [thenewboston](https://www.youtube.com/watch?v=k3dJKtQmyd0&list=PLC1322B5A0180C946&index=2) to create my first web page. But static HTML and CSS didn't satisfy my creative inclinations for long and I soon realized that resources for learning dynamic web development were everywhere. In those days [Ruby on Rails](https://rubyonrails.org/) was just reaching peak popularity, but many of the introductory learning resources pointed to PHP. And [w3schools](https://www.w3schools.com/php/) had everything you needed to go from plain HTML/CSS to fully interactive websites. After hacking on a [MAMP server](https://www.mamp.info/en/mac/) in my basement I decided it was about time to bite the bullet and invest in a domain name and web hosting service.

In 2013 my personal portfolio website went live at ChrisOffline.com. While I caught a lot of flak for both the ironic name and even having my own website in high school, I was extremely proud of the self-teaching that went into publishing my own code to the [open internet](http://www.theopeninter.net/). There's something intoxicating about the creative power that graphical programming provides. When that ability meets the scale of the internet there's no going back.

About once a year since I've recreated my website from scratch, each time adding more technologies to my web development toolkit. The latest reincarnation of my website lives at [ChrisGregory.me](http://www.ChrisGregory.me) and is hosted on [Microsoft's Azure cloud](https://azure.microsoft.com/en-us/).

## Deployment

The [YAML deployment pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema) for this website can be found at [backend/pipelines](http://github.com/gregorybchris/personal-website/tree/main/backend/pipelines) and [frontend/pipelines](http://github.com/gregorybchris/personal-website/tree/main/frontend/pipelines) in this repository. They will run whenever new code is checked into the `main` branch and each pipeline will push a [Docker](https://www.docker.com/) image to an [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/). Those images are automatically picked up by an [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/) to provide continuous deployment.

## Contributions

While I'm not sure why in the world one might want to contribute to my personal portfolio and website, contributions are welcome and appreciated! Please [fork and create a pull request](https://guides.github.com/activities/forking/). If you find a bug please feel free to file an issue on this repository.

## Running in Development Mode

### Backend

Requirements:

- [Python](https://www.python.org/) >= 3.7
- [pip](https://pip.pypa.io/en/stable/)
- [virtualenv](https://virtualenv.pypa.io/en/stable/) or [conda](https://docs.conda.io/en/latest/miniconda.html)

```bash
# Install
pip install -e backend/src/chris_package/

# Start
cgme app
```

### Frontend

Requirements:

- [npm](https://www.npmjs.com/get-npm)
- [A modern web browser](https://www.microsoft.com/en-us/edge)

```bash
# Install
npm install frontend

# Start
cd frontend/app
npm start
```
