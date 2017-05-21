const TYPES = Object.freeze({
  SET_CONTENT: 'SET_CONTENT',
})

export const state = {
  content: '',
}

export const mutations = {
  [TYPES.SET_CONTENT] (argState, payload) {
    argState.content = payload.content
  },
}

export const actions = {
  setContent ({ commit }, data) {
    commit(TYPES.SET_CONTENT, data)
  },
}
