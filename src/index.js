const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepo(request, response, next) {
  const { id } = request.params;

  const repository = repositories.findIndex(repository => repository.id === id);

  if (repository === -1) {
    return response.status(404).json({ error: "This repository not found" });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "This repository not found" });
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checksExistsRepo, (request, response) => {
  const { repository } = request;

  repositories.splice(repository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepo, (request, response) => {
  const { repository } = request;

  repositories[repository].likes++;

  return response.status(201).json(repositories[repository]);
});

module.exports = app;
