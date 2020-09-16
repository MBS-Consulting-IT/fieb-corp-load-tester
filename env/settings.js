module.exports = {
  // # Configurações Gerais #

  // CodFlow do processo a ser iniciado no Orquestra
  codFlow: 0,

  // Se o processo a ser iniciado será do tipo simulação
  // Essa opção facilita apagar as instâncias geradas pelo recurso nativo `Limpar testes`
  // Observar utilização do recurso `Limpar testes` para grandes volumes (>3000) pelo alto custo
  // de processmanto do banco de dados.
  isSimulation: true,

  // Token de usuário com permissão para iniciar o processo configurado acima
  token: '',

  // URL Base do ambiente da aplicação Orquestra
  urlBase: 'http://localhost/orquestra3926',

  // # Configurações de Webservice #

  // Habilita o uso de proxy pelo webpack-dev-server afim de evitar CORS quando a chamada
  // for realizada de um servidor diferente do Orquestra
  useProxy: false,

  // Webservice RESTful
  rest: {
    // URL do recurso RESTful :: POST /instances
    url: '/api/1.0/instances',
    // Rota de proxy
    proxyPath: '/rest'
  },

  // Webservice SOAP
  soap: {
    // URL do recurso SOAP :: POST /instance.asmx/CreateInstance01
    url: '/webservice/v2.5/instance.asmx/CreateInstance01',
    // Rota de proxy
    proxyPath: '/soap',
    // Tamanho do `chunk` (segmento) no qual serão quebradas as requisições
    // A estratégia utilizada quando chamado o WS SOAP é quebrar o volume de
    // requisições em pedaços menores.
    // Chamadas de mesma origem realizadas a partir do browser costumam ser limitadas
    // entre 4~6 chamadas por origem, sendo assim, tamanhos superiores a este representarão
    // pouca diferença de per6formance.
    chunkSize: 24,
    // Intervalo incremental entre `chunks` para as chamadas ao WS SOAP, a fim de desonerar
    // o processamento do servidor de aplicação
    chunkIntervalInMs: 1000
  }
}
