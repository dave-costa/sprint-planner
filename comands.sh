# RUN DATABASE
docker run --name planner \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=planner \
  -p 5432:5432 \
  -d postgres