import { apiClient } from '~/lib/apiClient'

import { createModuleTypes } from '~/helpers/store'

const moduleName = 'contents'

const MUTATION_TYPES = Object.freeze({
  SET_CONTENT: 'SET_CONTENT',
})

const ACTION_TYPES = Object.freeze({
  GET_CONTENT: 'GET_CONTENT',
})

export const CONTENTS_ACTION_TYPES = createModuleTypes({
  moduleName,
  types: ACTION_TYPES,
})

export const state = () => {
  return {
    content: {
      title: '',
      description: '',
      body: '',
      thumbnail: '',
      createdAt: '',
      updatedAt: '',
    },
  }
}

export const mutations = {
  [MUTATION_TYPES.SET_CONTENT] (argState, payload) {
    if (payload === null) {
      argState.content = {
        title: '',
        description: '',
        body: '',
        thumbnail: '',
        createdAt: '',
        updatedAt: '',
      }
    } else {
      argState.content = {
        title: payload.title,
        description: payload.description,
        body: payload.body,
        thumbnail: payload.thumbnail,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
      }
    }
  },
}

export const actions = {
  async [ACTION_TYPES.GET_CONTENT] ({ commit }, path) {
    const response = await apiClient.get(path)
    const status = response.status
    if (status !== 200) {
      // エラーハンドリングしないと
      commit(MUTATION_TYPES.SET_CONTENT, null)
    }
    return response
  },
}
