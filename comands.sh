# roda um novo banco
docker run --name planner \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=planner \
  -p 5432:5432 \
  -d postgres


# Apaga todas as migrações
rm -rf prisma/migrations

# Reseta o banco de dados (apaga todas as tabelas)
npx prisma migrate reset --force --skip-seed

# Cria uma nova migração baseada no schema.prisma
npx prisma migrate dev --name init
