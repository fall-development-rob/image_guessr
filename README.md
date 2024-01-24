# GenGuessr: Gendo Tech Task

Task instructions can be found [here](https://docs.google.com/document/d/1Sv_0liAbUFcOu9dK0m4UmJfFraB4k9Od4Yt9gnvlTXc/edit?usp=sharing).

![Screenshot of GenGuessr.](/genguessr.png)

This repository was built using this [template](https://github.com/digitros/nextjs-fastapi).

## Requirements

* Node (developed using v20.8.0)
* Python (developed using 3.11.6)
* [pnpm](https://pnpm.io/)

## Usage

Create a copy of `.env.example` in the root of the project and rename it to `.env.local`.

To install the required dependencies:

```
pnpm install
```

To start the application for local dev:

```
pnpm dev
```

The application will then be available at http://localhost:3000 and the API at http://localhost:8000.

Swagger docs for the API can be found at: http://localhost:8000/docs

To keep things simple for the task, `pnpm dev` starts both the Next application **and** the Python API (with hot reloading). You're welcome to add docker to the project and run them as two containers, if you'd prefer.

## Refactor

- Removed the python code into a seperate repo, to abide by seperation of concern and to keep it more manageable. 
- Removed pnpm in favor of NPM due to the packages already being version locked and there being no needed for the added complexity of pnpm.