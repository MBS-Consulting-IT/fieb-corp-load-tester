import { parsePayloadToXml } from './utils'
import payload from './payload.js'
import settings from '../env/settings.js'
import Timer from 'easytimer.js'
import _chunk from 'lodash.chunk'
import './style.css'

(function PerfModule ({ payload, settings }) {
  const state = {
    ...settings,
    consoleName: 'perftest',
    done: 0,
    count: null,
    progress: null,
    timer: null,
    wsOption: 'rest',
    soapUrl: settings.useProxy
      ? settings.soap.proxyPath
      : `${settings.urlBase}${settings.soap.url}`,
    restUrl: settings.useProxy
      ? settings.rest.proxyPath
      : `${settings.urlBase}${settings.rest.url}`
  }

  const $refs = {
    form: document.querySelector('.app-form'),
    wsOption: [...document.querySelectorAll('[name=ws-option]')],
    wsUrlHint: document.querySelector('.app-ws-hint'),
    urlBase: document.querySelector('[name=urlBase]'),
    codFlow: document.querySelector('[name=codFlow]'),
    token: document.querySelector('[name=token]'),
    quantity: document.querySelector('[name=quantity]'),
    isSimulation: document.querySelector('[name=isSimulation]'),
    btnStart: document.querySelector('.js-start'),
    total: document.querySelector('.app-perf-total'),
    done: document.querySelector('.app-perf-done'),
    time: document.querySelector('.app-perf-time'),
    progress: document.querySelector('.app-perf-progress'),
    progressPanel: document.querySelector('.app-progress')
  }

  populateDefaultSettings(state)
  addTriggers()

  /**
   * Private Methods
   */
  function populateDefaultSettings (settings) {
    $refs.urlBase.value = settings.urlBase
    $refs.codFlow.value = settings.codFlow
    $refs.token.value = settings.token
    $refs.isSimulation.checked = settings.isSimulation
  }

  function addTriggers () {
    $refs.btnStart.addEventListener('click', handleStart)

    $refs.wsOption
      .forEach(inp => {
        if (inp.checked) {
          setWsType(inp)
        }
        inp.addEventListener('click', () => setWsType(inp))
      })
  }

  function handleStart (e) {
    const isFormValid = $refs.form.reportValidity()

    e.preventDefault()

    if (!isFormValid) {
      return
    }

    startPerfTest()
    mountProgress()
    addLoadindState()
  }

  function setWsType (inp) {
    $refs.wsUrlHint.textContent = state[inp.value].url
    state.wsOption = inp.value
  }

  function addLoadindState () {
    $refs.btnStart.textContent = ''
    $refs.btnStart.disabled = true
    $refs.btnStart.insertAdjacentHTML(
      'afterbegin',
      `<span class="spinner-border spinner-border-sm" role="status"></span>
       <span>Processando...</span>
      `
    )
  }

  function removeLoadindState () {
    $refs.btnStart.textContent = 'Iniciar Teste'
    $refs.btnStart.disabled = false
  }

  function mountProgress (timer) {
    $refs.total.textContent = $refs.quantity.value
    $refs.progress.style.width = '0%'
    $refs.progress.textContent = ''
    $refs.progressPanel.classList.remove('d-none')

    state.timer.addEventListener('secondsUpdated', e => {
      $refs.time.textContent = state.timer.getTimeValues().toString()
    })
  }

  function startPerfTest () {
    console.time(state.consoleName)

    state.count = parseInt($refs.quantity.value)
    state.done = 0
    state.progress = 0
    state.timer = new Timer()
    state.timer.start()
    createInstance[state.wsOption](state.count, state.done)
  }

  function updatePerfTest (done) {
    state.done = done
    state.progress = getProgressPercent(state.count, done)

    $refs.done.textContent = state.done
    $refs.progress.style.width = `${(state.progress).toFixed(2)}%`
    $refs.progress.textContent = `${Math.round(state.progress)}%`
  }

  function getProgressPercent (count, done) {
    return done * 100 / count
  }

  function finishPerfTest () {
    state.timer.stop()
    console.timeEnd(state.consoleName)

    removeLoadindState()
  }

  const createInstance = {
    rest (count, done) {
      fetch(state.restUrl, {
        method: 'post',
        headers: {
          Authorization: $refs.token.value,
          'Content-Type': 'application/json'
        },
        body: getPayload[state.wsOption](payload)
      })
        .then(res => res.json())
        .then(data => {
          console.log(done)
          done++

          if (done <= count) {
            updatePerfTest(done)
            createInstance[state.wsOption](count, done)
          } else {
            finishPerfTest()
          }
        })
        .catch(console.error)
    },

    soap (count, done) {
      const xml = parsePayloadToXml(payload)
      const chunks = _chunk(
        Array(count).fill(null),
        state.soap.chunkSize
      )
      chunks.forEach((chunk, i) => {
        const sleep = state.soap.chunkIntervalInMs * i

        setTimeout(() => {
          chunk.forEach(() => {
            fetch(state.soapUrl, {
              method: 'post',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: `Token=${$refs.token.value}&CodFlow=${$refs.codFlow.value}&Simulation=${$refs.isSimulation.checked}&XmlValues=${xml}`
            })
              .then(data => {
                console.log(done)
                done++

                updatePerfTest(done)

                if (done === count) {
                  finishPerfTest()
                }
              })
          })
        }, sleep)
      })
    }
  }

  const getPayload = {
    rest (payload) {
      return JSON.stringify({
        ...payload,
        flow: {
          id: $refs.codFlow.value
        },
        simulation: $refs.isSimulation.checked
      })
    }
  }
})({ payload, settings })
