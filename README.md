# getting started

You'll need node and npm to build and run the project . Look for download and installation instructions on [node.js](https://nodejs.org/en/).


Clone the project:

```sh
git clone https://github.com/nomad-coe/nomad-lab-homepage.git
```

Install dependencies:

```sh
cd nomad-lab-homepage
npm install
```

Run the development server:

```sh
npm run start
```

Open the page in your browser: http://localhost:8080.

To edit the project, we recommend vs studio code. The most important files are `src/index.html` and `styles.scss`.

This project uses google's [web implementation](https://m2.material.io/develop/web) of material design 2.

# deploy and access the page

## Github
Any change to the `main` brach, will trigger github actions to build and deploy the project. The
deployed project is run as a github page here: https://nomad-coe.github.io/nomad-lab-homepage/.


## Gitlab
The gitlab CI will build a docker image based on nginx that serves the page. The CI further deploys this image to the NOMAD kubernetes cluster.