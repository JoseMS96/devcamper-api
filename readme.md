# API Node: DevCamper

> Backend para a aplicação DevCamper, que é um website de bootcamps e cursos.

## Website para acesso

https://devcamper-api-prod.onrender.com

## Como Usar (Ao clonar repositório)

- Altere "config/config.env.env" para "config.env" e atualize os valores/configurações para os teus próprios
- O arquivo dc.postman_collection.json permite importar as rotas JSON, todas pre-configuradas

## Seeder do Banco de Dados

Para popular o banco de dados com usuários, bootcamps, cursos e avaliações(reviews) utilize:

```
# Importar todos dados da pasta _data
node seeder -i

# Deletar todos os dados do BD
node seeder -d
```

## Instalação de Dependências

```
npm install
```

## Executar a aplicação

```
# Executar em ambiente de desenvolvimento

npm run dev

# Executar em ambiente de produção

npm start
```

## Documentação

https://documenter.getpostman.com/view/23760664/2sA3s9EU8E

- Versão 1.0.0
- Licença: MIT
