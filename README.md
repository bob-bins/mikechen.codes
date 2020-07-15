# mikechen.codes

My work-in-progress [personal site](https://www.mikechen.codes), coded from scratch with love.

## M1 local development

### Install npm packages

```
arch -x86_64 yarn install
```

### Local deploy

```
docker buildx build --platform linux/amd64 -t registry.heroku.com/mike-chen-codes/web .
docker push registry.heroku.com/mike-chen-codes/web
heroku container:release web -a mike-chen-codes
```
