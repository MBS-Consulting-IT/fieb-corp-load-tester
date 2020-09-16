<p align="center">
  <h2 align="center">Teste de Carga</h2>

  <p align="center">
    Aplicação para teste de carga no Orquestra BPM com uso de webservices nativos
  </p>
  <br>
</p>


## Sumário

* [Sobre a aplicação](#sobre-a-aplicação)
  * [Construído com](#construido-com)
* [Iniciando a aplicação](#iniciando-a-aplicacao)
  * [Pré-requisitos](#pre-requisitos)
  * [Instalação](#instalacao)
* [Utilização](#utilizacao)



## Sobre a aplicação

Aplicação web para a geração de instâncias no Orquestra BPM utilizando os webservices nativos das APIs SOAP e RESTful, utilizando estratégias distintas para lidar com alto volume de requisições.

Alternativas Implementadas:
* **RESTful:** chamadas recursivas, respeitando o tempo de resposta do servidor de aplicação. Estratégia mais conservadora, gerando maior tempo para processamento de grandes volumes, contudo, menor custo de processamento. Cabe ressaltar que a API RESTful não aceita múltiplas conexões, o que obriga o uso dessa estratégia.

* **SOAP:** chamadas em `chunks` com uso de delay progressivo entre cada `chunk` de requisições. Cabe ressaltar que o cenário ideal é realizar as requisições fora do _browser_ visto que este limita o número de conexões simultâneas de um único _host_ (4~6 conexões, de acordo com o _browser_), enquanto o protocolo HTTP/TCP não impõe esta restrição.

Outras Alternativas (não implementadas):
* Utilizar chamadas em `chunks` com uso de delay progressivo entre as **requisições** (ao invés de colocar o intervalo entre os `chunks`).

* Utilizar estratégias com delay linear, seja entre `chunks` (somente se aplica quando os `chunks` estiverem próximos ao tempo de resposta do servidor, caso contrário o delay passa a ser insignificante) ou entre requisições.

* Utilizar chamadas em `chunks` junto com uso de `Promise.all` entre `chunks` para desonerar processamento.

Cabe destacar que a estratégia utilizada deve estar alinhada a capacidade de resposta do servidor, já que o os objetivos principais são evitar a degradação de resposta e viabilizar baixo tempo para geração dos lotes. Isto somente pode ser evidenciado através de indicadores de performance do servidor em si e do servidor de aplicação durante os disparos em massa.

### Construído com
Restringimos o uso de tecnologias para promover um entendimento, utilizando basicamente tecnologias web nativas (HTML, JS e CSS).

* [Bootstrap](https://getbootstrap.com/)
* [Node.js](https://nodejs.org/en/) * _para utilização de webpack_
* [Webpack](https://webpack.js.org/)
* [Webpack-dev-server](https://webpack.js.org/configuration/dev-server/) * _para implementação de proxy_

**Dependências**
* [lodash.chunk](https://lodash.com/docs/4.17.15#chunk)
* [easytimer.js](https://github.com/albert-gonzalez/easytimer.js/)



## Iniciando a aplicação

A aplicação deve ser baixada/clonada do Github e as dependências instaladas através do NPM.

### Pré-requisitos

* [Node](https://nodejs.org/en/download/)
* npm
```sh
npm install npm@latest -g
```

### Instalação

1. Clonar o repositório
```sh
git clone https://github.com/your_username_/Project-Name.git
```
3. Instalar os pacotes com NPM
```sh
npm install
```
4. Configurar a aplicação através do arquivo `env/settings.js`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
|codFlow|integer|CodFlow do processo a ser iniciado no Orquestra|
|isSimulation|boolean|Se o processo a ser iniciado será do tipo simulação|
|token|string|Token de usuário com permissão para iniciar o processo|
|urlBase|string|URL Base do ambiente da aplicação Orquestra|
|useProxy|boolean|Habilita o uso de proxy pelo webpack-dev-server afim de evitar CORS quando a chamada for realizada de um servidor externo|
|soap.chunkSize|integer|Tamanho do `chunk` (segmento) no qual serão quebradas as requisições|
|soap.chunkIntervalInMs|integer|Intervalo incremental entre `chunks` para as chamadas ao WebService SOAP `CreateInstance01`|

## Utilização

Para inicializar o servidor de aplicação
```sh
npm run start
```

Para gerar somente o build da aplicação
```sh
npm run build
```
