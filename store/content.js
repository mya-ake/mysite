const TYPES = Object.freeze({
  SET_CONTENT: 'SET_CONTENT',
})

export const state = {
  content: {
    title: '',
    body: '',
  },
}

export const mutations = {
  [TYPES.SET_CONTENT] (argState, payload) {
    argState.content = {
      title: payload.title,
      body: payload.body,
    }
  },
}

export const actions = {
  setContent ({ commit }, data) {
    commit(TYPES.SET_CONTENT, data)
  },
}
