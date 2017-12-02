const TYPES = Object.freeze({
  SET_CONTENT: 'SET_CONTENT',
})

export const state = () => {
  return {
    content: {
      title: '',
      description: '',
      body: '',
    },
  }
}

export const mutations = {
  [TYPES.SET_CONTENT] (argState, payload) {
    argState.content = {
      title: payload.title,
      description: payload.description,
      body: payload.body,
    }
  },
}

export const actions = {
  setContent ({ commit }, data) {
    commit(TYPES.SET_CONTENT, data)
  },
}
